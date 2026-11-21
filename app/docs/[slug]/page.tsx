import type { Metadata } from "next";

import { getAllDocs, getDocById } from "@/app/utils/docs-links";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/app/utils/seo";

import styles from "./docs.module.scss";

export const dynamicParams = false;

const DOC_TITLES: Record<string, string> = {
	contribute: "איך לתרום לפרויקט",
	"ezra-rishona": "מדריך עזרה ראשונה",
	finance: "מידע וזכויות פיננסיות",
	hasbara: "מדריך הסברה",
	update: "עדכון פרטים בפורטל",
	weapon: "מידע בנושא רישיון נשק",
};

function stripHtml(html: string): string {
	return html
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export async function generateMetadata({
	params: { slug },
}: {
	params: { slug: string };
}): Promise<Metadata> {
	const { title, html } = await getDocById(slug);
	const resolvedTitle = title || DOC_TITLES[slug] || slug;
	const description = stripHtml(html).slice(0, 160);
	const canonicalPath = `/docs/${encodeURIComponent(slug)}`;

	return {
		title: resolvedTitle,
		description,
		alternates: { canonical: canonicalPath },
		openGraph: {
			type: "article",
			locale: "he_IL",
			url: `${SITE_URL}${canonicalPath}`,
			siteName: SITE_NAME,
			title: `${resolvedTitle} | ${SITE_NAME}`,
			description,
			images: [{ url: DEFAULT_OG_IMAGE, alt: resolvedTitle }],
		},
	};
}

export default async function Doc({
	params: { slug },
}: {
	params: { slug: string };
}) {
	const { html } = await getDocById(slug);
	return (
		<div className="desktop-grid">
			<article
				className={`desktop-content ${styles.docs}`}
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}

export async function generateStaticParams() {
	const docs = await getAllDocs();

	return docs.map((doc) => ({
		slug: doc.id,
	}));
}
