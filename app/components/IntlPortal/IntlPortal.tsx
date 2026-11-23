"use client";

import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	FaBullhorn,
	FaGlobe,
	FaHandHoldingHeart,
	FaHandsHelping,
	FaHeartbeat,
	FaPlaneArrival,
	FaSearch,
	FaShareAlt,
	FaStarOfDavid,
} from "react-icons/fa";

import {
	filterInitiativesByTrust,
	hasActiveTrustFilters,
	INITIAL_TRUST_FILTER,
	TrustFilterBar,
	TrustFilterState,
} from "@/app/components/Filters/TrustFilterBar";
import { GuidesHub } from "@/app/components/Guides/GuidesHub";
import { PortalHero } from "@/app/components/Hero/PortalHero";
import { HotlinesBar } from "@/app/components/Hotlines/HotlinesBar";
import { InitiativeItem } from "@/app/components/Initiative/InitiativeItem";
import { ShowMoreModal } from "@/app/components/Initiative/InitiativeShowMoreModal";
import { LifeEventPathways } from "@/app/components/Pathways/LifeEventPathways";
import {
	getUrlParams,
	parseTrustFiltersFromParams,
	trustFiltersToUrlPatch,
	updateUrlParams,
} from "@/app/utils/urlState";
import { CloseIcon } from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	SimpleGrid,
	Text,
	useToast,
} from "@chakra-ui/react";

import { EnrichedIntlInitiative } from "./intlCatalog";

const DialogModal = dynamic(
	() =>
		import("@/app/components/DialogModal/DialogModal").then(
			(m) => m.DialogModal,
		),
	{ ssr: false },
);

const EN_CATEGORIES = [
	{
		id: "donate",
		label: "Humanitarian & Donations",
		desc: "Food security, emergency relief, medical equipment & verified charities",
		icon: FaHandHoldingHeart,
		bg: "purple.50",
		color: "purple.700",
	},
	{
		id: "rehab",
		label: "Veterans & Mental Health",
		desc: "24/7 crisis helplines, trauma care, rehabilitation & disability support",
		icon: FaHeartbeat,
		bg: "red.50",
		color: "red.600",
	},
	{
		id: "volunteer",
		label: "Volunteering & Community",
		desc: "Hands-on NGOs, agricultural harvesting, youth & roadside rescue",
		icon: FaHandsHelping,
		bg: "teal.50",
		color: "teal.700",
	},
	{
		id: "olim",
		label: "Aliyah, Olim & Transfers",
		desc: "Official Aliyah agencies, Olim rights, careers, Lone Soldiers & licensed FX transfers",
		icon: FaPlaneArrival,
		bg: "blue.50",
		color: "brand.700",
	},
	{
		id: "judaism",
		label: "Judaism & Heritage",
		desc: "Masorti/Conservative & global Jewish communities, Sefaria, texts & lifecycle",
		icon: FaStarOfDavid,
		bg: "purple.50",
		color: "purple.700",
	},
	{
		id: "abroad",
		label: "Israel & Jewish Life Abroad",
		desc: "Consulates, campus safety (US/UK/FR/CA/AU), PEF/IsraelGives, Birthright & Masa",
		icon: FaGlobe,
		bg: "teal.50",
		color: "teal.700",
	},
	{
		id: "advocacy",
		label: "Advocacy & Remembrance",
		desc: "Official Oct 7 archives, National Library & global advocacy networks",
		icon: FaBullhorn,
		bg: "orange.50",
		color: "orange.700",
	},
] as const;

const EN_QUICK_TAGS = [
	"501(c)(3)",
	"aliyah",
	"money transfer",
	"abroad",
	"campus",
	"masorti",
	"judaism",
	"mental health",
	"volunteer",
];

const CATEGORY_BADGE_MAP: Record<
	string,
	{ bg: string; color: string; label: string }
> = {
	donate: {
		bg: "purple.50",
		color: "purple.700",
		label: "Humanitarian & Donations",
	},
	rehab: {
		bg: "blue.50",
		color: "blue.700",
		label: "Veterans & Mental Health",
	},
	volunteer: {
		bg: "teal.50",
		color: "teal.700",
		label: "Volunteering & Community",
	},
	olim: {
		bg: "blue.50",
		color: "brand.700",
		label: "Aliyah, Olim & Transfers",
	},
	judaism: {
		bg: "purple.50",
		color: "purple.700",
		label: "Judaism & Heritage",
	},
	abroad: {
		bg: "teal.50",
		color: "teal.700",
		label: "Israel & Jewish Life Abroad",
	},
	advocacy: {
		bg: "orange.50",
		color: "orange.700",
		label: "Advocacy & Remembrance",
	},
};

/**
 * English Portal — built from the exact same reusable primitives as the Hebrew homepage:
 * PortalHero, HotlinesBar, LifeEventPathways, Category Cards, TrustFilterBar, InitiativeItem,
 * DialogModal + ShowMoreModal, and GuidesHub.
 */
export function IntlPortal({ items }: { items: EnrichedIntlInitiative[] }) {
	const [selectedCategory, setSelectedCategoryState] = useState<string>("all");
	const [query, setQueryState] = useState("");
	const [trustFilters, setTrustFiltersState] =
		useState<TrustFilterState>(INITIAL_TRUST_FILTER);
	const [activeItem, setActiveItem] = useState<EnrichedIntlInitiative | null>(
		null,
	);
	const [isDrawerOpen, setIsDrawerOpenState] = useState(false);
	const toast = useToast();

	useEffect(() => {
		const validCats = new Set<string>([
			"all",
			...EN_CATEGORIES.map((c) => c.id),
		]);
		const syncFromUrl = () => {
			const params = getUrlParams();
			const urlCat = params.get("cat") || "all";
			setSelectedCategoryState(validCats.has(urlCat) ? urlCat : "all");
			setQueryState(params.get("q") || "");
			setTrustFiltersState(parseTrustFiltersFromParams(params));

			const urlCard = params.get("card");
			if (urlCard) {
				const matched = items.find(
					(i) =>
						i.id.toLowerCase() === urlCard.toLowerCase() ||
						i.link.name.toLowerCase() === urlCard.toLowerCase(),
				);
				if (matched) {
					setActiveItem(matched);
					setIsDrawerOpenState(true);
				}
			} else {
				setIsDrawerOpenState(false);
			}
		};

		syncFromUrl();
		window.addEventListener("popstate", syncFromUrl);
		return () => window.removeEventListener("popstate", syncFromUrl);
	}, [items]);

	const setSelectedCategory = useCallback((cat: string) => {
		setSelectedCategoryState(cat);
		updateUrlParams({ cat: cat === "all" ? null : cat });
	}, []);

	const setQuery = useCallback((nextQuery: string) => {
		setQueryState(nextQuery);
		updateUrlParams({ q: nextQuery.trim() ? nextQuery : null });
	}, []);

	const setTrustFilters = useCallback((next: TrustFilterState) => {
		setTrustFiltersState(next);
		updateUrlParams(trustFiltersToUrlPatch(next, { includeIntent: false }));
	}, []);

	const setIsDrawerOpen = useCallback((open: boolean) => {
		setIsDrawerOpenState(open);
		if (!open) {
			updateUrlParams({ card: null });
		}
	}, []);

	const openSideCard = useCallback((item: EnrichedIntlInitiative) => {
		setActiveItem(item);
		setIsDrawerOpenState(true);
		updateUrlParams({ card: item.id });
	}, []);

	const handleCopyViewUrl = async () => {
		if (typeof window === "undefined") return;
		try {
			await navigator.clipboard.writeText(window.location.href);
			toast({
				title: "View link copied",
				description: "Anyone opening this link will see your exact filters.",
				status: "success",
				duration: 2200,
				isClosable: true,
			});
		} catch {
			// Ignore
		}
	};

	const stats = useMemo(() => {
		const nihulCount = items.filter((i) => i.link.properManagement).length;
		const citationsCount = items.reduce(
			(sum, i) => sum + (i.link.references?.length || 0),
			0,
		);
		return { totalCount: items.length, nihulCount, citationsCount };
	}, [items]);

	const categoryCounts = useMemo(() => {
		const map: Record<string, number> = {};
		for (const item of items) {
			map[item.category] = (map[item.category] || 0) + 1;
		}
		return map;
	}, [items]);

	const categoryMatchedItems = useMemo(() => {
		const q = query.trim().toLowerCase();
		return items.filter((item) => {
			if (selectedCategory !== "all" && item.category !== selectedCategory) {
				return false;
			}
			if (!q) return true;
			if (q === "501(c)(3)" || q === "501c3") {
				return Boolean(item.link.us501c3);
			}
			return (
				item.name.toLowerCase().includes(q) ||
				item.summary.toLowerCase().includes(q) ||
				item.categoryLabel.toLowerCase().includes(q) ||
				item.url.toLowerCase().includes(q) ||
				item.tags.some((t) => t.toLowerCase().includes(q))
			);
		});
	}, [items, selectedCategory, query]);

	const filtered = useMemo(() => {
		if (!hasActiveTrustFilters(trustFilters)) return categoryMatchedItems;
		const allowedLinks = new Set(
			filterInitiativesByTrust(
				categoryMatchedItems.map((i) => i.link),
				trustFilters,
			),
		);
		return categoryMatchedItems.filter((item) => allowedLinks.has(item.link));
	}, [categoryMatchedItems, trustFilters]);

	return (
		<Box
			dir="ltr"
			textAlign="left"
			px={{ base: 3, md: 6 }}
			pt={{ base: 5, md: 8 }}
			pb={8}
			maxW="1440px"
			mx="auto"
		>
			{/* Shared Lazy Floating Side Card Drawer */}
			{activeItem && (
				<DialogModal
					title={activeItem.name}
					body={
						<ShowMoreModal
							link={activeItem.link}
							setOpenDialog={setIsDrawerOpen}
							sharePath={activeItem.sharePath}
							locale="en"
						/>
					}
					open={Boolean(isDrawerOpen && activeItem)}
					toggleModal={setIsDrawerOpen}
					isRtl={false}
				/>
			)}

			{/* 1. Shared Hero (identical structure to Hebrew /) */}
			<PortalHero
				locale="en"
				stats={stats}
				title="Links For Israel"
				subtitle="Every trusted link you need for Israel and Jewish life — MOJ-verified nonprofits (§46 & 501c3), Aliyah & regulated Olim services, Masorti/Conservative & global Jewish heritage, volunteering, and 24/7 hotlines."
				actionButtons={
					<>
						<Button
							size={{ base: "sm", md: "md" }}
							colorScheme="purple"
							variant="subtle"
							bg="purple.50"
							color="purple.700"
							borderWidth="1px"
							borderColor="purple.200"
							borderRadius="full"
							px={5}
							fontWeight="bold"
							leftIcon={<Icon as={FaHandHoldingHeart} />}
							onClick={() => {
								setSelectedCategory("donate");
								setTrustFilters({ ...INITIAL_TRUST_FILTER, us501c3: true });
							}}
							_hover={{ bg: "purple.100", transform: "translateY(-1px)" }}
							transition="all 0.15s ease"
						>
							Donate (501c3)
						</Button>
						<Button
							size={{ base: "sm", md: "md" }}
							colorScheme="teal"
							variant="subtle"
							bg="teal.50"
							color="teal.700"
							borderWidth="1px"
							borderColor="teal.200"
							borderRadius="full"
							px={5}
							fontWeight="bold"
							leftIcon={<Icon as={FaHandsHelping} />}
							onClick={() => setSelectedCategory("volunteer")}
							_hover={{ bg: "teal.100", transform: "translateY(-1px)" }}
							transition="all 0.15s ease"
						>
							Volunteer
						</Button>
					</>
				}
				searchSlot={
					<InputGroup size="lg">
						<InputLeftElement pointerEvents="none" color="gray.500">
							<Icon as={FaSearch} boxSize={4} />
						</InputLeftElement>
						<Input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search charities, 501(c)(3), volunteering, hotlines..."
							bg="white"
							color="gray.800"
							borderRadius="full"
							borderWidth="1px"
							borderColor="gray.200"
							_placeholder={{ color: "gray.500" }}
							aria-label="Search Israeli organizations"
						/>
						{query && (
							<InputRightElement>
								<IconButton
									aria-label="Clear search"
									icon={<CloseIcon boxSize={2.5} />}
									size="xs"
									variant="ghost"
									borderRadius="full"
									onClick={() => setQuery("")}
								/>
							</InputRightElement>
						)}
					</InputGroup>
				}
				quickTags={EN_QUICK_TAGS}
				onSelectQuickTag={(tag) => setQuery(tag)}
			/>

			{/* 2. Shared 24/7 Hotlines Strip (identical to Hebrew /) */}
			<HotlinesBar locale="en" />

			{/* 3. Shared Guided Life-Event Pathways (identical to Hebrew /) */}
			<LifeEventPathways locale="en" />

			{/* 4. Category Cards Grid (mirrors Hebrew 4-column category cards) */}
			<Box mb={8}>
				<Flex
					align="baseline"
					justify="space-between"
					mb={4}
					wrap="wrap"
					gap={2}
				>
					<Heading as="h2" size="md" color="gray.800">
						Browse by Category
					</Heading>
					<Flex align="center" gap={2}>
						{selectedCategory !== "all" && (
							<Button
								size="xs"
								variant="ghost"
								colorScheme="blue"
								borderRadius="full"
								onClick={() => setSelectedCategory("all")}
							>
								Show all ({items.length})
							</Button>
						)}
						<Button
							size="xs"
							variant="outline"
							colorScheme="gray"
							bg="white"
							borderRadius="full"
							leftIcon={<Icon as={FaShareAlt} boxSize={2.5} />}
							onClick={handleCopyViewUrl}
						>
							Share view
						</Button>
					</Flex>
				</Flex>

				<SimpleGrid
					columns={{ base: 2, md: 3, lg: 4 }}
					spacing={{ base: 3, md: 4 }}
				>
					{EN_CATEGORIES.map((cat) => {
						const active = selectedCategory === cat.id;
						const count = categoryCounts[cat.id] || 0;
						return (
							<Flex
								key={cat.id}
								as="button"
								type="button"
								onClick={() => setSelectedCategory(active ? "all" : cat.id)}
								direction="column"
								textAlign="left"
								bg={active ? "brand.50" : "white"}
								p={{ base: 4, md: 5 }}
								borderRadius="xl"
								borderWidth={active ? "2px" : "1px"}
								borderColor={active ? "brand.500" : "gray.200"}
								boxShadow="xs"
								transition="all 0.2s ease"
								_hover={{
									borderColor: "brand.400",
									boxShadow: "md",
									transform: "translateY(-3px)",
								}}
								justify="space-between"
								gap={3}
							>
								<Flex align="center" justify="space-between" gap={2} w="100%">
									<Flex
										boxSize={{ base: "42px", md: "46px" }}
										bg={cat.bg}
										color={cat.color}
										borderRadius="xl"
										align="center"
										justify="center"
										flexShrink={0}
									>
										<Icon as={cat.icon} boxSize={5} />
									</Flex>
									<Badge
										colorScheme="blue"
										variant={active ? "solid" : "subtle"}
										borderRadius="full"
										px={2.5}
										py={0.5}
										fontSize="xs"
									>
										{count} orgs
									</Badge>
								</Flex>

								<Box>
									<Text
										fontWeight="bold"
										fontSize={{ base: "sm", md: "md" }}
										color="gray.900"
										lineHeight="1.3"
									>
										{cat.label}
									</Text>
									<Text
										fontSize="xs"
										color="gray.600"
										mt={1}
										noOfLines={2}
										lineHeight="1.4"
									>
										{cat.desc}
									</Text>
								</Box>
							</Flex>
						);
					})}
				</SimpleGrid>
			</Box>

			{/* 5. Shared Reusable Trust Filter Bar */}
			<TrustFilterBar
				links={categoryMatchedItems.map((i) => i.link)}
				value={trustFilters}
				onChange={setTrustFilters}
				totalFilteredCount={filtered.length}
				locale="en"
				showIntentFilters={false}
			/>

			{/* 6. Shared InitiativeItem Cards Grid (EXACT SAME component as Hebrew /) */}
			<Box mb={10}>
				{filtered.length === 0 ? (
					<Box
						bg="white"
						borderRadius="xl"
						borderWidth="1px"
						borderColor="gray.200"
						p={10}
						textAlign="center"
					>
						<Text color="gray.600" mb={4}>
							No organizations matched your current filters.
						</Text>
						<Button
							size="sm"
							colorScheme="blue"
							borderRadius="full"
							onClick={() => {
								setQuery("");
								setSelectedCategory("all");
								setTrustFilters(INITIAL_TRUST_FILTER);
							}}
						>
							Reset filters
						</Button>
					</Box>
				) : (
					<SimpleGrid
						columns={{ base: 1, md: 2, xl: 3 }}
						spacing={{ base: 4, md: 5 }}
					>
						{filtered.map((item) => (
							<InitiativeItem
								key={item.id}
								link={item.link}
								categoryId={item.categoryId}
								subCategoryName={item.subCategoryName}
								locale="en"
								categoryBadge={
									CATEGORY_BADGE_MAP[item.category] || CATEGORY_BADGE_MAP.rehab
								}
								cardIdForCopy={item.id}
								onOpenCard={() => openSideCard(item)}
							/>
						))}
					</SimpleGrid>
				)}
			</Box>

			{/* 7. Shared Guides Hub (identical structure to Hebrew /) */}
			<GuidesHub locale="en" />
		</Box>
	);
}
