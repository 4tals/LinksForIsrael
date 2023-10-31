import type { Metadata } from "next";
import { Rubik } from "next/font/google";

import { config as fontawesomeConfig } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { Footer } from "./components/Footer";
import { GTag } from "./components/Gtag";
import { Header } from "./components/Header";
import "./globals.css";
import "./main.scss";
import "./mixpanel";
import { getCategories } from "./utils/categories";

fontawesomeConfig.autoAddCss = false;

const rubik = Rubik({
	display: "swap",
	subsets: ["latin", "hebrew"],
	weight: ["400", "700"],
	variable: "--font-display",
});

export const metadata: Metadata = {
	title: "לינק לישראל – פורטל יוזמות - חרבות הברזל!",
	description:
		"אם אתם מחפשים איך לעזור או צריכים עזרה או מידע – זה המקום. לינק לישראל מרכז את כל המשאבים האלה במקום אחד, במטרה שכל אחד ואחת יוכלו למצוא או לתת את הסיוע הנכון עבורם - פרויקט קוד פתוח.",
	viewport: "width=device-width, initial-scale=1",
	appleWebApp: {
		statusBarStyle: "black-translucent",
	},
	openGraph: {
		url: "https://www.linksforisrael.com",
		images:
			"https://res.cloudinary.com/dargbitr2/image/upload/v1697311977/LinksForIsrael/jix5eizmqcegmfra89gs.jpg",
		type: "website",
	},
	icons: {
		icon: "https://res.cloudinary.com/dargbitr2/image/upload/v1697228919/LinksForIsrael/r5ysb355egkpyd10jovq.jpg",
	},
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const categories = await getCategories();

	return (
		<html lang="he" className={rubik.variable}>
			<head>
				<GTag />
			</head>
			<body dir="rtl">
				<Header categories={categories} />
				<main id="content" className="main-content" role="main">
					{children}
				</main>
			</body>
			<Footer />
		</html>
	);
}
