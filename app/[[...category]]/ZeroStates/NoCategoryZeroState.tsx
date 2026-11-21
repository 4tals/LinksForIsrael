"use client";

import Link from "next/link";
import React, { useContext } from "react";

import { getNumberOfInitiatives } from "@/app/components/Categories/CategoriesList";
import { CategoryContent } from "@/app/components/Categories/CategoryContent";
import { Logo } from "@/app/components/Logo";
import { SearchContext } from "@/app/components/RootApp";
import { SearchInput } from "@/app/components/Search/SearchInput";
import { analyticsService } from "@/app/utils/analytica/analytics";
import { Category, SubCategoryData } from "@/app/utils/categories";
import {
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Image,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";

const QUICK_SEARCH_TAGS = [
	"תרומות",
	"תמיכה נפשית",
	"מפונים",
	"מילואים",
	"חקלאות",
	"הסברה",
	"הסעות",
];

interface NoCategoryZeroStateProps {
	categories: Category[];
	assistanceSubCategory: SubCategoryData;
}

export const NoCategoryZeroState: React.FC<NoCategoryZeroStateProps> = ({
	categories,
	assistanceSubCategory,
}) => {
	const { onSearch } = useContext(SearchContext);

	const totalInitiatives =
		categories.reduce((acc, cat) => acc + getNumberOfInitiatives(cat), 0) +
		assistanceSubCategory.links.length;

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
				mb={8}
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
					maxW="680px"
					mx="auto"
					position="relative"
					zIndex={1}
				>
					<HStack spacing={2}>
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
							{totalInitiatives} יוזמות ומשאבים
						</Badge>
					</HStack>

					<Heading
						as="h2"
						fontSize={{ base: "2xl", md: "4xl" }}
						fontWeight="bold"
						color="brand.700"
						lineHeight="1.2"
					>
						ברוכים הבאים לפורטל ״לינק לישראל״
					</Heading>

					<Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
						פרויקט קוד פתוח המרכז יוזמות אזרחיות, סיוע, התנדבות ומידע חיוני
						במקום אחד.
					</Text>

					<Box w="100%" maxW="520px" pt={2}>
						<SearchInput
							id="searchInputHero"
							size="lg"
							placeholder="חפשו יוזמה, עמותה או סוג סיוע..."
						/>
					</Box>

					<Flex wrap="wrap" justify="center" gap={2} pt={1}>
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

			{/* Category Grid */}
			<Box mb={10}>
				<Flex align="baseline" justify="space-between" mb={4}>
					<Heading as="h3" size="md" color="gray.800">
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
				/>
			</Box>
		</Box>
	);
};
