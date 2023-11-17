import { Rubik } from "next/font/google";

import { RootApp } from "@/app/components/RootApp";
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { Footer } from "./components/Footer";
import { GTag } from "./components/Gtag";
import MetaDataComponent from "./components/MetadataComponent";
import "./mixpanel";
import "./styles/globals.css";
import "./styles/main.scss";
import { getCategories } from "./utils/categories";

fontAwesomeConfig.autoAddCss = false;

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
				<RootApp categories={categories}>{children}</RootApp>
			</body>
			<Footer />
		</html>
	);
}
