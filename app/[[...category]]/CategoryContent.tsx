import React, { Fragment, useState } from "react";

import { withScroll } from "@/app/components/withScroll/withScroll";
import { VStack, Heading, Divider } from "@chakra-ui/react";

import { DialogModal } from "../components/DialogModal/DialogModal";
import { ShareSection } from "../components/Share/ShareSection";
import { Link, SubCategoryData } from "../utils/categories";
import { LinksList } from "./LinksList";

interface CategoryContentProps {
	categoryName?: string;
	subCategories: SubCategoryData[];
	categoryDescription?: string;
}

const containsHebrewLetters = (str: string): boolean =>
	/[\u0590-\u05EA]/.test(str);

export const CategoryContent = ({
	categoryName,
	subCategories,
	categoryDescription,
}: CategoryContentProps) => {
	const [openDialog, setOpenDialog] = useState(false);
	const [description, setDescription] = useState<{
		body: React.ReactNode;
		link: Link;
	} | null>(null);

	return (
		<VStack spacing={5} align="stretch">
			{openDialog && description && (
				<DialogModal
					title={description.link.displayName || ""}
					body={description.body}
					open={openDialog}
					toggleModal={setOpenDialog}
					isRtl={containsHebrewLetters(description.link.displayName)}
				/>
			)}

			{categoryName && categoryDescription && (
				<ShareSection
					categoryName={categoryName}
					categoryDescription={categoryDescription}
				/>
			)}

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
