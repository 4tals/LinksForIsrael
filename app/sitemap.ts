import { MetadataRoute } from "next";

import { getCategories } from "@/app/utils/categories";
import { getAllDocs } from "@/app/utils/docs-links";
import { SITE_URL } from "@/app/utils/seo";

function parseDate(value?: string): Date {
	if (!value) return new Date();
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [categories, docs] = await Promise.all([getCategories(), getAllDocs()]);
	const now = new Date();

	const routes: MetadataRoute.Sitemap = [
		{
			url: SITE_URL,
			lastModified: now,
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${SITE_URL}/en`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${SITE_URL}/ar`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.85,
		},
		{
			url: `${SITE_URL}/ru`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.85,
		},
		{
			url: `${SITE_URL}/embed/hotlines`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${SITE_URL}/print`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		},
	];

	for (const category of categories) {
		const categoryPath = `${SITE_URL}/${encodeURIComponent(category.id)}`;
		routes.push({
			url: categoryPath,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9,
		});

		for (const subCategory of category.subCategories) {
			const subPath = `${categoryPath}/${encodeURIComponent(subCategory.name)}`;
			routes.push({
				url: subPath,
				lastModified: now,
				changeFrequency: "weekly",
				priority: 0.7,
			});

			for (const link of subCategory.links) {
				routes.push({
					url: `${subPath}/${encodeURIComponent(link.name)}`,
					lastModified: parseDate(link.createdAt),
					changeFrequency: "monthly",
					priority: 0.5,
				});
			}
		}
	}

	for (const doc of docs) {
		routes.push({
			url: `${SITE_URL}/docs/${encodeURIComponent(doc.id)}`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.5,
		});
	}

	return routes;
}
