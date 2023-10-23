import Link from "next/link";
import { Category } from "../utils/categories";
import { CategoryContent } from "./CategoryContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

export function CategoriesList({
	categories,
	categoryId,
}: {
	categories: Array<Category>;
	categoryId?: string;
}) {
	return (
		<div className="desktop-category">
			<div dir="rtl">
				{categories.map((category) => {
					return (
						<div
							className={[
								"links-section",
								category.id === categoryId && "desktop-open",
							]
								.filter(Boolean)
								.join(" ")}
							id={category.name}
							key={category.name}
						>
							<Link href={`/${category.id}`} key={category.name} replace>
								<div className="links-section-title">
									{category.image && (
										<img
											src={category.image}
											alt={`${category.displayName} Icon`}
											className="category-icon"
										/>
									)}
									<h2 className="text-2xl">{category.displayName}</h2>
									<div className="open-caret">
										<FontAwesomeIcon icon={faAngleDown} />
									</div>
								</div>
							</Link>
							{category.id === categoryId && (
								<div className="links-section-content sm:hidden">
									<CategoryContent
										subCategories={category.subCategories}
										categoryName={category.displayName}
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
