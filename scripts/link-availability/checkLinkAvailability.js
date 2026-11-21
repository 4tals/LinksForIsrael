import { resolve, extname } from "path";
import { promises as fs } from "fs";

import pLimit from "p-limit";

import fetchWithRetry from "fetch-retry";
const fetch = fetchWithRetry(global.fetch);

import { Octokit } from "@octokit/rest";
import { createActionAuth } from "@octokit/auth-action";

const isGitHubAction =
	process.env.GITHUB_ACTIONS === "true" &&
	Boolean(process.env.GITHUB_AVAILABILITY_ISSUE_NUMBER);

let octokit = null;
if (isGitHubAction) {
	const auth = createActionAuth();
	const authentication = await auth();
	octokit = new Octokit({
		auth: authentication.token,
	});
}

const unavailableUrls = [];
const expectedHostErrors = {
	"ironpro.zigit.co.il": "UNABLE TO VERIFY THE FIRST CERTIFICATE",
	"files.oaiusercontent.com": "TOO MANY REQUESTS",
	"chat.openai.com": "TOO MANY REQUESTS",
	"govextra.gov.il": "FORBIDDEN",
	"app.oct7.io": "FORBIDDEN",
	"needarim.org.il": "FORBIDDEN",
	"shalhevet.co": "FORBIDDEN",
	"special.now14.co.il": "FORBIDDEN",
	"www.geektime.co.il": "FORBIDDEN",
	"giveisrael.org": "FORBIDDEN",
	"www.payboxapp.com": "FORBIDDEN",
	"www.kolzchut.org.il": "FORBIDDEN",
	"www.nli.org.il": "FORBIDDEN",
	"innovationisrael.org.il": "FORBIDDEN",
	"meshekhai.co.il": "FORBIDDEN",
	"padlet.com": "FORBIDDEN",
	"rebrand.ly": "FORBIDDEN",
	"easy.co.il": "FORBIDDEN",
	"go.easy.co.il": "FORBIDDEN",
	"www.guidestar.org.il": "FORBIDDEN",
	"www.facebook.com": "FORBIDDEN",
	"facebook.com": "FORBIDDEN",
	"www.linkedin.com": "999",
	"twitter.com": "FORBIDDEN",
	"x.com": "FORBIDDEN",
	"www.ami.org.il": "FORBIDDEN",
	"alut.org.il": "FORBIDDEN",
};

const SUSPICIOUS_CONTENT_PATTERNS = [
	{ label: "Domain for sale / parked", regex: /domain\s+(is\s+)?for\s+sale|buy\s+this\s+domain|sedoparking|hugedomains|dan\.com|afternic|parkingcrew|bodis\.com/i },
	{ label: "Wix disconnected domain", regex: /ConnectYourDomain\s+Error|looks\s+like\s+this\s+domain\s+isn.?t\s+connected/i },
	{ label: "Suspended service/account", regex: /Service\s+Suspended|Account\s+Suspended/i },
	{ label: "Hijacked gambling/spam content", regex: /\b(fafa247|sunwin|slot\s+gacor|online\s+casino|poker\s+online)\b/i },
	{ label: "Soft 404 / expired form", regex: /PageNotFound\.aspx|error_page\.htm|no\s+longer\s+accepting\s+responses|כבר\s+לא\s+מקבל\s+תגובות/i },
];

function addUnavailableUrl(file, name, prop, url, errorMessage) {
	console.warn(`${errorMessage} [${url}]`);

	const expectedHostError = expectedHostErrors[url.hostname];
	if (
		expectedHostError &&
		errorMessage.toLocaleUpperCase("en-us").indexOf(expectedHostError) !== -1
	) {
		console.info(
			`Expected error for host: ${url.hostname} [${expectedHostError}]`,
		);
		return;
	}

	unavailableUrls.push({
		file,
		name,
		prop,
		url: url.href,
		err: errorMessage,
	});
}

async function checkUrlAvailabilityAsync(file, name, prop, url) {
	let response;
	try {
		console.debug(`Fetching URL: ${url}`);
		response = await fetch(url, {
			redirect: "follow",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (compatible; LinksForIsraelAvailabilityBot/1.0; +https://www.linksforisrael.com)",
			},
			signal: AbortSignal.timeout(15000),
			retryOn: [400, 429, 500, 502, 503, 504],
			retries: 2,
			retryDelay: function (attempt, error, res) {
				const delayMs = Math.pow(2, attempt) * 1000;
				const errorMessage = error
					? `${error}, ${error.cause}`
					: `${res.status} ${res.statusText}`;
				console.warn(
					`Error fetching URL '${url}' [attempt #${attempt}]: ${errorMessage} ... will retry in ${delayMs}ms`,
				);
				return delayMs;
			},
		});
	} catch (e) {
		addUnavailableUrl(
			file,
			name,
			prop,
			url,
			`Error fetching: ${e}, ${e.cause}`,
		);
		return;
	}

	if (!response.ok) {
		addUnavailableUrl(
			file,
			name,
			prop,
			url,
			`Non-success HTTP status code: ${response.status} ${response.statusText}`,
		);
		return;
	}

	// Inspect HTML body on 200 OK to detect parked, hijacked, or soft-404 pages
	const contentType = response.headers.get("content-type") || "";
	if (contentType.includes("text/html") && prop !== "initiativeImage") {
		try {
			const html = (await response.text()).slice(0, 20000);
			if (html.trim().length < 130 && !html.includes("<meta")) {
				addUnavailableUrl(
					file,
					name,
					prop,
					url,
					`Suspicious blank/stub page (${html.length} bytes)`,
				);
				return;
			}
			const checkTarget = `${response.url} ${html}`;
			for (const { label, regex } of SUSPICIOUS_CONTENT_PATTERNS) {
				if (regex.test(checkTarget)) {
					addUnavailableUrl(
						file,
						name,
						prop,
						url,
						`Suspicious 200 OK content detected: ${label} (final URL: ${response.url})`,
					);
					return;
				}
			}
		} catch {
			// Ignore body read failures after 200 OK
		}
	}

	console.log(
		`URL is available: ${url} (${response.status} ${response.statusText})`,
	);
}

console.log("Checking availability of initiative links");
const processedUrls = new Set();
const fetchPromises = [];
const parsedConcurrency = parseInt(
	process.env.MAX_CONCURRENCY_LEVEL || "50",
	10,
);
const concurrencyLimit = pLimit(
	Number.isFinite(parsedConcurrency) && parsedConcurrency > 0
		? parsedConcurrency
		: 50,
);

const linksFolder = process.env.GITHUB_WORKSPACE
	? resolve(process.env.GITHUB_WORKSPACE, "_data/links")
	: resolve(process.cwd(), "../../_data/links");

const dirents = await fs.readdir(linksFolder, {
	withFileTypes: true,
	recursive: true,
});

let index = 0;
for (const dirent of dirents) {
	const parentDir = dirent.parentPath || dirent.path || linksFolder;
	const absolutePath = resolve(parentDir, dirent.name);
	console.log(`processing file #${++index}/${dirents.length}: ${absolutePath}`);

	if (
		!dirent.isFile() ||
		extname(absolutePath).toLocaleUpperCase("en-us") !== ".JSON"
	) {
		console.debug(`Skipping non-JSON file: ${absolutePath}`);
		continue;
	}

	const linksJsonString = await fs.readFile(absolutePath, "utf8");
	const linksJson = JSON.parse(linksJsonString);

	if (!linksJson.links) {
		console.info(
			"No links property found, skipping JSON (assuming category descriptor)",
		);
		continue;
	}

	for (const link of linksJson.links) {
		console.log(`processing initiative: ${link.name}`);

		for (const prop in link) {
			const val = link[prop];

			if (prop === "references" && Array.isArray(val)) {
				for (let refIdx = 0; refIdx < val.length; refIdx++) {
					const refUrlStr = val[refIdx]?.url;
					if (
						typeof refUrlStr !== "string" ||
						!refUrlStr.toLocaleUpperCase("en-us").startsWith("HTTP")
					) {
						continue;
					}
					let refUrl;
					try {
						refUrl = new URL(refUrlStr.trim());
					} catch {
						continue;
					}
					if (processedUrls.has(refUrl.href)) continue;
					processedUrls.add(refUrl.href);
					fetchPromises.push(
						concurrencyLimit(
							checkUrlAvailabilityAsync,
							absolutePath,
							link.name,
							`references[${refIdx}]`,
							refUrl,
						),
					);
				}
				continue;
			}

			if (typeof val !== "string") continue;
			if (!val.toLocaleUpperCase("en-us").startsWith("HTTP")) continue;

			const trimmedVal = val.trim();
			if (trimmedVal.match(/\s/g)) continue;

			let url;
			try {
				url = new URL(trimmedVal);
			} catch (e) {
				console.debug(
					`Value of property ${prop} could not be parsed as a URL: ${trimmedVal}\n${e}`,
				);
				continue;
			}

			if (processedUrls.has(url.href)) continue;
			processedUrls.add(url.href);

			fetchPromises.push(
				concurrencyLimit(
					checkUrlAvailabilityAsync,
					absolutePath,
					link.name,
					prop,
					url,
				),
			);
		}
	}
}

console.log(`Waiting for ${fetchPromises.length} unique URLs to be fetched...`);
await Promise.all(fetchPromises);

if (unavailableUrls.length > 0) {
	console.warn(`Detected ${unavailableUrls.length} unavailable URL(s)`);

	let count = 1;
	let body = "";
	for (const urlInfo of unavailableUrls) {
		body += `## URL ${count++}
* File: ${urlInfo.file}
* Name: ${urlInfo.name}
* Property: ${urlInfo.prop}
* URL: ${urlInfo.url}
* Error: ${urlInfo.err}
`;
	}

	if (isGitHubAction && octokit) {
		const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
		await octokit.rest.issues.update({
			issue_number: Number(process.env.GITHUB_AVAILABILITY_ISSUE_NUMBER),
			owner,
			repo,
			title: `[AVAILABILITY-MONITOR] ${unavailableUrls.length} Unavailable URL(s) Detected`,
			body,
		});
	} else {
		console.log("\n--- Local Report ---\n" + body);
	}
} else {
	console.log("No unavailable URLs detected");
}

process.exit(0);
