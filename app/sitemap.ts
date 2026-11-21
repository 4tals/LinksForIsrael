import { MetadataRoute } from "next";

import { getCategories } from "@/app/utils/categories";
import { getAllDocs } from "@/app/utils/docs-links";

const BASE_URL = "https://www.linksforisrael.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [categories, docs] = await Promise.all([getCategories(), getAllDocs()]);
	const now = new Date();

	const routes: MetadataRoute.Sitemap = [
		{
			url: BASE_URL,
			lastModified: now,
			changeFrequency: "daily",
			priority: 1,
		},
	];

	for (const category of categories) {
		routes.push({
			url: `${BASE_URL}/${encodeURIComponent(category.id)}`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		});

		for (const subCategory of category.subCategories) {
			routes.push({
				url: `${BASE_URL}/${encodeURIComponent(category.id)}/${encodeURIComponent(
					subCategory.name,
				)}`,
				lastModified: now,
				changeFrequency: "weekly",
				priority: 0.6,
			});
		}
	}

	for (const doc of docs) {
		routes.push({
			url: `${BASE_URL}/docs/${encodeURIComponent(doc.id)}`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.5,
		});
	}

	return routes;
}
