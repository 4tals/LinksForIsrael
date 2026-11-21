"use client";

import Link from "next/link";
import React, { useContext, useEffect } from "react";

import { SearchContext } from "@/app/components/RootApp";
import { withScroll } from "@/app/components/withScroll/withScroll";
import { Badge, Box, Flex, Image, Text } from "@chakra-ui/react";

import { analyticsService } from "../../utils/analytica/analytics";
import { Category as CategoryType } from "../../utils/categories";

interface CategoriesListProps {
	categories: CategoryType[];
	categoryId?: string;
}

export const getNumberOfInitiatives = (category: CategoryType) =>
	category.subCategories.reduce(
		(acc: number, subcategory) => acc + subcategory.links.length,
		0,
	);

const CategoriesList: React.FC<CategoriesListProps> = ({
	categories,
	categoryId,
}) => {
	const { search, activeIntent, onSearch, setActiveIntent } =
		useContext(SearchContext);

	useEffect(() => {
		if (categoryId) {
			const selected = document.getElementById(`cat-nav-${categoryId}`);
			if (selected) {
				selected.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
					inline: "center",
				});
			}
		}
	}, [categoryId]);

	return (
		<Flex
			as="nav"
			aria-label="קטגוריות יוזמות"
			direction="row"
			wrap="nowrap"
			py={3}
			px={{ base: 3, md: 6 }}
			gap={2.5}
			alignItems="stretch"
		>
			{categories.map((category) => {
				const isActive = !search && !activeIntent && category.id === categoryId;
				const count = getNumberOfInitiatives(category);

				return (
					<Box
						as={Link}
						key={category.id}
						id={`cat-nav-${category.id}`}
						href={`/${category.id}`}
						onClick={() => {
							analyticsService.trackCategoryView(category.id);
							onSearch("");
							setActiveIntent(null);
						}}
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="space-between"
						minW="104px"
						maxW="120px"
						px={3}
						py={2.5}
						borderWidth="1.5px"
						borderColor={isActive ? "brand.600" : "gray.200"}
						borderRadius="xl"
						bg={isActive ? "brand.50" : "white"}
						boxShadow={isActive ? "sm" : "none"}
						transition="all 0.2s ease"
						_hover={{
							borderColor: "brand.400",
							bg: isActive ? "brand.50" : "gray.50",
							transform: "translateY(-2px)",
							boxShadow: "sm",
						}}
						flexShrink={0}
						position="relative"
					>
						<Badge
							position="absolute"
							top={1.5}
							left={1.5}
							colorScheme={isActive ? "blue" : "gray"}
							variant={isActive ? "solid" : "subtle"}
							fontSize="2xs"
							borderRadius="full"
							px={1.5}
						>
							{count}
						</Badge>

						{category.image && (
							<Image
								src={category.image}
								alt=""
								boxSize="34px"
								objectFit="contain"
								mt={1}
								mb={1.5}
							/>
						)}
						<Text
							fontSize="xs"
							fontWeight={isActive ? "bold" : "semibold"}
							color={isActive ? "brand.700" : "gray.700"}
							textAlign="center"
							lineHeight="1.25"
							noOfLines={2}
						>
							{category.displayName}
						</Text>
					</Box>
				);
			})}
		</Flex>
	);
};

const ScrollableCategoriesList = withScroll(CategoriesList);
export { ScrollableCategoriesList };
