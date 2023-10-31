import { Rubik } from "next/font/google";

import { config as fontawesomeConfig } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { Footer } from "./components/Footer";
import { GTag } from "./components/Gtag";
import { Header } from "./components/Header";
import MetaDataComponent from "./components/MetadataComponent";
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
				<MetaDataComponent />
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
