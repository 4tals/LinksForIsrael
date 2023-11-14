"use client";

import Link from "next/link";
import { useContext, useEffect, useRef } from "react";

import { MenuContext, SearchContext } from "@/app/components/RootApp";

import { analyticsService } from "../analytics";
import { Category } from "../utils/categories";

const getNumberOfInitiatives = (category: Category) =>
	category.subCategories.reduce(
		(acc, subcategory) => acc + subcategory.links.length,
		0,
	);

export function CategoriesList({
	categories,
	categoryId,
}: {
	categories: Array<Category>;
	categoryId?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const { search, onSearch } = useContext(SearchContext);
	// const { isMobile, isMenuOpen, toggleMenu } = useContext(MenuContext);
	useEffect(() => {
		const selected = document.querySelector(".links-section.desktop-open");
		if (!selected) return;
		selected.scrollIntoView({
			behavior: "auto",
			inline: "center",
		});
	}, []);

	return (
		<div className={`desktop-category`}>
			<div dir="rtl" className="icon-navbar">
				{categories.map((category) => (
					<div
						ref={ref}
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
								// isMobile && isMenuOpen && toggleMenu();
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
								{/* <span>{getNumberOfInitiatives(category)}</span> */}
							</div>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
