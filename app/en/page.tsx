import type { Metadata } from "next";

import { EnglishPortal } from "@/app/components/EnglishPortal/EnglishPortal";
import { ENGLISH_INITIATIVES } from "@/app/components/EnglishPortal/englishInitiatives";
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

export default function EnglishPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: EN_TITLE,
		description: EN_DESCRIPTION,
		url: `${SITE_URL}/en`,
		inLanguage: "en-US",
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: ENGLISH_INITIATIVES.length,
			itemListElement: ENGLISH_INITIATIVES.map((item, idx) => ({
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
			<EnglishPortal />
		</>
	);
}
