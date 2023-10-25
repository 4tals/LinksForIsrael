import categories from "@/_data/categories.json";

export interface CategoryData {
	name: string;
	displayName: string;
	description: string;
	image: string;
	subCategories: string[];
}

export interface SubCategoryData {
	name: string;
	displayName: string;
	links: Array<Link>;
}

export interface Link {
	name: string;
	displayName: string;
	shortDescription: string;
	description: string;
	url: string;
	initiativeImage: string;
	whatsapp: string;
	telegram: string;
	drive: string;
	forms: string;
	docs: string;
	website: string;
	facebook: string;
	discord: string;
	instagram: string;
	tiktok: string;
	twitter: string;
	portal: string;
	tags?: string[];
}

export async function getCategories() {
	return await Promise.all(categories.map(getCategory));
}

export type Category = Awaited<ReturnType<typeof getCategory>>;

export async function getCategory(category: string) {
	const categoryData = (await import(`@/_data/links/${category}/links.json`))
		.default as CategoryData;

	const subCategories = await Promise.all(
		categoryData.subCategories.map(async (subCategory) => {
			return (
				await import(`@/_data/links/${category}/${subCategory}/links.json`)
			).default as SubCategoryData;
		}),
	);

	return {
		...categoryData,
		id: category,
		subCategories,
	};
}
