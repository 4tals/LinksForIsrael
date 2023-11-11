"use client";

import { useContext } from "react";

import { CategoryContent } from "@/app/[[...category]]/CategoryContent";
import { NoCategoryZeroState } from "@/app/[[...category]]/NoCategoryZeroState/NoCategoryZeroState";
import { SearchContext } from "@/app/components/RootApp";
import { Category, SubCategoryData } from "@/app/utils/categories";

interface Props {
	categories: Array<Category>;
	assistanceSubCategory: SubCategoryData;
	categoryId?: string;
}

export function Body(props: Props) {
	const { categories, categoryId, assistanceSubCategory } = props;
	const { search, results } = useContext(SearchContext);
	const pageCategory = categoryId
		? categories.find((category) => category.id === categoryId)
		: null;
	if (search) {
		return (
			<div className="desktop-content">
				{results.map((category) => (
					<div key={category.id}>
						<p className="search-category-title">{category.displayName}</p>
						<CategoryContent
							subCategories={category.subCategories}
							categoryName={category.displayName}
							categoryDescription={category.description}
						/>
					</div>
				))}
			</div>
		);
	}
	if (pageCategory) {
		return (
			<div className="desktop-content">
				<CategoryContent
					subCategories={pageCategory.subCategories}
					categoryName={pageCategory.displayName}
					categoryDescription={pageCategory.description}
				/>
				<CategoryContent subCategories={[assistanceSubCategory]} />
			</div>
		);
	}
	return <NoCategoryZeroState />;
}
