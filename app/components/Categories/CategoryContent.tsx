"use client";

import React, { useEffect, useMemo, useState } from "react";

import { Box, Button, Text } from "@chakra-ui/react";

import { InitiativeLink, SubCategoryData } from "../../utils/categories";
import { DialogModal } from "../DialogModal/DialogModal";
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

interface CategoryContentProps {
	categoryId?: string;
	categoryName?: string;
	subCategories: SubCategoryData[];
	categoryDescription?: string;
	initialSubCategoryName?: string;
	initialLinkName?: string;
	headingAs?: "h1" | "h2";
	enableTrustFilters?: boolean;
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
}: CategoryContentProps) => {
	const [openDialog, setOpenDialog] = useState(false);
	const [description, setDescription] = useState<{
		body: React.ReactNode;
		link: InitiativeLink;
	} | null>(null);
	const [trustFilters, setTrustFilters] =
		useState<TrustFilterState>(INITIAL_TRUST_FILTER);

	// Reset local category filters when switching categories
	useEffect(() => {
		setTrustFilters(INITIAL_TRUST_FILTER);
	}, [categoryId]);

	const allCategoryLinks = useMemo(
		() => subCategories.flatMap((s) => s.links),
		[subCategories],
	);

	const filteredSubCategories = useMemo(() => {
		if (!enableTrustFilters || !hasActiveTrustFilters(trustFilters)) {
			return subCategories;
		}
		return subCategories
			.map((sub) => ({
				...sub,
				links: filterInitiativesByTrust(sub.links, trustFilters, categoryId),
			}))
			.filter((sub) => sub.links.length > 0);
	}, [subCategories, trustFilters, categoryId, enableTrustFilters]);

	const totalFilteredCount = useMemo(
		() => filteredSubCategories.reduce((acc, sub) => acc + sub.links.length, 0),
		[filteredSubCategories],
	);

	// Handle deep links: /[category]/[subCategory] or /[category]/[subCategory]/[linkName]
	useEffect(() => {
		if (!initialSubCategoryName && !initialLinkName) return;

		const decodedSub = initialSubCategoryName
			? decodeURIComponent(initialSubCategoryName)
			: undefined;
		const decodedLink = initialLinkName
			? decodeURIComponent(initialLinkName)
			: undefined;

		if (decodedLink) {
			for (const sub of subCategories) {
				if (decodedSub && sub.name !== decodedSub) continue;
				const matched = sub.links.find((item) => item.name === decodedLink);
				if (matched) {
					const sharePath = categoryId
						? `/${encodeURIComponent(categoryId)}/${encodeURIComponent(
								sub.name,
							)}/${encodeURIComponent(matched.name)}`
						: undefined;
					setDescription({
						link: matched,
						body: (
							<ShowMoreModal
								link={matched}
								setOpenDialog={setOpenDialog}
								sharePath={sharePath}
							/>
						),
					});
					setOpenDialog(true);
					return;
				}
			}
		} else if (decodedSub) {
			const el = document.getElementById(`subcategory-${decodedSub}`);
			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}
	}, [categoryId, initialSubCategoryName, initialLinkName, subCategories]);

	return (
		<>
			<DialogModal
				title={description?.link.displayName || ""}
				body={description?.body || null}
				open={Boolean(openDialog && description)}
				toggleModal={setOpenDialog}
				isRtl={containsHebrewLetters(description?.link.displayName || "א")}
			/>

			{categoryName && (
				<ShareSection
					categoryName={categoryName}
					categoryDescription={categoryDescription}
					headingAs={headingAs}
				/>
			)}

			{enableTrustFilters && (
				<TrustFilterBar
					links={allCategoryLinks}
					value={trustFilters}
					onChange={setTrustFilters}
					totalFilteredCount={totalFilteredCount}
					categoryId={categoryId}
					locale="he"
				/>
			)}

			{filteredSubCategories.length === 0 &&
			hasActiveTrustFilters(trustFilters) ? (
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
						onClick={() => setTrustFilters(INITIAL_TRUST_FILTER)}
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
