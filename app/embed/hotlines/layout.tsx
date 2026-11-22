import type { Metadata } from "next";
import React from "react";

import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/app/utils/seo";

const TITLE = "הטמעת סרגל מוקדי חירום וסיוע בישראל (ווידג׳ט חינמי)";
const DESCRIPTION =
	"קוד HTML חינמי להטמעת סרגל מוקדי חירום וסיוע נפשי מתעדכן (1201, 104, 1221, 1230) באתרי תוכן, קהילות ועמותות ב-4 שפות.";

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: "/embed/hotlines" },
	openGraph: {
		type: "website",
		locale: "he_IL",
		url: `${SITE_URL}/embed/hotlines`,
		siteName: SITE_NAME,
		title: `${TITLE} | ${SITE_NAME}`,
		description: DESCRIPTION,
		images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: TITLE }],
	},
};

export default function EmbedHotlinesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
