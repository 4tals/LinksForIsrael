import type { Metadata } from "next";
import { Rubik } from "next/font/google";

import { config as fontawesomeConfig } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { AddSite } from "./components/AddSite";
import { Footer } from "./components/Footer";
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
			{/* "{{ page.lang | default: site.lang | default: 'he' }}" */}
			<head></head>
			<body dir="rtl">
				{/* {{ page.direction }} */}
				<Header categories={JSON.parse(JSON.stringify(categories))} />

				<div className="main-subtitle" id="first-subtitle">
					הולכים לאיבוד בין כל היוזמות השונות שהוקמו?
				</div>
				<div className="main-subtitle">כל אתרי הסיוע למלחמה במקום אחד 🇮🇱</div>

				<main id="content" className="main-content" role="main">
					{children}

					<Footer />
				</main>

				<AddSite />
			</body>
		</html>
	);
}
