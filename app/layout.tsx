import { Rubik } from "next/font/google";

import { RootApp } from "@/app/components/RootApp";

import MetaDataComponent from "./components/MetadataComponent";
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

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const categories = await getCategories();
	const assistanceSubCategory = await getAssistanceSubCategory();

	return (
		<html lang="he" dir="rtl" className={rubik.variable}>
			<head>
				<GTag />
				<MetaDataComponent />
			</head>
			<body dir="rtl">
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
