import React, { Fragment } from "react";

import { LinksList } from "@/app/[[...category]]/LinksList";
import { withScroll } from "@/app/components/withScroll/withScroll";
import { InitiativeLink, SubCategoryData } from "@/app/utils/categories";
import { VStack, Heading, Divider } from "@chakra-ui/react";

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
	return (
		<VStack spacing={5} align="stretch">
			{subCategories.map((subcategory) => (
				<Fragment key={subcategory.name}>
					<Heading as="h3" size="md" my={4}>
						{subcategory.displayName}
					</Heading>
					<Divider />
					<ScrollableLinksList
						links={subcategory.links}
						name={subcategory.name}
						setDescription={setDescription}
						setOpenDialog={setOpenDialog}
					/>
				</Fragment>
			))}
		</VStack>
	);
};

const ScrollableLinksList = withScroll(LinksList);
