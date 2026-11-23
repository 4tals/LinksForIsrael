"use client";

import dynamic from "next/dynamic";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import { portalPath } from "@/app/utils/portalPath";
import {
	getUrlParams,
	parseTrustFiltersFromParams,
	trustFiltersToUrlPatch,
	updateUrlParams,
} from "@/app/utils/urlState";
import { Box, Button, Text } from "@chakra-ui/react";

import {
	CountryCode,
	InitiativeLink,
	SubCategoryData,
} from "../../utils/categories";
import {
	CountryChips,
	matchesCountry,
	parseCountryParam,
} from "../Filters/CountryChips";
import {
	filterInitiativesByTrust,
	hasActiveTrustFilters,
	INITIAL_TRUST_FILTER,
	TrustFilterBar,
	TrustFilterState,
} from "../Filters/TrustFilterBar";
import { ShowMoreModal } from "../Initiative/InitiativeShowMoreModal";
import { ShareSection } from "../Share/ShareSection";
import { SubCategoriesList } from "./SubCategoriesList";

const DialogModal = dynamic(
	() => import("../DialogModal/DialogModal").then((m) => m.DialogModal),
	{ ssr: false },
);

interface CategoryContentProps {
	categoryId?: string;
	categoryName?: string;
	subCategories: SubCategoryData[];
	categoryDescription?: string;
	initialSubCategoryName?: string;
	initialLinkName?: string;
	headingAs?: "h1" | "h2";
	enableTrustFilters?: boolean;
	categoryHref?: string;
	onCategoryJump?: () => void;
}

const containsHebrewLetters = (str: string): boolean =>
	/[\u0590-\u05EA]/.test(str);

export const CategoryContent = ({
	categoryId,
	categoryName,
	subCategories,
	categoryDescription,
	initialSubCategoryName,
	initialLinkName,
	headingAs = "h1",
	enableTrustFilters = true,
	categoryHref,
	onCategoryJump,
}: CategoryContentProps) => {
	const [openDialog, setOpenDialogState] = useState(false);
	const [description, setDescriptionState] = useState<{
		body: React.ReactNode;
		link: InitiativeLink;
	} | null>(null);
	const [trustFilters, setTrustFiltersState] =
		useState<TrustFilterState>(INITIAL_TRUST_FILTER);
	const [country, setCountryState] = useState<CountryCode | null>(null);
	const showCountryChips = categoryId === "Abroad";
	const openedCardRef = useRef<string | null>(null);

	const setOpenDialog = useCallback((open: boolean) => {
		setOpenDialogState(open);
		if (!open && openedCardRef.current) {
			openedCardRef.current = null;
			updateUrlParams({ card: null });
		}
	}, []);

	const setDescription = useCallback(
		(next: { body: React.ReactNode; link: InitiativeLink } | null) => {
			setDescriptionState(next);
			if (next?.link?.name) {
				openedCardRef.current = next.link.name;
				updateUrlParams({ card: next.link.name });
			}
		},
		[],
	);

	const handleTrustFiltersChange = useCallback(
		(next: TrustFilterState) => {
			setTrustFiltersState(next);
			if (enableTrustFilters) {
				updateUrlParams(trustFiltersToUrlPatch(next, { includeIntent: true }));
			}
		},
		[enableTrustFilters],
	);

	const handleCountryChange = useCallback((next: CountryCode | null) => {
		setCountryState(next);
		updateUrlParams({ country: next });
	}, []);

	const openCardByName = useCallback(
		(targetName: string, targetSub?: string): boolean => {
			for (const sub of subCategories) {
				if (targetSub && sub.name !== targetSub) continue;
				const matched = sub.links.find((item) => item.name === targetName);
				if (matched) {
					const sharePath = categoryId
						? portalPath(categoryId, sub.name, matched.name)
						: undefined;
					openedCardRef.current = matched.name;
					setDescriptionState({
						link: matched,
						body: (
							<ShowMoreModal
								link={matched}
								setOpenDialog={setOpenDialog}
								sharePath={sharePath}
							/>
						),
					});
					setOpenDialogState(true);
					return true;
				}
			}
			return false;
		},
		[categoryId, subCategories, setOpenDialog],
	);

	// Hydrate trust filters & ?card=... from URL on mount and browser Back/Forward
	useEffect(() => {
		const syncFromUrl = () => {
			const params = getUrlParams();
			if (enableTrustFilters) {
				setTrustFiltersState(parseTrustFiltersFromParams(params));
			}
			setCountryState(
				showCountryChips ? parseCountryParam(params.get("country")) : null,
			);
			const urlCard = params.get("card");
			if (urlCard) {
				openCardByName(urlCard);
			} else if (openedCardRef.current) {
				openedCardRef.current = null;
				setOpenDialogState(false);
			}
		};

		syncFromUrl();
		window.addEventListener("popstate", syncFromUrl);
		return () => window.removeEventListener("popstate", syncFromUrl);
	}, [categoryId, enableTrustFilters, openCardByName, showCountryChips]);

	const allCategoryLinks = useMemo(
		() => subCategories.flatMap((s) => s.links),
		[subCategories],
	);

	const filteredSubCategories = useMemo(() => {
		const trustActive =
			enableTrustFilters && hasActiveTrustFilters(trustFilters);
		if (!trustActive && !country) {
			return subCategories;
		}
		return subCategories
			.map((sub) => {
				const links = sub.links.filter((link) => matchesCountry(link, country));
				return {
					...sub,
					links: trustActive
						? filterInitiativesByTrust(links, trustFilters, categoryId)
						: links,
				};
			})
			.filter((sub) => sub.links.length > 0);
	}, [subCategories, trustFilters, categoryId, enableTrustFilters, country]);

	const totalFilteredCount = useMemo(
		() => filteredSubCategories.reduce((acc, sub) => acc + sub.links.length, 0),
		[filteredSubCategories],
	);

	// Handle path deep links: /[category]/[subCategory] or /[category]/[subCategory]/[linkName]
	useEffect(() => {
		if (!initialSubCategoryName && !initialLinkName) return;

		const decodedSub = initialSubCategoryName
			? decodeURIComponent(initialSubCategoryName)
			: undefined;
		const decodedLink = initialLinkName
			? decodeURIComponent(initialLinkName)
			: undefined;

		if (decodedLink) {
			openCardByName(decodedLink, decodedSub);
		} else if (decodedSub) {
			const el = document.getElementById(`subcategory-${decodedSub}`);
			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}
	}, [initialSubCategoryName, initialLinkName, openCardByName]);

	return (
		<>
			{description && (
				<DialogModal
					title={description.link.displayName || ""}
					body={description.body || null}
					open={Boolean(openDialog && description)}
					toggleModal={setOpenDialog}
					isRtl={containsHebrewLetters(description.link.displayName || "א")}
				/>
			)}

			{categoryName && (
				<ShareSection
					categoryName={categoryName}
					categoryDescription={categoryDescription}
					headingAs={headingAs}
					categoryHref={categoryHref}
					onCategoryJump={onCategoryJump}
				/>
			)}

			{showCountryChips && (
				<CountryChips
					value={country}
					onChange={handleCountryChange}
					locale="he"
				/>
			)}

			{enableTrustFilters && (
				<TrustFilterBar
					links={allCategoryLinks}
					value={trustFilters}
					onChange={handleTrustFiltersChange}
					totalFilteredCount={totalFilteredCount}
					categoryId={categoryId}
					locale="he"
				/>
			)}

			{filteredSubCategories.length === 0 ? (
				<Box
					bg="white"
					borderRadius="xl"
					borderWidth="1px"
					borderColor="gray.200"
					p={8}
					textAlign="center"
				>
					<Text color="gray.600" mb={3}>
						לא נמצאו יוזמות התואמות לכל תנאי הסינון שנבחרו.
					</Text>
					<Button
						size="sm"
						colorScheme="blue"
						borderRadius="full"
						onClick={() => {
							handleTrustFiltersChange(INITIAL_TRUST_FILTER);
							handleCountryChange(null);
						}}
					>
						נקה סינון
					</Button>
				</Box>
			) : (
				<SubCategoriesList
					categoryId={categoryId}
					subCategories={filteredSubCategories}
					setDescription={setDescription}
					setOpenDialog={setOpenDialog}
				/>
			)}
		</>
	);
};
