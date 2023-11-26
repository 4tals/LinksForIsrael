import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

import { InitiativeList } from "@/app/components/Initiative/InitiativeList";
import { withScroll } from "@/app/components/withScroll/withScroll";
import { InitiativeLink, SubCategoryData } from "@/app/utils/categories";
import {
	VStack,
	Heading,
	Divider,
	Box,
	Icon,
	Collapse,
	useColorModeValue,
} from "@chakra-ui/react";

interface SubCategoriesListProps {
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
	subCategories,
	setDescription,
	setOpenDialog,
}) => {
	const [openSections, setOpenSections] = useState(
		new Set(subCategories.map((sub) => sub.name)),
	);

	const toggleSection = (name: string) => {
		const newOpenSections = new Set(openSections);
		if (newOpenSections.has(name)) {
			newOpenSections.delete(name);
		} else {
			newOpenSections.add(name);
		}
		setOpenSections(newOpenSections);
	};

	const dividerColor = useColorModeValue("blue.300", "blue.500");

	return (
		<VStack spacing={6} align="stretch" mt={5} mx={4}>
			{subCategories.map((subcategory) => (
				<Box
					key={subcategory.name}
					boxShadow="sm"
					rounded="lg"
					p={4}
					bg="white"
					_hover={{ boxShadow: "md" }}
				>
					<Box
						display="flex"
						alignItems="center"
						cursor="pointer"
						onClick={() => toggleSection(subcategory.name)}
					>
						<Icon
							as={MdKeyboardArrowDown}
							color="blue.500"
							w={6}
							h={6}
							transform={
								openSections.has(subcategory.name)
									? "rotate(0deg)"
									: "rotate(90deg)"
							}
							transition="transform 0.2s ease-in-out"
						/>
						<Heading
							as="h3"
							size="md"
							ml={2}
							fontWeight="semibold"
							color="blue.600"
						>
							{subcategory.displayName}
						</Heading>
					</Box>
					<Divider borderColor={dividerColor} borderWidth={1} my={2} />
					<Collapse in={openSections.has(subcategory.name)} animateOpacity>
						<ScrollableLinksList
							links={subcategory.links}
							name={subcategory.name}
							setDescription={setDescription}
							setOpenDialog={setOpenDialog}
						/>
					</Collapse>
				</Box>
			))}
		</VStack>
	);
};

const ScrollableLinksList = withScroll(InitiativeList);
