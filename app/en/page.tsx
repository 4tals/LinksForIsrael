import type { Metadata } from "next";

import { IntlPortal } from "@/app/components/IntlPortal/IntlPortal";
import {
	getEnrichedIntlInitiatives,
	PORTAL_CONFIGS,
} from "@/app/components/IntlPortal/intlCatalog";
import { buildIntlPortalJsonLd, safeJsonLd, SITE_URL } from "@/app/utils/seo";

const EN_TITLE =
	"Links For Israel — Verified Israeli Charities, 501(c)(3), Volunteering & Hotlines";
const EN_DESCRIPTION =
	"Open-source directory of verified Israeli nonprofits, 501(c)(3) & Section 46 charities, mental health & veteran rehabilitation centers, volunteering networks, and 24/7 hotlines.";

export const metadata: Metadata = {
	title: { absolute: EN_TITLE },
	description: EN_DESCRIPTION,
	keywords: [
		"Links For Israel",
		"support Israel",
		"verified Israeli charities",
		"501c3 Israeli charities",
		"Section 46 Israel",
		"donate to Israel",
		"volunteer in Israel",
		"Israeli nonprofits",
		"ERAN",
		"NATAL",
		"Yad Sarah",
		"Ezer Mizion",
		"United Hatzalah",
	],
	alternates: {
		canonical: "/en",
		languages: {
			"he-IL": "/",
			"en-US": "/en",
			"ar-IL": "/ar",
			"ru-RU": "/ru",
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: `${SITE_URL}/en`,
		siteName: "Links For Israel",
		title: EN_TITLE,
		description: EN_DESCRIPTION,
		images: [
			{
				url: `${SITE_URL}/og/en.png`,
				width: 1200,
				height: 630,
				alt: "Links For Israel",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: EN_TITLE,
		description: EN_DESCRIPTION,
		images: [`${SITE_URL}/og/en.png`],
	},
};

export default async function EnglishPage() {
	const enriched = await getEnrichedIntlInitiatives("en");

	const jsonLd = buildIntlPortalJsonLd({
		path: "/en",
		title: EN_TITLE,
		description: EN_DESCRIPTION,
		inLanguage: "en-US",
		items: enriched,
		faq: [
			{
				question: "How are Israeli charities verified on Links For Israel?",
				answer:
					"Nonprofits are cross-checked against Israel's official Ministry of Justice Registrar of Associations (data.gov.il / GuideStar Israel) for active status, Good Standing (Nihul Takin), Section 46 status, and independent third-party coverage.",
			},
			{
				question:
					"Can US donors find 501(c)(3) tax-deductible Israeli charities here?",
				answer:
					"Yes. Use the US 501(c)(3) filter pill (or visit /en?us501c3=1) to browse flagship Israeli nonprofits offering US tax-deductible giving pathways.",
			},
		],
	});

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
			/>
			<IntlPortal config={PORTAL_CONFIGS.en} items={enriched} />
		</>
	);
}
