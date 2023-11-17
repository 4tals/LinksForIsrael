"use client";

import Link from "next/link";
import { useContext, useEffect } from "react";

import { SearchContext } from "@/app/components/RootApp";
import { withScroll } from "@/app/components/withScroll/withScroll";

import { analyticsService } from "../utils/analytics";
import { Category } from "../utils/categories";

const getNumberOfInitiatives = (category: Category) =>
	category.subCategories.reduce(
		(acc, subcategory) => acc + subcategory.links.length,
		0,
	);

const CategoriesList = ({
	categories,
	categoryId,
}: {
	categories: Array<Category>;
	categoryId?: string;
}) => {
	const { search, onSearch } = useContext(SearchContext);
	useEffect(() => {
		const selected = document.querySelector(".links-section.desktop-open");
		if (!selected) return;
		selected.scrollIntoView({
			behavior: "auto",
			inline: "center",
			block: "nearest",
		});
	}, []);

	return (
		<div dir="rtl" className="icon-navbar">
			{categories.map((category) => (
				<div
					className={[
						"links-section",
						!search && category.id === categoryId && "desktop-open",
					]
						.filter(Boolean)
						.join(" ")}
					id={category.name}
					key={category.name}
				>
					<Link
						href={`/${category.id}`}
						key={category.name}
						replace
						className="w-full"
						onClick={() => {
							analyticsService.trackCategoryView(category.id);
							onSearch("");
						}}
					>
						<div className="links-section-title">
							{category.image && (
								<img
									src={category.image}
									alt={`${category.displayName} Icon`}
									className="category-icon"
								/>
							)}
							<span>{category.displayName}</span>
							<span className="numbers">
								{getNumberOfInitiatives(category)}
							</span>
						</div>
					</Link>
				</div>
			))}
		</div>
	);
};

const ScrollableCategoriesList = withScroll(CategoriesList);
export { ScrollableCategoriesList };
