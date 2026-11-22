/**
 * Submits all URLs from sitemap.xml to the IndexNow API (Bing / ChatGPT Search, Yandex, Seznam, Naver).
 *
 * Usage:
 *   node scripts/submitIndexNow.mjs
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const SITE_HOST = "www.linksforisrael.com";
const SITE_URL = `https://${SITE_HOST}`;
const INDEXNOW_KEY = "7b4e9c2a1f8d63e0b5a49c7e2d1f8a36";
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

function extractUrlsFromSitemap(xml) {
	const urls = [];
	const regex = /<loc>([^<]+)<\/loc>/g;
	let match;
	while ((match = regex.exec(xml)) !== null) {
		const url = match[1].trim();
		if (url.startsWith(SITE_URL)) {
			urls.push(url);
		}
	}
	return Array.from(new Set(urls));
}

async function waitForKeyFile(maxAttempts = 6) {
	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			const res = await fetch(KEY_LOCATION, {
				signal: AbortSignal.timeout(10000),
			});
			const body = (await res.text()).trim();
			if (res.ok && body === INDEXNOW_KEY) {
				return true;
			}
			console.log(
				`Attempt ${attempt}/${maxAttempts}: key file returned HTTP ${res.status}`,
			);
		} catch (err) {
			console.log(
				`Attempt ${attempt}/${maxAttempts}: key check failed (${err.message})`,
			);
		}
		if (attempt < maxAttempts) {
			await new Promise((r) => setTimeout(r, 15000));
		}
	}
	return false;
}

async function getSitemapUrls() {
	try {
		const res = await fetch(SITEMAP_URL, {
			signal: AbortSignal.timeout(12000),
		});
		if (res.ok) {
			const xml = await res.text();
			const urls = extractUrlsFromSitemap(xml);
			if (urls.length > 0) return urls;
		}
	} catch {
		// Fall back to local build sitemap if available
	}

	const localSitemap = path.join(process.cwd(), "out/sitemap.xml");
	const xml = await fs.readFile(localSitemap, "utf8");
	return extractUrlsFromSitemap(xml);
}

async function main() {
	const keyReady = await waitForKeyFile();
	if (!keyReady) {
		console.error(
			`IndexNow key file is not yet live at ${KEY_LOCATION}. Wait for deploy to finish and retry.`,
		);
		process.exit(1);
	}

	const urlList = await getSitemapUrls();
	if (urlList.length === 0) {
		console.error("No URLs found in sitemap.xml.");
		process.exit(1);
	}

	console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

	const res = await fetch("https://api.indexnow.org/indexnow", {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
		body: JSON.stringify({
			host: SITE_HOST,
			key: INDEXNOW_KEY,
			keyLocation: KEY_LOCATION,
			urlList,
		}),
		signal: AbortSignal.timeout(15000),
	});

	const text = await res.text();
	console.log(`IndexNow response: HTTP ${res.status} ${res.statusText}`);
	if (text) console.log(text);

	if (res.status !== 200 && res.status !== 202) {
		process.exit(1);
	}

	console.log(`Successfully submitted ${urlList.length} URLs to IndexNow.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
