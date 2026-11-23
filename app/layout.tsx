import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";

import { RootApp } from "@/app/components/RootApp";
import {
	DEFAULT_DESCRIPTION,
	DEFAULT_OG_IMAGE,
	DEFAULT_TITLE,
	SITE_NAME,
	SITE_URL,
} from "@/app/utils/seo";

import { Providers } from "./providers";
import "./styles/globals.css";
import "./styles/main.scss";
import { GTag } from "./utils/analytica/Gtag";
import { getAssistanceSubCategory, getCategories } from "./utils/categories";

const rubik = Rubik({
	display: "swap",
	subsets: ["latin", "hebrew"],
	weight: ["400", "500", "700"],
	variable: "--font-display",
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#0038b8",
};

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: DEFAULT_TITLE,
		template: `%s | ${SITE_NAME}`,
	},
	description: DEFAULT_DESCRIPTION,
	applicationName: SITE_NAME,
	keywords: [
		"לינק לישראל",
		"Links For Israel",
		"התנדבות בישראל",
		"עמותות בישראל",
		"סיוע נפשי חינם",
		"זכויות אזרחים",
		"עלייה וקליטה",
		"עולים חדשים",
		"יהדות ומורשת",
		"התנועה המסורתית",
		"העברת כספים לישראל",
		"מוקדי חירום",
		"תרומות סעיף 46",
		"מילואים",
	],
	alternates: {
		canonical: "/",
		languages: {
			"he-IL": "/",
			"en-US": "/en",
			"x-default": "/",
		},
		types: {
			"text/markdown": `${SITE_URL}/llms.txt`,
			"application/json": `${SITE_URL}/api/v1/initiatives.json`,
		},
	},
	openGraph: {
		type: "website",
		locale: "he_IL",
		url: SITE_URL,
		siteName: SITE_NAME,
		title: DEFAULT_TITLE,
		description: DEFAULT_DESCRIPTION,
		images: [
			{
				url: DEFAULT_OG_IMAGE,
				width: 1200,
				height: 630,
				alt: SITE_NAME,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@linksforisrael",
		creator: "@PortalIdan",
		title: DEFAULT_TITLE,
		description: DEFAULT_DESCRIPTION,
		images: [DEFAULT_OG_IMAGE],
	},
	icons: {
		icon: [
			{ url: "/favIcon.png", sizes: "48x48", type: "image/png" },
			{ url: "/icon-192.png", sizes: "192x192", type: "image/png" },
		],
		apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
	},
	other: {
		"mobile-web-app-capable": "yes",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const categories = await getCategories();
	const assistanceSubCategory = await getAssistanceSubCategory();

	return (
		<html lang="he" dir="rtl" className={rubik.variable}>
			<body dir="rtl">
				<GTag />
				<Providers>
					<RootApp
						categories={categories}
						generalAssistanceSubCategory={assistanceSubCategory}
					>
						{children}
					</RootApp>
				</Providers>
			</body>
		</html>
	);
}
