"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { FaHandHoldingHeart, FaHandsHelping, FaLifeRing } from "react-icons/fa";

import { getNumberOfInitiatives } from "@/app/components/Categories/CategoriesList";
import { CategoryContent } from "@/app/components/Categories/CategoryContent";
import { HotlinesBar } from "@/app/components/Hotlines/HotlinesBar";
import { Logo } from "@/app/components/Logo";
import { LifeEventPathways } from "@/app/components/Pathways/LifeEventPathways";
import { SearchContext } from "@/app/components/RootApp";
import { SearchInput } from "@/app/components/Search/SearchInput";
import { analyticsService } from "@/app/utils/analytica/analytics";
import {
	Category,
	InitiativeIntent,
	SubCategoryData,
} from "@/app/utils/categories";
import {
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Icon,
	Image,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";

const QUICK_SEARCH_TAGS = [
	"התנדבות",
	"סיוע נפשי",
	"זכויות",
	"מילואים",
	"תרומות",
	"חקלאות",
	"הסברה",
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

	const totalInitiatives = categories.reduce(
		(acc, cat) => acc + getNumberOfInitiatives(cat),
		0,
	);

	return (
		<Box px={{ base: 3, md: 6 }} pt={{ base: 5, md: 8 }} pb={8}>
			{/* Hero Section */}
			<Box
				bg="white"
				borderRadius="2xl"
				borderWidth="1px"
				borderColor="gray.200"
				boxShadow="sm"
				p={{ base: 6, md: 10 }}
				mb={6}
				position="relative"
				overflow="hidden"
			>
				<Box
					position="absolute"
					left={{ base: "-40px", md: "20px" }}
					top="50%"
					transform="translateY(-50%)"
					opacity={0.06}
					pointerEvents="none"
					display={{ base: "none", sm: "block" }}
				>
					<Logo width={260} height={290} />
				</Box>

				<VStack
					spacing={4}
					align="center"
					textAlign="center"
					maxW="700px"
					mx="auto"
					position="relative"
					zIndex={1}
				>
					<HStack spacing={2} wrap="wrap" justify="center">
						<Badge
							colorScheme="blue"
							variant="subtle"
							px={3}
							py={1}
							borderRadius="full"
							fontSize="xs"
						>
							{categories.length} תחומים
						</Badge>
						<Badge
							colorScheme="blue"
							variant="subtle"
							px={3}
							py={1}
							borderRadius="full"
							fontSize="xs"
						>
							{totalInitiatives} עמותות ויוזמות מאומתות
						</Badge>
						<Badge
							colorScheme="green"
							variant="subtle"
							px={3}
							py={1}
							borderRadius="full"
							fontSize="xs"
						>
							קוד פתוח · בשגרה ובחירום
						</Badge>
					</HStack>

					<Heading
						as="h1"
						fontSize={{ base: "2xl", md: "4xl" }}
						fontWeight="bold"
						color="brand.700"
						lineHeight="1.2"
					>
						פורטל לינק לישראל
					</Heading>

					<Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
						המדריך הפתוח להתנדבות, עמותות, סיוע נפשי, זכויות אזרחים ויוזמות
						קהילתיות בישראל — בשגרה ובחירום.
					</Text>

					{/* Intent Quick-Start Buttons */}
					<Flex wrap="wrap" justify="center" gap={2.5} pt={1}>
						{INTENT_BUTTONS.map((btn) => (
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
					</Flex>

					<Box w="100%" maxW="540px" pt={1}>
						<SearchInput
							id="searchInputHero"
							size="lg"
							placeholder="חפשו עמותה, מוקד סיוע, התנדבות או תחום..."
						/>
					</Box>

					<Flex wrap="wrap" justify="center" gap={2}>
						{QUICK_SEARCH_TAGS.map((tag) => (
							<Button
								key={tag}
								size="xs"
								variant="outline"
								colorScheme="blue"
								borderRadius="full"
								fontWeight="medium"
								onClick={() => onSearch(tag)}
								_hover={{ bg: "blue.50" }}
							>
								{tag}
							</Button>
						))}
					</Flex>
				</VStack>
			</Box>

			{/* Essential Hotlines Strip */}
			<HotlinesBar />

			{/* Guided Life-Event Pathways */}
			<LifeEventPathways />

			{/* Category Grid */}
			<Box mb={10}>
				<Flex align="baseline" justify="space-between" mb={4}>
					<Heading as="h2" size="md" color="gray.800">
						בחרו תחום
					</Heading>
					<Text fontSize="sm" color="gray.500">
						לחצו על קטגוריה לצפייה בכל היוזמות
					</Text>
				</Flex>

				<SimpleGrid
					columns={{ base: 2, sm: 3, lg: 4 }}
					spacing={{ base: 3, md: 4 }}
				>
					{categories.map((category) => {
						const count = getNumberOfInitiatives(category);
						return (
							<Flex
								key={category.id}
								as={Link}
								href={`/${category.id}`}
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
								}}
								justify="space-between"
								gap={3}
							>
								<Flex align="center" justify="space-between" gap={2}>
									{category.image && (
										<Box
											p={2}
											bg="brand.50"
											borderRadius="lg"
											display="inline-flex"
										>
											<Image
												src={category.image}
												alt=""
												boxSize={{ base: "32px", md: "38px" }}
												objectFit="contain"
											/>
										</Box>
									)}
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
										color="gray.800"
										lineHeight="1.3"
									>
										{category.displayName}
									</Text>
									{category.description && (
										<Text
											fontSize="xs"
											color="gray.500"
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

			{/* General Assistance Section */}
			<Box>
				<CategoryContent
					categoryId="GeneralAssistance"
					subCategories={[assistanceSubCategory]}
					headingAs="h2"
					enableTrustFilters={false}
				/>
			</Box>
		</Box>
	);
};
