"use client";

import Link from "next/link";
import { useContext, useRef } from "react";
import { analyticsService } from "../analytics";
import { Category } from "../utils/categories";
import { MenuContext, SearchContext } from "@/app/components/RootApp";

export function CategoriesList({
	categories,
	categoryId,
}: {
	categories: Array<Category>;
	categoryId?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const { search, onSearch } = useContext(SearchContext);
	const { isMobile, isMenuOpen, toggleMenu } = useContext(MenuContext);

	return (
		<div className={`desktop-category menu-${isMenuOpen? 'open' : 'close'}`}>
			<div dir="rtl">
				{categories.map((category) => (
					<div 
						ref={ref} 
						className={["links-section", !search && category.id === categoryId && "desktop-open"].filter(Boolean).join(" ")}
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
								isMobile && isMenuOpen && toggleMenu(); 
							}}
						>
							<div className="links-section-title">
								{category.image && (
									<img src={category.image} alt={`${category.displayName} Icon`} className="category-icon" />
								)}
								<h2 className="text-xl">{category.displayName}</h2>
							</div>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
