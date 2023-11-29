"use client";

import React, { useContext } from "react";

import { NoCategoryZeroState } from "@/app/[[...category]]/ZeroStates/NoCategoryZeroState";
import { NoResultsZeroState } from "@/app/[[...category]]/ZeroStates/NoResultsZeroState";
import { CategoryContent } from "@/app/components/Categories/CategoryContent";
import { SearchContext } from "@/app/components/RootApp";
import { Category, SubCategoryData } from "@/app/utils/categories";
import { Box, VStack, Text } from "@chakra-ui/react";

interface Props {
	categories: Array<Category>;
	assistanceSubCategory: SubCategoryData;
	categoryId?: string;
}

export const Body: React.FC<Props> = ({
	categories,
	categoryId,
	assistanceSubCategory,
}) => {
	const { search, results } = useContext(SearchContext);
	const pageCategory = categoryId
		? categories.find((category) => category.id === categoryId)
		: null;

	if (search) {
		return (
			<Box>
				{results.length > 0 ? (
					results.map((category) => (
						<VStack key={category.id} spacing={4}>
							<Text fontSize="2xl" fontWeight="bold">
								{category.displayName}
							</Text>
							<CategoryContent
								subCategories={category.subCategories}
								categoryName={category.displayName}
								categoryDescription={category.description}
							/>
						</VStack>
					))
				) : (
					<NoResultsZeroState />
				)}
			</Box>
		);
	}

	if (pageCategory) {
		return (
			<Box>
				<CategoryContent
					subCategories={pageCategory.subCategories}
					categoryName={pageCategory.displayName}
					categoryDescription={pageCategory.description}
				/>
				<CategoryContent subCategories={[assistanceSubCategory]} />
			</Box>
		);
	}

	return <NoCategoryZeroState />;
};
