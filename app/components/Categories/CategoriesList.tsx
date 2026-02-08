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

	const isSelected = (category: CategoryType) =>
		!search && category.id === categoryId;

	return (
		<Flex
			direction="row"
			wrap="nowrap"
			py={4}
			px={2}
			alignItems="stretch"
			gap={3}
		>
			{categories.map((category) => (
				<Tooltip
					label={category.displayName}
					placement="top"
					hasArrow
					key={category.name}
					bg="gray.800"
					color="white"
					fontSize="sm"
					px={3}
					py={2}
					borderRadius="lg"
				>
					<Box
						id={category.name}
						onClick={() => {
							analyticsService.trackCategoryView(category.id);
							onSearch("");
						}}
						cursor="pointer"
						p={4}
						borderRadius="xl"
						bg={isSelected(category) ? "blue.50" : "white"}
						boxShadow={
							isSelected(category)
								? "0 4px 20px rgba(66, 153, 225, 0.3)"
								: "0 2px 8px rgba(0, 0, 0, 0.06)"
						}
						border="1px solid"
						borderColor={isSelected(category) ? "blue.200" : "transparent"}
						_hover={{
							boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
							transform: "translateY(-4px)",
							bg: isSelected(category) ? "blue.50" : "gray.50",
						}}
						transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
						minW="100px"
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
					>
						<Link
							href={`/${category.id}`}
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								textDecoration: "none",
							}}
						>
							{category.image && (
								<Box
									p={2}
									borderRadius="full"
									bg={isSelected(category) ? "blue.100" : "gray.50"}
									mb={3}
									transition="all 0.25s ease"
								>
									<Image
										src={category.image}
										alt={`${category.displayName} Icon`}
										boxSize="44px"
										objectFit="contain"
									/>
								</Box>
							)}
							<Text
								fontSize="sm"
								fontWeight={isSelected(category) ? "700" : "600"}
								color={isSelected(category) ? "blue.700" : "gray.700"}
								textAlign="center"
								lineHeight="1.3"
								noOfLines={2}
							>
								{category.displayName}
							</Text>
							<Text
								fontSize="xs"
								color={isSelected(category) ? "blue.500" : "gray.400"}
								mt={1}
								fontWeight="500"
							>
								{getNumberOfInitiatives(category)} יוזמות
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
