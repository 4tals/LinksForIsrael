import { promises as fs } from "fs";
import path from "path";

const REPO_ROOT = process.cwd();
const SITE_URL = "https://www.linksforisrael.com";

async function main() {
	const categoriesList = JSON.parse(
		await fs.readFile(path.join(REPO_ROOT, "_data/categories.json"), "utf8"),
	);

	const apiCategories = [];
	const apiInitiatives = [];

	for (const catId of categoriesList) {
		const catData = JSON.parse(
			await fs.readFile(
				path.join(REPO_ROOT, `_data/links/${catId}/links.json`),
				"utf8",
			),
		);

		let catCount = 0;
		const subSummaries = [];

		for (const subId of catData.subCategories) {
			const subData = JSON.parse(
				await fs.readFile(
					path.join(REPO_ROOT, `_data/links/${catId}/${subId}/links.json`),
					"utf8",
				),
			);

			catCount += subData.links.length;
			subSummaries.push({
				id: subId,
				displayName: subData.displayName,
				count: subData.links.length,
			});

			for (const link of subData.links) {
				apiInitiatives.push({
					id: `${catId}/${subId}/${link.name}`,
					name: link.name,
					displayName: link.displayName,
					categoryId: catId,
					categoryName: catData.displayName,
					subCategoryId: subId,
					subCategoryName: subData.displayName,
					shortDescription: link.shortDescription || "",
					description: link.description || "",
					url: link.url || link.website || null,
					website: link.website || null,
					phone: link.phone || null,
					email: link.email || link.contactEmail || null,
					intents: link.intents || null,
					verified: Boolean(link.verified),
					taxDeductible46: Boolean(link.taxDeductible46),
					organizationType: link.organizationType || null,
					tags: link.tags || [],
					portalUrl: `${SITE_URL}/${encodeURIComponent(
						catId,
					)}/${encodeURIComponent(subId)}/${encodeURIComponent(link.name)}`,
					createdAt: link.createdAt || null,
				});
			}
		}

		apiCategories.push({
			id: catId,
			displayName: catData.displayName,
			description: catData.description || "",
			count: catCount,
			portalUrl: `${SITE_URL}/${encodeURIComponent(catId)}`,
			subCategories: subSummaries,
		});
	}

	// Include GeneralAssistance
	const gaData = JSON.parse(
		await fs.readFile(
			path.join(REPO_ROOT, "_data/links/GeneralAssistance/links.json"),
			"utf8",
		),
	);
	for (const link of gaData.links) {
		apiInitiatives.push({
			id: `GeneralAssistance/Main/${link.name}`,
			name: link.name,
			displayName: link.displayName,
			categoryId: "GeneralAssistance",
			categoryName: gaData.displayName,
			subCategoryId: "Main",
			subCategoryName: gaData.displayName,
			shortDescription: link.shortDescription || "",
			description: link.description || "",
			url: link.url || link.website || null,
			website: link.website || null,
			phone: link.phone || null,
			email: link.email || link.contactEmail || null,
			intents: link.intents || null,
			verified: Boolean(link.verified),
			taxDeductible46: Boolean(link.taxDeductible46),
			organizationType: link.organizationType || null,
			tags: link.tags || [],
			portalUrl: `${SITE_URL}/`,
			createdAt: link.createdAt || null,
		});
	}

	const generatedAt = new Date().toISOString();
	const apiDir = path.join(REPO_ROOT, "public/api/v1");
	await fs.mkdir(apiDir, { recursive: true });

	await fs.writeFile(
		path.join(apiDir, "initiatives.json"),
		JSON.stringify(
			{
				version: "1.0",
				source: SITE_URL,
				repository: "https://github.com/4tals/LinksForIsrael",
				license: "Open Data / Community Maintained",
				generatedAt,
				count: apiInitiatives.length,
				initiatives: apiInitiatives,
			},
			null,
			2,
		) + "\n",
		"utf8",
	);

	await fs.writeFile(
		path.join(apiDir, "categories.json"),
		JSON.stringify(
			{
				version: "1.0",
				source: SITE_URL,
				generatedAt,
				count: apiCategories.length,
				categories: apiCategories,
			},
			null,
			2,
		) + "\n",
		"utf8",
	);

	// Generate /public/llms.txt for AI assistant discoverability
	const verifiedOrgs = apiInitiatives.filter((i) => i.verified);
	const llmsLines = [
		"# Links For Israel (לינק לישראל)",
		"",
		`> Open-source, ad-free civic directory of verified Israeli nonprofits, volunteering networks, mental health helplines, citizen rights resources, and emergency hotlines. Website: ${SITE_URL}`,
		"",
		"## Essential Israeli Hotlines",
		"- ERAN (Emotional First Aid 24/7): 1201 — https://www.eran.org.il/",
		"- NATAL (Trauma & Resiliency Helpline): 1-800-363-363 — https://www.natal.org.il/",
		"- Yedidim (Roadside & Civic Rescue): 1230 — https://yedidim-il.org/",
		"- Home Front Command (Pikud HaOref): 104 — https://www.oref.org.il/",
		"- Magen David Adom (Medical Emergency): 101 — https://www.mdais.org/",
		"- Israel Police: 100",
		"",
		"## Portals & Open Data API",
		`- Hebrew Portal: ${SITE_URL}/`,
		`- English / Diaspora Support Portal: ${SITE_URL}/en`,
		`- Open JSON API (all ${apiInitiatives.length} initiatives): ${SITE_URL}/api/v1/initiatives.json`,
		`- Categories JSON API: ${SITE_URL}/api/v1/categories.json`,
		`- Sitemap: ${SITE_URL}/sitemap.xml`,
		`- GitHub Repository (submit/report via Issues): https://github.com/4tals/LinksForIsrael`,
		"",
		"## Categories",
		...apiCategories.map(
			(c) => `- [${c.displayName}](${c.portalUrl}): ${c.count} initiatives`,
		),
		"",
		"## Verified Flagship Organizations",
		...verifiedOrgs.map(
			(o) =>
				`- [${o.displayName}](${o.url || o.portalUrl})${
					o.phone ? ` (${o.phone})` : ""
				}: ${o.shortDescription}`,
		),
		"",
	];

	await fs.writeFile(
		path.join(REPO_ROOT, "public/llms.txt"),
		llmsLines.join("\n"),
		"utf8",
	);

	console.log(
		`Generated open civic data: ${apiInitiatives.length} initiatives, ${apiCategories.length} categories, and public/llms.txt`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
