"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { Category } from "../utils/categories";
import { CategoryContent } from "./CategoryContent";

let init = false;

export function CategoriesList({
	categories,
	categoryId,
}: {
	categories: Array<Category>;
	categoryId?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (
				categories.find((category) => category.id === categoryId) &&
				ref.current &&
				!init
			) {
				// check if media query matches
				const mq = window.matchMedia("(max-width: 640px)");
				if (mq.matches) {
					// add scroll margin to the top of the element
					// ref.current.attributeStyleMap.set("scroll-margin-top", CSS.px(40));

					ref.current.scrollIntoView({
						behavior: "smooth",
					});
					// use scollto
					// const parent = ref.current?.closest(".desktop-category");
					// if (parent) {
					// 	parent.scrollTo({
					// 		top: ref.current.offsetTop - 40,
					// 		behavior: "smooth",
					// 	});
					// }

					// move element down with the margin of the nav
				}
				init = true;
			}
		}, 0);
		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="desktop-category">
			<div dir="rtl">
				{categories.map((category) => {
					return (
						<div
							ref={ref}
							className={[
								"links-section",
								category.id === categoryId && "desktop-open",
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
							>
								<div className="links-section-title">
									{category.image && (
										<img
											src={category.image}
											alt={`${category.displayName} Icon`}
											className="category-icon"
										/>
									)}
									<h2 className="text-xl">{category.displayName}</h2>
									{/* <div className="open-caret">
										<FontAwesomeIcon icon={faAngleDown} />
									</div> */}
								</div>
							</Link>
							{category.id === categoryId && (
								<div className="links-section-content sm:hidden">
									<CategoryContent
										subCategories={category.subCategories}
										categoryName={category.displayName}
										categoryDescription={category.description}
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
