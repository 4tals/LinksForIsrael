import { promises as fs } from "fs";
import path from "path";

const REPO_ROOT = process.cwd();
const SITE_URL = "https://www.linksforisrael.com";

function extractNormalizedHost(url) {
	if (!url) return null;
	try {
		return new URL(url).hostname
			.toLowerCase()
			.replace(/^(www|m|he|en|news|nadlan)\./, "");
	} catch {
		return null;
	}
}

function isThirdPartyReference(link, ref) {
	const refHost = extractNormalizedHost(ref.url);
	if (!refHost) return false;
	const ownHosts = new Set(
		[link.url, link.website, link.portal]
			.map((u) => extractNormalizedHost(u))
			.filter(Boolean),
	);
	return !ownHosts.has(refHost);
}

function computeRankScore(link) {
	let score = 0;
	if (link.verified) score += 35;
	if (link.organizationType === "official") score += 15;
	if (link.taxDeductible46) score += 10;

	let officialRegPoints = 0;
	let mediaPoints = 0;
	let communityPoints = 0;
	const distinctThirdPartyDomains = new Set();

	for (const ref of link.references || []) {
		if (!isThirdPartyReference(link, ref)) continue;

		const host = extractNormalizedHost(ref.url);
		if (host) distinctThirdPartyDomains.add(host);

		if (ref.type === "official" || ref.type === "registry")
			officialRegPoints += 14;
		else if (
			ref.type === "article" ||
			ref.type === "video" ||
			ref.type === "podcast"
		)
			mediaPoints += 12;
		else if (
			ref.type === "blog" ||
			ref.type === "endorsement" ||
			ref.type === "x_post" ||
			ref.type === "linkedin" ||
			ref.type === "social"
		)
			communityPoints += 6;
		else communityPoints += 3;
	}

	score += Math.min(24, officialRegPoints);
	score += Math.min(24, mediaPoints);
	score += Math.min(15, communityPoints);

	if (distinctThirdPartyDomains.size > 1) {
		score += Math.min(9, (distinctThirdPartyDomains.size - 1) * 3);
	}

	if (link.website || link.url) score += 2;
	if (link.phone) score += 2;
	if (link.shortDescription && link.description) score += 2;
	return Math.min(100, score);
}

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
					references: link.references || [],
					rankScore: computeRankScore(link),
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
			references: link.references || [],
			rankScore: computeRankScore(link),
			tags: link.tags || [],
			portalUrl: `${SITE_URL}/`,
			createdAt: link.createdAt || null,
		});
	}

	apiInitiatives.sort((a, b) => b.rankScore - a.rankScore);

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

	const verifiedOrgs = apiInitiatives.filter((i) => i.verified);
	const llmsLines = [
		"# Links For Israel (לינק לישראל)",
		"",
		`> Open-source, ad-free civic directory of verified Israeli nonprofits, volunteering networks, mental health helplines, citizen rights resources, and emergency hotlines. Website: ${SITE_URL}`,
		"",
		"## Essential Israeli Hotlines",
		"- ERAN (Emotional First Aid 24/7): 1201 — https://www.eran.org.il/",
		"- NATAL (Trauma & Resiliency Helpline): 1-800-363-363 — https://www.natal.org.il/",
		"- Sexual Assault Crisis Hotline (Women / Men 24/7): 1202 / 1203 — https://1202.org.il/",
		"- United Hatzalah (Volunteer EMS 24/7): 1221 — https://1221.org.il/",
		"- Yedidim (Roadside & Civic Rescue): 1230 — https://yedidim-il.org/",
		"- Home Front Command (Pikud HaOref): 104 — https://www.oref.org.il/",
		"- Magen David Adom (Medical Emergency): 101 — https://www.mdais.org/",
		"- Israel Police: 100",
		"",
		"## Portals & Open Data API",
		`- Hebrew Portal: ${SITE_URL}/`,
		`- English / Diaspora Support Portal: ${SITE_URL}/en`,
		`- Open JSON API (all ${apiInitiatives.length} ranked initiatives + references): ${SITE_URL}/api/v1/initiatives.json`,
		`- Categories JSON API: ${SITE_URL}/api/v1/categories.json`,
		`- Sitemap: ${SITE_URL}/sitemap.xml`,
		`- GitHub Repository (submit initiatives, references, or broken links via Issues): https://github.com/4tals/LinksForIsrael`,
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
		`Generated open civic data: ${apiInitiatives.length} ranked initiatives, ${apiCategories.length} categories, and public/llms.txt`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
