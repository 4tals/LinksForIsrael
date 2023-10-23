import { getAllDocs, getDocById } from "@/app/utils/docs";

import styles from "./docs.module.scss";

export async function generateMetadata({
	params: { slug },
}: {
	params: { slug: string };
}) {
	const { title } = await getDocById(slug);
	return {
		title,
	};
}

export default async function Doc({
	params: { slug },
}: {
	params: { slug: string };
}) {
	const { html, title, date } = await getDocById(slug);
	return (
		<div className="desktop-grid">
			<div
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
