import type { Metadata } from "next";

import { IntlPortal } from "@/app/components/IntlPortal/IntlPortal";
import { getEnrichedEnglishInitiatives } from "@/app/components/IntlPortal/intlCatalog";
import { buildIntlPortalJsonLd, safeJsonLd, SITE_URL } from "@/app/utils/seo";

const EN_TITLE =
	"Links For Israel — Trusted Guide to Israel, Aliyah, Jewish Life & Charities";
const EN_DESCRIPTION =
	"Every trusted link for Israel and Jewish life — MOJ-verified nonprofits (§46 & 501c3), Aliyah & regulated money transfers for Olim, Masorti/Conservative & pluralistic Jewish heritage, volunteering, and 24/7 hotlines.";

export const metadata: Metadata = {
	title: { absolute: EN_TITLE },
	description: EN_DESCRIPTION,
	keywords: [
		"Links For Israel",
		"support Israel",
		"verified Israeli charities",
		"501c3 Israeli charities",
		"Section 46 Israel",
		"Aliyah resources",
		"New Olim Israel",
		"transfer money to Israel",
		"Masorti Judaism Israel",
		"Conservative Judaism Israel",
		"Jewish heritage resources",
		"Sefaria",
		"Lone Soldiers Israel",
		"volunteer in Israel",
		"Nefesh B'Nefesh",
		"ERAN",
	],
	alternates: {
		canonical: "/en",
		languages: {
			"he-IL": "/",
			"en-US": "/en",
			"x-default": "/",
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
	const enriched = await getEnrichedEnglishInitiatives();

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
			{
				question:
					"Where can new Olim and people making Aliyah find verified absorption, Lone Soldier, and regulated transfer services?",
				answer:
					"Select the Aliyah, Olim & Transfers category (/en?cat=olim) to access the Ministry of Aliyah and Integration (*2994), The Jewish Agency, Nefesh B'Nefesh, Yad L'Olim, Gvahim, Lone Soldier centers, and clearly labeled licensed financial transfer providers (Adesco, IsraTransfer, Wise, Covercy, Payoneer).",
			},
			{
				question:
					"Does Links For Israel cover Conservative / Masorti and global Jewish life resources?",
				answer:
					"Yes. The Judaism & Heritage category (/en?cat=judaism) gathers Masorti Israel, Masorti Olami, USCJ, The Rabbinical Assembly, Schechter Institutes, Fuchsberg Jerusalem Center, Sefaria, ITIM, Tzohar, Chabad, ANU Museum, BINA, Hartman, Pardes, and Hebcal.",
			},
		],
	});

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
			/>
			<IntlPortal items={enriched} />
		</>
	);
}
