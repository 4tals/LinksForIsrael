"use client";

import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

import { InitiativeList } from "@/app/components/Initiative/InitiativeList";
import { InitiativeLink, SubCategoryData } from "@/app/utils/categories";
import {
	Badge,
	Box,
	Collapse,
	Divider,
	Flex,
	Heading,
	Icon,
	VStack,
} from "@chakra-ui/react";

interface SubCategoriesListProps {
	categoryId?: string;
	subCategories: SubCategoryData[];
	setDescription: React.Dispatch<
		React.SetStateAction<{
			body: React.ReactNode;
			link: InitiativeLink;
		} | null>
	>;
	setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SubCategoriesList: React.FC<SubCategoriesListProps> = ({
	categoryId,
	subCategories,
	setDescription,
	setOpenDialog,
}) => {
	const [openSections, setOpenSections] = useState<Set<string>>(
		() => new Set(subCategories.map((sub) => sub.name)),
	);

	// Keep sections open when navigating categories or updating search results
	useEffect(() => {
		setOpenSections(new Set(subCategories.map((sub) => sub.name)));
	}, [subCategories]);

	const toggleSection = (name: string) => {
		setOpenSections((prev) => {
			const next = new Set(prev);
			if (next.has(name)) {
				next.delete(name);
			} else {
				next.add(name);
			}
			return next;
		});
	};

	return (
		<VStack spacing={5} align="stretch" mt={4}>
			{subCategories.map((subcategory) => {
				const isOpen = openSections.has(subcategory.name);
				return (
					<Box
						key={subcategory.name}
						id={`subcategory-${subcategory.name}`}
						scrollMarginTop="84px"
						bg="white"
						borderWidth="1px"
						borderColor="gray.200"
						boxShadow="xs"
						rounded="xl"
						p={{ base: 4, md: 5 }}
					>
						<Flex
							as="button"
							type="button"
							w="100%"
							align="center"
							justify="space-between"
							cursor="pointer"
							onClick={() => toggleSection(subcategory.name)}
							aria-expanded={isOpen}
							textAlign="right"
						>
							<Flex align="center" gap={2}>
								<Icon
									as={MdKeyboardArrowDown}
									color="brand.600"
									w={6}
									h={6}
									transform={isOpen ? "rotate(0deg)" : "rotate(90deg)"}
									transition="transform 0.2s ease-in-out"
								/>
								<Heading as="h3" size="md" fontWeight="bold" color="gray.800">
									{subcategory.displayName}
								</Heading>
								<Badge
									colorScheme="blue"
									variant="subtle"
									borderRadius="full"
									px={2.5}
									py={0.5}
									fontSize="xs"
								>
									{subcategory.links.length}
								</Badge>
							</Flex>
						</Flex>

						<Collapse in={isOpen} animateOpacity>
							<Divider borderColor="gray.100" my={3} />
							<InitiativeList
								links={subcategory.links}
								name={subcategory.name}
								categoryId={categoryId}
								setDescription={setDescription}
								setOpenDialog={setOpenDialog}
							/>
						</Collapse>
					</Box>
				);
			})}
		</VStack>
	);
};
