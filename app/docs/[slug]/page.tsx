import type { Metadata } from "next";

import { CategoryBreadcrumbs } from "@/app/components/Categories/CategoryBreadcrumbs";
import { MethodologyView } from "@/app/components/Docs/MethodologyView";
import { getCategories } from "@/app/utils/categories";
import { getAllDocs, getDocById } from "@/app/utils/docs-links";
import {
	buildDocArticleJsonLd,
	buildMethodologyFaqJsonLd,
	DEFAULT_OG_IMAGE,
	safeJsonLd,
	SITE_NAME,
	SITE_URL,
} from "@/app/utils/seo";

import styles from "./docs.module.scss";

export const dynamicParams = false;

const DOC_TITLES: Record<string, string> = {
	abroad: "מדריך לישראלים וליהודים בחו״ל — חירום, קמפוס, תרומות ותושבים חוזרים",
	accessibility: "הצהרת נגישות",
	agents: "לסוכני AI, מודלי שפה ו-Open Data API",
	contribute: "איך לתרום לפרויקט",
	"ezra-rishona": "מדריך עזרה ראשונה",
	finance: "מידע וזכויות פיננסיות",
	hasbara: "מדריך הסברה",
	"mental-health": "מוקדי סיוע נפשי חינם 24/7 בישראל — המדריך המלא",
	methodology: "איך אנחנו מאמתים ומדרגים יוזמות",
	olim: "מדריך לעולה החדש — 90 הימים הראשונים בישראל",
	"tax-deductible-donations":
		"מדריך תרומות מוכרות במס (סעיף 46) וניהול תקין בישראל",
	update: "עדכון פרטים בפורטל",
	"volunteering-israel": "איפה ואיך להתנדב בישראל — המדריך המלא",
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
	if (slug === "methodology") {
		const categories = await getCategories();
		const allLinks = categories.flatMap((c) =>
			c.subCategories.flatMap((s) => s.links),
		);
		const verifiedCount = allLinks.filter((l) => l.verified).length;
		const withMentionsCount = allLinks.filter(
			(l) => l.references && l.references.length > 0,
		).length;
		const totalMentions = allLinks.reduce(
			(sum, l) => sum + (l.references?.length || 0),
			0,
		);

		return (
			<>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: safeJsonLd(buildMethodologyFaqJsonLd()),
					}}
				/>
				<MethodologyView
					stats={{
						totalInitiatives: allLinks.length,
						verifiedCount,
						withMentionsCount,
						totalMentions,
						categoriesCount: categories.length,
					}}
				/>
			</>
		);
	}

	const { title, html } = await getDocById(slug);
	const resolvedTitle = title || DOC_TITLES[slug] || slug;
	const description = stripHtml(html).slice(0, 160);
	const articleJsonLd = buildDocArticleJsonLd({
		slug,
		title: resolvedTitle,
		description,
	});

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
			/>
			<div className="desktop-grid">
				<div className="desktop-content" style={{ paddingTop: "16px" }}>
					<CategoryBreadcrumbs
						items={[{ label: "דף הבית", href: "/" }, { label: resolvedTitle }]}
					/>
					<article
						className={styles.docs}
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				</div>
			</div>
		</>
	);
}

export async function generateStaticParams() {
	const docs = await getAllDocs();

	return docs.map((doc) => ({
		slug: doc.id,
	}));
}
