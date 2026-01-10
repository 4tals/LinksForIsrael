import { Body } from "@/app/components/Body/Body";

import { ScrollableCategoriesList } from "../components/Categories/CategoriesList";
import { getAssistanceSubCategory, getCategories } from "../utils/categories";

export const dynamicParams = false;

type CategoryParam =
	| []
	| [string]
	| [string, string]
	| [string, string, string];

export async function generateStaticParams(): Promise<
	{ category: CategoryParam }[]
> {
	const categories = await getCategories();

	const categoryParams = categories.flatMap((category) => {
		const base = [category.id] satisfies CategoryParam;

		const subCategories = category.subCategories.flatMap((subCategory) => {
			const subBase = [...base, subCategory.name] satisfies CategoryParam;

			const links = subCategory.links.map(
				(link) => [...subBase, link.name] satisfies CategoryParam,
			);

			return [subBase, ...links];
		});

		return [base, ...subCategories];
	});

	const params = [[] satisfies CategoryParam, ...categoryParams].map(
		(category) => ({
			category,
		}),
	);

	return params;
}

type CategoryParams = Awaited<
	ReturnType<typeof generateStaticParams>
>[number]["category"];

export default async function Category({
	params,
}: {
	params: { category?: CategoryParams };
}) {
	const categories = await getCategories();
	const assistanceSubCategory = await getAssistanceSubCategory();
	const [categoryId] = params.category || [];

	return (
		<>
			<ScrollableCategoriesList
				categories={categories}
				categoryId={categoryId}
			/>
			<Body
				categories={categories}
				categoryId={categoryId}
				assistanceSubCategory={assistanceSubCategory}
			/>
		</>
	);
}
