"use client";

import React, { useContext } from "react";

import { NoCategoryZeroState } from "@/app/[[...category]]/ZeroStates/NoCategoryZeroState";
import { NoResultsZeroState } from "@/app/[[...category]]/ZeroStates/NoResultsZeroState";
import { CategoryContent } from "@/app/components/Categories/CategoryContent";
import { SearchContext } from "@/app/components/RootApp";
import { Category, SubCategoryData } from "@/app/utils/categories";
import { Badge, Box, Button, Flex, Text, VStack } from "@chakra-ui/react";

interface Props {
	categories: Array<Category>;
	assistanceSubCategory: SubCategoryData;
	categoryId?: string;
	subCategoryName?: string;
	linkName?: string;
}

export const Body: React.FC<Props> = ({
	categories,
	categoryId,
	subCategoryName,
	linkName,
	assistanceSubCategory,
}) => {
	const { search, mappedSearchTerm, results, totalResults, onSearch } =
		useContext(SearchContext);

	const pageCategory = categoryId
		? categories.find((category) => category.id === categoryId)
		: null;

	if (search.trim()) {
		return (
			<Box className="desktop-content" pt={4}>
				<Flex
					align="center"
					justify="space-between"
					wrap="wrap"
					gap={3}
					bg="white"
					p={4}
					borderRadius="xl"
					borderWidth="1px"
					borderColor="gray.200"
					mb={4}
				>
					<Flex align="center" gap={2} wrap="wrap">
						<Text fontWeight="bold" color="gray.800">
							תוצאות חיפוש עבור &ldquo;{mappedSearchTerm || search}&rdquo;
						</Text>
						<Badge colorScheme="blue" borderRadius="full" px={2.5} py={0.5}>
							{totalResults} תוצאות
						</Badge>
						{mappedSearchTerm && (
							<Text fontSize="xs" color="gray.500">
								(הומר אוטומטית ממקלדת אנגלית: &ldquo;{search}&rdquo;)
							</Text>
						)}
					</Flex>
					<Button
						size="sm"
						variant="ghost"
						colorScheme="blue"
						onClick={() => onSearch("")}
					>
						נקה חיפוש
					</Button>
				</Flex>

				{results.length > 0 ? (
					<VStack spacing={6} align="stretch">
						{results.map((category) => (
							<Box key={category.id || category.displayName}>
								<CategoryContent
									categoryId={category.id}
									subCategories={category.subCategories}
									categoryName={category.displayName}
									categoryDescription={category.description}
									headingAs="h2"
								/>
							</Box>
						))}
					</VStack>
				) : (
					<NoResultsZeroState />
				)}
			</Box>
		);
	}

	if (pageCategory) {
		return (
			<Box className="desktop-content" pt={2}>
				<CategoryContent
					categoryId={pageCategory.id}
					subCategories={pageCategory.subCategories}
					categoryName={pageCategory.displayName}
					categoryDescription={pageCategory.description}
					initialSubCategoryName={subCategoryName}
					initialLinkName={linkName}
				/>
				<Box mt={6}>
					<CategoryContent
						categoryId="GeneralAssistance"
						subCategories={[assistanceSubCategory]}
					/>
				</Box>
			</Box>
		);
	}

	return (
		<NoCategoryZeroState
			categories={categories}
			assistanceSubCategory={assistanceSubCategory}
		/>
	);
};
