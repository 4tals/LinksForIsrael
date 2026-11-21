import type { Metadata } from "next";

import {
	EnrichedEnglishInitiative,
	EnglishPortal,
} from "@/app/components/EnglishPortal/EnglishPortal";
import { ENGLISH_INITIATIVES } from "@/app/components/EnglishPortal/englishInitiatives";
import {
	computeInitiativeRankScore,
	getCategories,
	InitiativeLink,
} from "@/app/utils/categories";
import { DEFAULT_OG_IMAGE, safeJsonLd, SITE_URL } from "@/app/utils/seo";

const EN_TITLE =
	"Links For Israel — Verified Israeli Charities, Volunteering & Support";
const EN_DESCRIPTION =
	"Open-source directory of verified Israeli nonprofits, humanitarian aid, mental health & veteran rehabilitation centers, volunteering networks, and remembrance archives.";

export const metadata: Metadata = {
	title: { absolute: EN_TITLE },
	description: EN_DESCRIPTION,
	keywords: [
		"Links For Israel",
		"support Israel",
		"verified Israeli charities",
		"donate to Israel",
		"volunteer in Israel",
		"Israeli nonprofits",
		"Brothers For Life",
		"Latet",
		"Leket Israel",
		"NATAL",
		"ERAN",
		"Yad Sarah",
		"Ezer Mizion",
		"United Hatzalah",
	],
	alternates: {
		canonical: "/en",
		languages: {
			"he-IL": "/",
			"en-US": "/en",
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: `${SITE_URL}/en`,
		siteName: "Links For Israel",
		title: EN_TITLE,
		description: EN_DESCRIPTION,
		images: [{ url: DEFAULT_OG_IMAGE, alt: "Links For Israel" }],
	},
	twitter: {
		card: "summary_large_image",
		title: EN_TITLE,
		description: EN_DESCRIPTION,
		images: [DEFAULT_OG_IMAGE],
	},
};

function normalizeHost(url?: string): string | null {
	if (!url) return null;
	try {
		return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
	} catch {
		return null;
	}
}

export default async function EnglishPage() {
	const categories = await getCategories();

	// Build lookup from single-source-of-truth _data/links so /en automatically inherits
	// verified status, Section 46, phone hotlines, references[], and rankScore
	const byName = new Map<string, { link: InitiativeLink; sharePath: string }>();
	const byHost = new Map<string, { link: InitiativeLink; sharePath: string }>();

	for (const cat of categories) {
		for (const sub of cat.subCategories) {
			for (const link of sub.links) {
				const entry = {
					link,
					sharePath: `/${encodeURIComponent(cat.id)}/${encodeURIComponent(
						sub.name,
					)}/${encodeURIComponent(link.name)}`,
				};
				byName.set(link.name.toLowerCase(), entry);
				const host = normalizeHost(link.url || link.website);
				if (host && !byHost.has(host)) {
					byHost.set(host, entry);
				}
			}
		}
	}

	const enriched: EnrichedEnglishInitiative[] = ENGLISH_INITIATIVES.map(
		(item) => {
			const matched =
				byName.get(item.id.toLowerCase()) ||
				byHost.get(normalizeHost(item.url) || "");
			const source = matched?.link;

			const mergedLink: InitiativeLink = {
				...(source || {}),
				name: source?.name || item.id,
				displayName: item.name,
				shortDescription: item.summary,
				description: undefined,
				url: item.url,
				website: item.url,
				tags: item.tags,
			};

			return {
				...item,
				link: mergedLink,
				sharePath: matched?.sharePath,
				rankScore: computeInitiativeRankScore(mergedLink),
			};
		},
	).sort((a, b) => b.rankScore - a.rankScore);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: EN_TITLE,
		description: EN_DESCRIPTION,
		url: `${SITE_URL}/en`,
		inLanguage: "en-US",
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: enriched.length,
			itemListElement: enriched.map((item, idx) => ({
				"@type": "ListItem",
				position: idx + 1,
				name: item.name,
				description: item.summary,
				url: item.url,
			})),
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
			/>
			<EnglishPortal items={enriched} />
		</>
	);
}
