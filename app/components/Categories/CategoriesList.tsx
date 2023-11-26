"use client";

import Link from "next/link";
import React, { useContext, useEffect } from "react";

import { SearchContext } from "@/app/components/RootApp";
import { withScroll } from "@/app/components/withScroll/withScroll";
import {
	Box,
	Flex,
	Image,
	Text,
	Tooltip,
	useMediaQuery,
} from "@chakra-ui/react";

import { analyticsService } from "../../utils/analytica/analytics";
import { Category as CategoryType } from "../../utils/categories";

interface CategoriesListProps {
	categories: CategoryType[];
	categoryId?: string;
}

const getNumberOfInitiatives = (category: CategoryType) =>
	category.subCategories.reduce(
		(acc: number, subcategory) => acc + subcategory.links.length,
		0,
	);

const CategoriesList: React.FC<CategoriesListProps> = ({
	categories,
	categoryId,
}) => {
	const { search, onSearch } = useContext(SearchContext);
	const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

	useEffect(() => {
		if (!isLargerThan768 && categoryId) {
			const selected = document.getElementById(categoryId);
			if (selected) {
				selected.scrollIntoView({ behavior: "smooth", block: "nearest" });
			}
		}
	}, [categoryId, isLargerThan768]);

	return (
		<Flex
			direction="row"
			wrap="nowrap"
			p={4}
			alignItems="center"
			overflowX="auto" // Enable horizontal scrolling
		>
			{categories.map((category) => (
				<Tooltip
					label={category.displayName}
					placement="top"
					hasArrow
					key={category.name}
				>
					<Box
						id={category.name}
						onClick={() => {
							analyticsService.trackCategoryView(category.id);
							onSearch("");
						}}
						cursor="pointer"
						m={2}
						p={2}
						borderWidth="1px"
						borderRadius="md"
						_hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
						bg={!search && category.id === categoryId ? "blue.200" : "white"}
						transition="all 0.2s ease-in-out"
					>
						<Link href={`/${category.id}`}>
							{category.image && (
								<Image
									src={category.image}
									alt={`${category.displayName} Icon`}
									boxSize="40px"
									objectFit="cover"
									mx="auto"
								/>
							)}
							<Text fontSize="xs" fontWeight="bold" mt={2} textAlign="center">
								{category.displayName}
							</Text>
						</Link>
					</Box>
				</Tooltip>
			))}
		</Flex>
	);
};

const ScrollableCategoriesList = withScroll(CategoriesList);
export { ScrollableCategoriesList };
