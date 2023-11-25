"use client";

import { Fragment, ReactNode, useState } from "react";

import { withScroll } from "@/app/components/withScroll/withScroll";

import { DialogModal } from "../components/DialogModal/DialogModal";
import { Link, SubCategoryData } from "../utils/categories";
import { LinksList } from "./LinksList";
import { ShareButtons } from "./ShareButtons";

const containsHebrewLetters = (str: string) => {
	// https://jcuenod.github.io/bibletech/2017/08/19/matching-hebrew-unicode-regex/
	return /[\u0590-\u05EA]/.test(str);
};

export function CategoryContent({
	categoryName,
	subCategories,
	categoryDescription,
}: {
	categoryName?: string;
	subCategories: Array<SubCategoryData>;
	categoryDescription?: string;
}) {
	const [openDialog, setOpenDialog] = useState(false);
	const [description, setDescription] = useState<{
		body: ReactNode;
		link: Link;
	} | null>(null);
	return (
		<>
			<DialogModal
				title={description?.link.displayName || ""}
				body={description?.body}
				open={openDialog}
				toggleModal={setOpenDialog}
				isRtl={containsHebrewLetters(
					`${description?.link.displayName}${description?.link?.description}`,
				)}
			/>
			{categoryName && categoryDescription ? (
				<div className="share-container">
					<div className="category-description">{categoryDescription}</div>
					<ShareButtons category={categoryName} />
				</div>
			) : null}
			<div className="links-section-list">
				{subCategories.map((subcategory) => (
					<Fragment key={subcategory.name}>
						<h3 className="links-subcategory-header">
							{subcategory.displayName}
						</h3>
						<ScrollableLinksList
							links={subcategory.links}
							name={subcategory.name}
							setDescription={setDescription}
							setOpenDialog={setOpenDialog}
						/>
					</Fragment>
				))}
			</div>
		</>
	);
}

const ScrollableLinksList = withScroll(LinksList);
