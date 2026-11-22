import type { Metadata } from "next";
import React from "react";

import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/app/utils/seo";

const TITLE = "דף חירום וסיוע להדפסה לממ״ד ולמקרר (24/7)";
const DESCRIPTION =
	"עמוד A4 מסודר וחינמי להדפסה או שמירה כ-PDF של כל מוקדי החירום והסיוע הנפשי בישראל (100, 101, 104, 1201, 1202, 1221, 1230) ב-4 שפות.";

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: "/print" },
	openGraph: {
		type: "website",
		locale: "he_IL",
		url: `${SITE_URL}/print`,
		siteName: SITE_NAME,
		title: `${TITLE} | ${SITE_NAME}`,
		description: DESCRIPTION,
		images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: TITLE }],
	},
};

export default function PrintLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
