import type { Metadata } from "next";

import { IntlPortal } from "@/app/components/IntlPortal/IntlPortal";
import {
	getEnrichedIntlInitiatives,
	PORTAL_CONFIGS,
} from "@/app/components/IntlPortal/intlCatalog";
import { buildIntlPortalJsonLd, safeJsonLd, SITE_URL } from "@/app/utils/seo";

const AR_TITLE =
	"لينك لإسرائيل — بوابة الطوارئ والدعم النفسي والجمعيات المعتمدة";
const AR_DESCRIPTION =
	"دليل مفتوح المصدر لخطوط الطوارئ 24/7، الدعم النفسي بالعربية (1201)، حقوق العمال، والتطوع والجمعيات المعتمدة في إسرائيل.";

export const metadata: Metadata = {
	title: { absolute: AR_TITLE },
	description: AR_DESCRIPTION,
	alternates: {
		canonical: "/ar",
		languages: {
			"he-IL": "/",
			"en-US": "/en",
			"ar-IL": "/ar",
			"ru-RU": "/ru",
			"x-default": "/",
		},
	},
	openGraph: {
		type: "website",
		locale: "ar_IL",
		url: `${SITE_URL}/ar`,
		siteName: "Links For Israel",
		title: AR_TITLE,
		description: AR_DESCRIPTION,
		images: [
			{ url: `${SITE_URL}/og/ar.png`, width: 1200, height: 630, alt: AR_TITLE },
		],
	},
};

export default async function ArabicPage() {
	const enriched = await getEnrichedIntlInitiatives("ar");

	const jsonLd = buildIntlPortalJsonLd({
		path: "/ar",
		title: AR_TITLE,
		description: AR_DESCRIPTION,
		inLanguage: "ar-IL",
		items: enriched,
	});

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
			/>
			<IntlPortal config={PORTAL_CONFIGS.ar} items={enriched} />
		</>
	);
}
