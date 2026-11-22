import { Category, InitiativeLink, SubCategoryData } from "./categories";
import { socialLinks } from "./consts";

export const SITE_URL = "https://www.linksforisrael.com";
export const SITE_NAME = "לינק לישראל";
export const DEFAULT_TITLE =
	"לינק לישראל – הפורטל הפתוח להתנדבות, סיוע ויוזמות בישראל";
export const DEFAULT_DESCRIPTION =
	"מחפשים איך לעזור או צריכים סיוע ומידע? פורטל לינק לישראל מרכז במקום אחד עמותות, התנדבות, מוקדי סיוע נפשי, זכויות אזרחים, חקלאות ישראלית ויוזמות קהילתיות — בשגרה ובחירום.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/home.png`;

export function getCategoryOgImage(categoryId?: string): string {
	if (!categoryId) return DEFAULT_OG_IMAGE;
	return `${SITE_URL}/og/${encodeURIComponent(categoryId)}.png`;
}

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

function buildNgoEntity(link: InitiativeLink, portalUrl: string) {
	const registrySameAs = link.registrationNumber
		? `https://www.guidestar.org.il/organization/${link.registrationNumber}`
		: undefined;
	const refUrls = (link.references || [])
		.filter((r) => r.type === "registry" || r.type === "official")
		.map((r) => r.url);

	const sameAs = Array.from(
		new Set(
			[
				link.website,
				registrySameAs,
				...refUrls,
				link.facebook,
				link.instagram,
				link.twitter,
				link.linkedin,
				link.youtube,
				link.telegram,
			].filter((u): u is string => Boolean(u && u.trim().startsWith("http"))),
		),
	);

	const entityType =
		link.organizationType === "ngo"
			? ["NGO", "Organization"]
			: link.organizationType === "official"
				? ["GovernmentOrganization", "Organization"]
				: "Organization";

	return {
		"@type": entityType,
		"@id": `${portalUrl}#organization`,
		name: link.displayName,
		description: link.shortDescription || link.description,
		url: link.url || link.website || portalUrl,
		areaServed: {
			"@type": "Country",
			name: "Israel",
		},
		...(link.registrationNumber ? { taxID: link.registrationNumber } : {}),
		...(link.phone
			? {
					contactPoint: {
						"@type": "ContactPoint",
						telephone: link.phone,
						contactType: "customer support",
						areaServed: "IL",
						availableLanguage: ["Hebrew", "English"],
					},
				}
			: {}),
		...(sameAs.length > 0 ? { sameAs } : {}),
	};
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
				inLanguage: ["he-IL", "en-US", "ar-IL", "ru-RU"],
			},
			{
				"@type": "Organization",
				"@id": `${SITE_URL}/#organization`,
				name: SITE_NAME,
				alternateName: "Links For Israel",
				url: SITE_URL,
				logo: {
					"@type": "ImageObject",
					url: `${SITE_URL}/icon-512.png`,
					width: 512,
					height: 512,
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
		const itemUrl = `${categoryUrl}/${encodeURIComponent(
			subCategory.name,
		)}/${encodeURIComponent(link.name)}`;

		graph.push({
			"@type": "WebPage",
			name: link.displayName,
			description:
				link.shortDescription ||
				link.description?.slice(0, 200) ||
				DEFAULT_DESCRIPTION,
			url: itemUrl,
			inLanguage: "he-IL",
			isPartOf: { "@id": `${SITE_URL}/#website` },
			mainEntity: buildNgoEntity(link, itemUrl),
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
				itemListElement: items.map(({ subName, item }, idx) => {
					const itemUrl = `${categoryUrl}/${encodeURIComponent(
						subName,
					)}/${encodeURIComponent(item.name)}`;
					return {
						"@type": "ListItem",
						position: idx + 1,
						item: buildNgoEntity(item, itemUrl),
					};
				}),
			},
		});
	}

	return {
		"@context": "https://schema.org",
		"@graph": graph,
	};
}

export function buildIntlPortalJsonLd(params: {
	path: string;
	title: string;
	description: string;
	inLanguage: string;
	items: Array<{
		id: string;
		name: string;
		summary: string;
		url: string;
		link: InitiativeLink;
	}>;
	faq?: Array<{ question: string; answer: string }>;
}) {
	const pageUrl = `${SITE_URL}${params.path}`;
	const graph: Array<Record<string, unknown>> = [
		{
			"@type": "CollectionPage",
			name: params.title,
			description: params.description,
			url: pageUrl,
			inLanguage: params.inLanguage,
			isPartOf: { "@id": `${SITE_URL}/#website` },
			mainEntity: {
				"@type": "ItemList",
				numberOfItems: params.items.length,
				itemListElement: params.items.map((item, idx) => ({
					"@type": "ListItem",
					position: idx + 1,
					item: buildNgoEntity(
						{
							...item.link,
							displayName: item.name,
							shortDescription: item.summary,
							url: item.url,
						},
						`${pageUrl}?card=${encodeURIComponent(item.id)}`,
					),
				})),
			},
		},
	];

	if (params.faq && params.faq.length > 0) {
		graph.push({
			"@type": "FAQPage",
			mainEntity: params.faq.map((q) => ({
				"@type": "Question",
				name: q.question,
				acceptedAnswer: {
					"@type": "Answer",
					text: q.answer,
				},
			})),
		});
	}

	return {
		"@context": "https://schema.org",
		"@graph": graph,
	};
}

export function buildMethodologyFaqJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "איך לינק לישראל מאמת עמותות ויוזמות?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "כל עמותה מאומתת נבדקת ישירות מול מאגר רשם העמותות והחל״צ הרשמי במשרד המשפטים (data.gov.il / GuideStar Israel), כולל בדיקת אישור ניהול תקין, אישור סעיף 46 לתרומות ואימות אזכורים עצמאיים בתקשורת.",
				},
			},
			{
				"@type": "Question",
				name: "How can I verify an Israeli charity has Section 46 or US 501(c)(3) tax deductibility?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "On Links For Israel (/en), filter by Tax-Deductible (§46) or US 501(c)(3) to view organizations verified against Israel's Ministry of Justice registry (data.gov.il / GuideStar Israel) with transparent links to official sites and third-party coverage.",
				},
			},
			{
				"@type": "Question",
				name: "האם אפשר להשתמש בנתוני הפורטל ב-API פתוח או להטמיע מוקדי חירום?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "כן. כל הנתונים זמינים בחינם כ-JSON פתוח בכתובות /api/v1/initiatives.json ו-/api/v1/hsds.json (בפורמט Open Referral HSDS), וכן ניתן להטמיע את סרגל מוקדי החירום דרך /embed/hotlines.",
				},
			},
		],
	};
}
