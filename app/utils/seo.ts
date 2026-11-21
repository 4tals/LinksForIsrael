import { Category, InitiativeLink, SubCategoryData } from "./categories";
import { socialLinks } from "./consts";

export const SITE_URL = "https://www.linksforisrael.com";
export const SITE_NAME = "לינק לישראל";
export const DEFAULT_TITLE =
	"לינק לישראל – פורטל יוזמות אזרחיות, סיוע והתנדבות";
export const DEFAULT_DESCRIPTION =
	"מחפשים איך לעזור או צריכים עזרה ומידע? פורטל לינק לישראל מרכז במקום אחד מאות יוזמות אזרחיות, עמותות, סיוע למפונים, תרומות, תמיכה נפשית, התנדבות ומידע חיוני.";
export const DEFAULT_OG_IMAGE =
	"https://res.cloudinary.com/dargbitr2/image/upload/v1697311977/LinksForIsrael/jix5eizmqcegmfra89gs.jpg";

export function safeJsonLd(data: unknown): string {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function resolveOgImage(imageUrl?: string): string {
	if (!imageUrl) return DEFAULT_OG_IMAGE;
	const trimmed = imageUrl.trim();
	if (trimmed.startsWith("https://")) return trimmed;
	if (trimmed.startsWith("/")) return `${SITE_URL}${encodeURI(trimmed)}`;
	return DEFAULT_OG_IMAGE;
}

export function buildHomeJsonLd(categories: Category[]) {
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebSite",
				"@id": `${SITE_URL}/#website`,
				url: SITE_URL,
				name: SITE_NAME,
				alternateName: "Links For Israel",
				description: DEFAULT_DESCRIPTION,
				inLanguage: "he-IL",
			},
			{
				"@type": "Organization",
				"@id": `${SITE_URL}/#organization`,
				name: SITE_NAME,
				alternateName: "Links For Israel",
				url: SITE_URL,
				logo: {
					"@type": "ImageObject",
					url: `${SITE_URL}/favIcon.png`,
				},
				sameAs: socialLinks.map((s) => s.href),
			},
			{
				"@type": "ItemList",
				name: "קטגוריות יוזמות בפורטל לינק לישראל",
				numberOfItems: categories.length,
				itemListElement: categories.map((category, index) => ({
					"@type": "ListItem",
					position: index + 1,
					name: category.displayName,
					description: category.description || category.longDisplayName,
					url: `${SITE_URL}/${encodeURIComponent(category.id)}`,
				})),
			},
		],
	};
}

export function buildCategoryJsonLd(
	category: Category,
	subCategory?: SubCategoryData,
	link?: InitiativeLink,
) {
	const categoryUrl = `${SITE_URL}/${encodeURIComponent(category.id)}`;
	const breadcrumbItems: Array<Record<string, unknown>> = [
		{
			"@type": "ListItem",
			position: 1,
			name: "דף הבית",
			item: SITE_URL,
		},
		{
			"@type": "ListItem",
			position: 2,
			name: category.displayName,
			item: categoryUrl,
		},
	];

	if (subCategory) {
		const subUrl = `${categoryUrl}/${encodeURIComponent(subCategory.name)}`;
		breadcrumbItems.push({
			"@type": "ListItem",
			position: 3,
			name: subCategory.displayName,
			item: subUrl,
		});

		if (link) {
			breadcrumbItems.push({
				"@type": "ListItem",
				position: 4,
				name: link.displayName,
				item: `${subUrl}/${encodeURIComponent(link.name)}`,
			});
		}
	}

	const graph: Array<Record<string, unknown>> = [
		{
			"@type": "BreadcrumbList",
			itemListElement: breadcrumbItems,
		},
	];

	if (link && subCategory) {
		const sameAs = [
			link.website,
			link.facebook,
			link.instagram,
			link.twitter,
			link.linkedin,
			link.youtube,
			link.telegram,
		].filter((u): u is string => Boolean(u && u.trim().startsWith("http")));

		graph.push({
			"@type": "WebPage",
			name: link.displayName,
			description:
				link.shortDescription ||
				link.description?.slice(0, 200) ||
				DEFAULT_DESCRIPTION,
			url: `${categoryUrl}/${encodeURIComponent(
				subCategory.name,
			)}/${encodeURIComponent(link.name)}`,
			inLanguage: "he-IL",
			isPartOf: { "@id": `${SITE_URL}/#website` },
			mainEntity: {
				"@type": "Organization",
				name: link.displayName,
				description: link.shortDescription || link.description,
				url: link.url || link.website,
				...(sameAs.length > 0 ? { sameAs } : {}),
			},
		});
	} else {
		const items = (
			subCategory ? [subCategory] : category.subCategories
		).flatMap((sub) =>
			sub.links.map((item) => ({
				subName: sub.name,
				item,
			})),
		);

		graph.push({
			"@type": "CollectionPage",
			name: subCategory
				? `${subCategory.displayName} – ${category.displayName}`
				: category.displayName,
			description: category.description || DEFAULT_DESCRIPTION,
			url: subCategory
				? `${categoryUrl}/${encodeURIComponent(subCategory.name)}`
				: categoryUrl,
			inLanguage: "he-IL",
			isPartOf: { "@id": `${SITE_URL}/#website` },
			mainEntity: {
				"@type": "ItemList",
				numberOfItems: items.length,
				itemListElement: items.map(({ subName, item }, idx) => ({
					"@type": "ListItem",
					position: idx + 1,
					name: item.displayName,
					description: item.shortDescription,
					url: `${categoryUrl}/${encodeURIComponent(
						subName,
					)}/${encodeURIComponent(item.name)}`,
				})),
			},
		});
	}

	return {
		"@context": "https://schema.org",
		"@graph": graph,
	};
}
