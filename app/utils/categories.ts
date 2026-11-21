import categories from "@/_data/categories.json";

export interface CategoryData {
	name: string;
	displayName: string;
	longDisplayName: string;
	description: string;
	image: string;
	subCategories: string[];
}

export interface SubCategoryData {
	name: string;
	displayName: string;
	links: Array<InitiativeLink>;
}

export interface InitiativeLink {
	name: string;
	displayName: string;
	shortDescription?: string;
	initiativeValidationDetails?: string;
	description?: string;
	url?: string;
	initiativeImage?: string;
	whatsapp?: string;
	telegram?: string;
	drive?: string;
	form?: string;
	forms?: string;
	doc?: string;
	docs?: string;
	website?: string;
	facebook?: string;
	discord?: string;
	instagram?: string;
	tiktok?: string;
	twitter?: string;
	portal?: string;
	phone?: string;
	linkedin?: string;
	youtube?: string;
	email?: string;
	contactEmail?: string;
	donation?: string;
	tags?: string[];
	createdAt?: string;
}

export function getPrimaryInitiativeUrl(link: InitiativeLink): string | null {
	const candidates = [
		link.url,
		link.website,
		link.portal,
		link.form,
		link.forms,
		link.whatsapp,
		link.telegram,
		link.facebook,
		link.instagram,
		link.donation,
		link.drive,
		link.docs,
		link.doc,
		link.youtube,
		link.twitter,
		link.linkedin,
		link.tiktok,
		link.discord,
	];

	for (const candidate of candidates) {
		if (typeof candidate === "string" && candidate.trim().length > 0) {
			return candidate.trim();
		}
	}

	return null;
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

export async function getAssistanceSubCategory() {
	return (await import(`@/_data/links/GeneralAssistance/links.json`))
		.default as unknown as SubCategoryData;
}
