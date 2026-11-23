"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { FaHandHoldingHeart, FaHandsHelping, FaLifeRing } from "react-icons/fa";

import { getNumberOfInitiatives } from "@/app/components/Categories/CategoriesList";
import { CategoryContent } from "@/app/components/Categories/CategoryContent";
import { getCategoryIcon } from "@/app/components/Categories/categoryIcons";
import { GuidesHub } from "@/app/components/Guides/GuidesHub";
import { PortalHero } from "@/app/components/Hero/PortalHero";
import { HotlinesBar } from "@/app/components/Hotlines/HotlinesBar";
import { LifeEventPathways } from "@/app/components/Pathways/LifeEventPathways";
import { SearchContext } from "@/app/components/RootApp";
import { SearchInput } from "@/app/components/Search/SearchInput";
import { analyticsService } from "@/app/utils/analytica/analytics";
import {
	Category,
	InitiativeIntent,
	SubCategoryData,
} from "@/app/utils/categories";
import { portalPath } from "@/app/utils/portalPath";
import {
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	SimpleGrid,
	Text,
} from "@chakra-ui/react";

const QUICK_SEARCH_TAGS = [
	"עלייה",
	"העברת כספים",
	"יהדות",
	"סיוע נפשי",
	"התנדבות",
	"זכויות",
	"תרומות",
	"מילואים",
];

const INTENT_BUTTONS: Array<{
	id: InitiativeIntent;
	label: string;
	icon: React.ElementType;
	colorScheme: string;
}> = [
	{
		id: "get-help",
		label: "אני צריך עזרה",
		icon: FaLifeRing,
		colorScheme: "blue",
	},
	{
		id: "volunteer",
		label: "רוצה להתנדב",
		icon: FaHandsHelping,
		colorScheme: "teal",
	},
	{
		id: "donate",
		label: "רוצה לתרום ולתמוך",
		icon: FaHandHoldingHeart,
		colorScheme: "purple",
	},
];

interface NoCategoryZeroStateProps {
	categories: Category[];
	assistanceSubCategory: SubCategoryData;
}

export const NoCategoryZeroState: React.FC<NoCategoryZeroStateProps> = ({
	categories,
	assistanceSubCategory,
}) => {
	const { onSearch, setActiveIntent } = useContext(SearchContext);

	const allLinks = categories.flatMap((c) =>
		c.subCategories.flatMap((s) => s.links),
	);
	const totalInitiatives = allLinks.length;
	const nihulCount = allLinks.filter((l) => l.properManagement).length;
	const totalMentions = allLinks.reduce(
		(sum, l) => sum + (l.references?.length || 0),
		0,
	);

	return (
		<Box px={{ base: 3, md: 6 }} pt={{ base: 5, md: 8 }} pb={8}>
			{/* Shared Hero Section */}
			<PortalHero
				locale="he"
				stats={{
					totalCount: totalInitiatives,
					nihulCount,
					citationsCount: totalMentions,
				}}
				title="לינק לישראל"
				subtitle="השער הפתוח והמאומת לכל מה שחשוב בישראל ובעולם היהודי — עמותות וניהול תקין, סיוע נפשי 24/7, עלייה וקליטה, יהדות ומורשת, זכויות, התנדבות ושירותים מפוקחים."
				actionButtons={INTENT_BUTTONS.map((btn) => (
					<Button
						key={btn.id}
						size={{ base: "sm", md: "md" }}
						colorScheme={btn.colorScheme}
						variant="subtle"
						bg={`${btn.colorScheme}.50`}
						color={`${btn.colorScheme}.700`}
						borderWidth="1px"
						borderColor={`${btn.colorScheme}.200`}
						borderRadius="full"
						px={5}
						fontWeight="bold"
						leftIcon={<Icon as={btn.icon} />}
						onClick={() => setActiveIntent(btn.id)}
						_hover={{
							bg: `${btn.colorScheme}.100`,
							transform: "translateY(-1px)",
						}}
						transition="all 0.15s ease"
					>
						{btn.label}
					</Button>
				))}
				searchSlot={
					<SearchInput
						id="searchInputHero"
						size="lg"
						placeholder="חפשו עמותה, מוקד סיוע, התנדבות או תחום..."
					/>
				}
				quickTags={QUICK_SEARCH_TAGS}
				onSelectQuickTag={(tag) => onSearch(tag)}
			/>

			{/* Shared 24/7 Hotlines Strip */}
			<HotlinesBar locale="he" />

			{/* Shared Guided Life-Event Pathways */}
			<LifeEventPathways locale="he" />

			{/* Category Grid */}
			<Box mb={10}>
				<Flex align="baseline" justify="space-between" mb={4}>
					<Heading as="h2" size="md" color="gray.800">
						בחרו תחום
					</Heading>
					<Text fontSize="sm" color="gray.600">
						לחצו על קטגוריה לצפייה בכל היוזמות
					</Text>
				</Flex>

				<SimpleGrid
					columns={{ base: 2, sm: 3, lg: 4 }}
					spacing={{ base: 3, md: 4 }}
				>
					{categories.map((category) => {
						const count = getNumberOfInitiatives(category);
						const catIcon = getCategoryIcon(category.id);
						return (
							<Flex
								key={category.id}
								as={Link}
								href={portalPath(category.id)}
								onClick={() => analyticsService.trackCategoryView(category.id)}
								direction="column"
								bg="white"
								p={{ base: 4, md: 5 }}
								borderRadius="xl"
								borderWidth="1px"
								borderColor="gray.200"
								boxShadow="xs"
								transition="all 0.2s ease"
								_hover={{
									borderColor: "brand.400",
									boxShadow: "md",
									transform: "translateY(-3px)",
									textDecoration: "none",
								}}
								justify="space-between"
								gap={3}
							>
								<Flex align="center" justify="space-between" gap={2}>
									<Flex
										boxSize={{ base: "42px", md: "46px" }}
										bg={catIcon.bg}
										color={catIcon.color}
										borderRadius="xl"
										align="center"
										justify="center"
										flexShrink={0}
									>
										<Icon as={catIcon.icon} boxSize={5} />
									</Flex>
									<Badge
										colorScheme="blue"
										variant="subtle"
										borderRadius="full"
										px={2.5}
										py={0.5}
										fontSize="xs"
									>
										{count} יוזמות
									</Badge>
								</Flex>

								<Box>
									<Text
										fontWeight="bold"
										fontSize={{ base: "sm", md: "md" }}
										color="gray.900"
										lineHeight="1.3"
									>
										{category.displayName}
									</Text>
									{category.description && (
										<Text
											fontSize="xs"
											color="gray.600"
											mt={1}
											noOfLines={2}
											lineHeight="1.4"
										>
											{category.description}
										</Text>
									)}
								</Box>
							</Flex>
						);
					})}
				</SimpleGrid>
			</Box>

			{/* Shared Evergreen Guides Hub */}
			<GuidesHub locale="he" />

			{/* Featured General Assistance Preview */}
			<Box>
				<CategoryContent
					categoryId="GeneralAssistance"
					subCategories={[
						{
							...assistanceSubCategory,
							links: assistanceSubCategory.links.slice(0, 6),
						},
					]}
					headingAs="h2"
					enableTrustFilters={false}
					categoryHref="/generalassistance"
				/>
				{assistanceSubCategory.links.length > 6 && (
					<Flex justify="center" mt={5}>
						<Button
							as={Link}
							href="/generalassistance"
							variant="outline"
							colorScheme="blue"
							bg="white"
							borderRadius="full"
							px={6}
							size="sm"
						>
							לכל {assistanceSubCategory.links.length} יוזמות ההתנדבות, הזכויות
							והקהילה ←
						</Button>
					</Flex>
				)}
			</Box>
		</Box>
	);
};
