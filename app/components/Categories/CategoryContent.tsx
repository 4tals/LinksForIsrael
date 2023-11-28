import React, { useState } from "react";

import { InitiativeLink, SubCategoryData } from "../../utils/categories";
import { DialogModal } from "../DialogModal/DialogModal";
import { ShareSection } from "../Share/ShareSection";
import { SubCategoriesList } from "./SubCategoriesList";

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
		link: InitiativeLink;
	} | null>(null);

	return (
		<>
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

			<SubCategoriesList
				subCategories={subCategories}
				setDescription={setDescription}
				setOpenDialog={setOpenDialog}
			/>
		</>
	);
};
