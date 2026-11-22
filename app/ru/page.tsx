import type { Metadata } from "next";

import { IntlPortal } from "@/app/components/IntlPortal/IntlPortal";
import {
	getEnrichedIntlInitiatives,
	PORTAL_CONFIGS,
} from "@/app/components/IntlPortal/intlCatalog";
import { buildIntlPortalJsonLd, safeJsonLd, SITE_URL } from "@/app/utils/seo";

const RU_TITLE =
	"Links For Israel — Горячие линии 24/7, психологическая помощь и проверенные НКО в Израиле";
const RU_DESCRIPTION =
	"Открытый справочник круглосуточных экстренных линий (ЭРАН 1201 на русском), защиты прав работников, волонтёрства и проверенных благотворительных организаций Израиля.";

export const metadata: Metadata = {
	title: { absolute: RU_TITLE },
	description: RU_DESCRIPTION,
	alternates: {
		canonical: "/ru",
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
		locale: "ru_RU",
		url: `${SITE_URL}/ru`,
		siteName: "Links For Israel",
		title: RU_TITLE,
		description: RU_DESCRIPTION,
		images: [
			{ url: `${SITE_URL}/og/ru.png`, width: 1200, height: 630, alt: RU_TITLE },
		],
	},
};

export default async function RussianPage() {
	const enriched = await getEnrichedIntlInitiatives("ru");

	const jsonLd = buildIntlPortalJsonLd({
		path: "/ru",
		title: RU_TITLE,
		description: RU_DESCRIPTION,
		inLanguage: "ru-RU",
		items: enriched,
	});

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
			/>
			<IntlPortal config={PORTAL_CONFIGS.ru} items={enriched} />
		</>
	);
}
