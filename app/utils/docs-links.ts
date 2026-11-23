import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// memoize/cache the creation of the markdown parser, this sped up the
// building of the blog from ~60s->~10s
let p: ReturnType<typeof getParserPre> | undefined;

const DocsFolder = "docs";
const EnglishDocsFolder = "docs-en";

async function getParserPre() {
	return (
		unified()
			.use(remarkParse)
			// @ts-ignore
			.use(remarkRehype)
			.use(rehypeStringify)
	);
}

function getParser() {
	if (!p) {
		p = getParserPre().catch((e) => {
			p = undefined;
			throw e;
		});
	}
	return p;
}

export async function getDocById(id: string) {
	const realId = id.replace(/\.md$/, "");
	const fullPath = join(DocsFolder, `${realId}.md`);
	const { data, content } = matter(
		await fs.promises.readFile(fullPath, "utf8"),
	);

	const parser = await getParser();

	const html = await parser.process(content);

	return {
		...data,
		title: data.title,
		id: realId,
		date: `${data.date?.toISOString().slice(0, 10)}`,
		// The host serves lowercase paths only; keep internal links redirect-free.
		html: html.value
			.toString()
			.replace(
				/href="(\/[^"?#]*)/g,
				(_, path: string) => `href="${path.toLowerCase()}`,
			),
	};
}

/** English body of a guide, for the guides that have a translation in docs-en. */
export async function getEnglishDocHtml(
	id: string,
): Promise<string | undefined> {
	const fullPath = join(EnglishDocsFolder, `${id}.md`);
	if (!fs.existsSync(fullPath)) return undefined;
	const parser = await getParser();
	const html = await parser.process(
		await fs.promises.readFile(fullPath, "utf8"),
	);
	return html.value.toString();
}

export async function getAllDocs() {
	const posts = await Promise.all(
		fs.readdirSync(DocsFolder).map((id) => getDocById(id)),
	);

	return posts;
}
