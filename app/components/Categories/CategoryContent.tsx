"use client";

import React, { useEffect, useState } from "react";

import { InitiativeLink, SubCategoryData } from "../../utils/categories";
import { DialogModal } from "../DialogModal/DialogModal";
import { ShowMoreModal } from "../Initiative/InitiativeShowMoreModal";
import { ShareSection } from "../Share/ShareSection";
import { SubCategoriesList } from "./SubCategoriesList";

interface CategoryContentProps {
	categoryId?: string;
	categoryName?: string;
	subCategories: SubCategoryData[];
	categoryDescription?: string;
	initialSubCategoryName?: string;
	initialLinkName?: string;
}

const containsHebrewLetters = (str: string): boolean =>
	/[\u0590-\u05EA]/.test(str);

export const CategoryContent = ({
	categoryId,
	categoryName,
	subCategories,
	categoryDescription,
	initialSubCategoryName,
	initialLinkName,
}: CategoryContentProps) => {
	const [openDialog, setOpenDialog] = useState(false);
	const [description, setDescription] = useState<{
		body: React.ReactNode;
		link: InitiativeLink;
	} | null>(null);

	// Handle deep links: /[category]/[subCategory] or /[category]/[subCategory]/[linkName]
	useEffect(() => {
		if (!initialSubCategoryName && !initialLinkName) return;

		const decodedSub = initialSubCategoryName
			? decodeURIComponent(initialSubCategoryName)
			: undefined;
		const decodedLink = initialLinkName
			? decodeURIComponent(initialLinkName)
			: undefined;

		if (decodedLink) {
			for (const sub of subCategories) {
				if (decodedSub && sub.name !== decodedSub) continue;
				const matched = sub.links.find((item) => item.name === decodedLink);
				if (matched) {
					const sharePath = categoryId
						? `/${encodeURIComponent(categoryId)}/${encodeURIComponent(
								sub.name,
							)}/${encodeURIComponent(matched.name)}`
						: undefined;
					setDescription({
						link: matched,
						body: (
							<ShowMoreModal
								link={matched}
								setOpenDialog={setOpenDialog}
								sharePath={sharePath}
							/>
						),
					});
					setOpenDialog(true);
					return;
				}
			}
		} else if (decodedSub) {
			const el = document.getElementById(`subcategory-${decodedSub}`);
			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}
	}, [categoryId, initialSubCategoryName, initialLinkName, subCategories]);

	return (
		<>
			{openDialog && description && (
				<DialogModal
					title={description.link.displayName || ""}
					body={description.body}
					open={openDialog}
					toggleModal={setOpenDialog}
					isRtl={containsHebrewLetters(description.link.displayName || "")}
				/>
			)}

			{categoryName && (
				<ShareSection
					categoryName={categoryName}
					categoryDescription={categoryDescription}
				/>
			)}

			<SubCategoriesList
				categoryId={categoryId}
				subCategories={subCategories}
				setDescription={setDescription}
				setOpenDialog={setOpenDialog}
			/>
		</>
	);
};
