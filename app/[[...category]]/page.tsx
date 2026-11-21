import type { Metadata } from "next";

import { Body } from "@/app/components/Body/Body";
import {
	buildCategoryJsonLd,
	buildHomeJsonLd,
	DEFAULT_DESCRIPTION,
	DEFAULT_OG_IMAGE,
	DEFAULT_TITLE,
	resolveOgImage,
	safeJsonLd,
	SITE_NAME,
	SITE_URL,
} from "@/app/utils/seo";

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

	return [[] satisfies CategoryParam, ...categoryParams].map((category) => ({
		category,
	}));
}

type CategoryParams = Awaited<
	ReturnType<typeof generateStaticParams>
>[number]["category"];

function decodeParam(value?: string): string | undefined {
	if (!value) return undefined;
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

export async function generateMetadata({
	params,
}: {
	params: { category?: CategoryParams };
}): Promise<Metadata> {
	const [rawCategoryId, rawSubCategoryName, rawLinkName] =
		params.category || [];
	const categoryId = decodeParam(rawCategoryId);
	const subCategoryName = decodeParam(rawSubCategoryName);
	const linkName = decodeParam(rawLinkName);

	if (!categoryId) {
		return {
			title: { absolute: DEFAULT_TITLE },
			description: DEFAULT_DESCRIPTION,
			alternates: { canonical: "/" },
		};
	}

	const categories = await getCategories();
	const category = categories.find((c) => c.id === categoryId);
	if (!category) {
		return {
			title: { absolute: DEFAULT_TITLE },
			description: DEFAULT_DESCRIPTION,
		};
	}

	const subCategory = subCategoryName
		? category.subCategories.find((s) => s.name === subCategoryName)
		: undefined;

	const link =
		subCategory && linkName
			? subCategory.links.find((l) => l.name === linkName)
			: undefined;

	const baseCategoryPath = `/${encodeURIComponent(category.id)}`;

	if (link && subCategory) {
		const canonicalPath = `${baseCategoryPath}/${encodeURIComponent(
			subCategory.name,
		)}/${encodeURIComponent(link.name)}`;
		const title = `${link.displayName} – ${category.displayName}`;
		const description = (
			link.shortDescription ||
			link.description ||
			`${link.displayName} – יוזמה בתחום ${category.displayName} בפורטל ${SITE_NAME}.`
		)
			.replace(/\s+/g, " ")
			.trim()
			.slice(0, 160);
		const ogImage = resolveOgImage(link.initiativeImage);

		return {
			title,
			description,
			...(link.tags && link.tags.length > 0 ? { keywords: link.tags } : {}),
			alternates: { canonical: canonicalPath },
			openGraph: {
				type: "article",
				locale: "he_IL",
				url: `${SITE_URL}${canonicalPath}`,
				siteName: SITE_NAME,
				title: `${title} | ${SITE_NAME}`,
				description,
				images: [{ url: ogImage, alt: link.displayName }],
			},
			twitter: {
				card: "summary_large_image",
				title: `${title} | ${SITE_NAME}`,
				description,
				images: [ogImage],
			},
		};
	}

	if (subCategory) {
		const canonicalPath = `${baseCategoryPath}/${encodeURIComponent(
			subCategory.name,
		)}`;
		const title = `${subCategory.displayName} – ${category.displayName}`;
		const description =
			category.description ||
			`רשימת ${subCategory.links.length} יוזמות בתחום ${subCategory.displayName} (${category.displayName}) בפורטל ${SITE_NAME}.`;

		return {
			title,
			description,
			alternates: { canonical: canonicalPath },
			openGraph: {
				type: "website",
				locale: "he_IL",
				url: `${SITE_URL}${canonicalPath}`,
				siteName: SITE_NAME,
				title: `${title} | ${SITE_NAME}`,
				description,
				images: [{ url: DEFAULT_OG_IMAGE, alt: title }],
			},
			twitter: {
				card: "summary_large_image",
				title: `${title} | ${SITE_NAME}`,
				description,
				images: [DEFAULT_OG_IMAGE],
			},
		};
	}

	const count = category.subCategories.reduce(
		(acc, sub) => acc + sub.links.length,
		0,
	);
	const title = category.displayName;
	const description = category.description
		? `${category.description} (${count} יוזמות ומשאבים בפורטל ${SITE_NAME}).`
		: `רשימת ${count} יוזמות ומשאבים בתחום ${category.displayName} בפורטל ${SITE_NAME}.`;

	return {
		title,
		description,
		alternates: { canonical: baseCategoryPath },
		openGraph: {
			type: "website",
			locale: "he_IL",
			url: `${SITE_URL}${baseCategoryPath}`,
			siteName: SITE_NAME,
			title: `${title} | ${SITE_NAME}`,
			description,
			images: [{ url: DEFAULT_OG_IMAGE, alt: title }],
		},
		twitter: {
			card: "summary_large_image",
			title: `${title} | ${SITE_NAME}`,
			description,
			images: [DEFAULT_OG_IMAGE],
		},
	};
}

export default async function Category({
	params,
}: {
	params: { category?: CategoryParams };
}) {
	const categories = await getCategories();
	const assistanceSubCategory = await getAssistanceSubCategory();
	const [rawCategoryId, rawSubCategoryName, rawLinkName] =
		params.category || [];
	const categoryId = decodeParam(rawCategoryId);
	const subCategoryName = decodeParam(rawSubCategoryName);
	const linkName = decodeParam(rawLinkName);

	const activeCategory = categoryId
		? categories.find((c) => c.id === categoryId)
		: undefined;
	const activeSubCategory =
		activeCategory && subCategoryName
			? activeCategory.subCategories.find((s) => s.name === subCategoryName)
			: undefined;
	const activeLink =
		activeSubCategory && linkName
			? activeSubCategory.links.find((l) => l.name === linkName)
			: undefined;

	const jsonLd = activeCategory
		? buildCategoryJsonLd(activeCategory, activeSubCategory, activeLink)
		: buildHomeJsonLd(categories);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
			/>
			{categoryId && (
				<ScrollableCategoriesList
					categories={categories}
					categoryId={categoryId}
				/>
			)}
			<Body
				categories={categories}
				categoryId={categoryId}
				subCategoryName={subCategoryName}
				linkName={linkName}
				assistanceSubCategory={assistanceSubCategory}
			/>
		</>
	);
}
