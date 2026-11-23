// Strict JSON schema validator for `_data/categories.json` and `_data/links/.../links.json`.
// Resolves GitHub Issue #293 — runnable in CI and locally (`npm run validate`).
import { promises as fs } from "node:fs";
import path from "node:path";

const REPO_ROOT = process.cwd();
const VALID_INTENTS = new Set(["get-help", "volunteer", "donate"]);
const VALID_ORG_TYPES = new Set(["ngo", "official", "community", "licensed"]);
const VALID_REF_TYPES = new Set([
	"official",
	"registry",
	"article",
	"video",
	"podcast",
	"blog",
	"endorsement",
	"x_post",
	"linkedin",
	"social",
	"other",
]);

function isValidHttpUrl(value) {
	if (typeof value !== "string" || !value.trim()) return false;
	try {
		const u = new URL(value);
		return u.protocol === "https:" || u.protocol === "http:";
	} catch {
		return false;
	}
}

export async function validateDirectoryData(repoRoot = REPO_ROOT) {
	const errors = [];
	const categoriesPath = path.join(repoRoot, "_data/categories.json");
	const categories = JSON.parse(await fs.readFile(categoriesPath, "utf8"));

	if (!Array.isArray(categories) || categories.length === 0) {
		errors.push("_data/categories.json must be a non-empty string array.");
		return { errors, categoriesCount: 0, initiativesCount: 0 };
	}

	const seenCategoryIds = new Set();
	let initiativesCount = 0;

	for (const catId of categories) {
		if (typeof catId !== "string" || !/^[A-Za-z0-9_-]+$/.test(catId)) {
			errors.push(`Invalid category id "${catId}" in _data/categories.json`);
			continue;
		}
		if (seenCategoryIds.has(catId)) {
			errors.push(`Duplicate category id "${catId}" in _data/categories.json`);
		}
		seenCategoryIds.add(catId);

		const catFile = path.join(repoRoot, `_data/links/${catId}/links.json`);
		let catData;
		try {
			catData = JSON.parse(await fs.readFile(catFile, "utf8"));
		} catch (err) {
			errors.push(`Missing or invalid JSON: ${catFile} (${err.message})`);
			continue;
		}

		if (!catData.displayName || typeof catData.displayName !== "string") {
			errors.push(`${catId}/links.json missing non-empty displayName`);
		}
		if (!Array.isArray(catData.subCategories) || catData.subCategories.length === 0) {
			errors.push(`${catId}/links.json must define at least one subCategory`);
			continue;
		}

		for (const subId of catData.subCategories) {
			const subFile = path.join(
				repoRoot,
				`_data/links/${catId}/${subId}/links.json`,
			);
			let subData;
			try {
				subData = JSON.parse(await fs.readFile(subFile, "utf8"));
			} catch (err) {
				errors.push(`Missing or invalid JSON: ${subFile} (${err.message})`);
				continue;
			}

			if (!subData.displayName || typeof subData.displayName !== "string") {
				errors.push(`${catId}/${subId}/links.json missing displayName`);
			}
			if (!Array.isArray(subData.links)) {
				errors.push(`${catId}/${subId}/links.json links must be an array`);
				continue;
			}

			const seenNamesInSub = new Set();
			for (const [idx, link] of subData.links.entries()) {
				const ctx = `${catId}/${subId}[${idx}] (${link?.name || "unnamed"})`;
				initiativesCount++;

				if (!link || typeof link !== "object") {
					errors.push(`${ctx}: entry must be an object`);
					continue;
				}
				if (!link.name || typeof link.name !== "string" || !link.name.trim()) {
					errors.push(`${ctx}: missing non-empty name`);
				} else if (seenNamesInSub.has(link.name.toLowerCase())) {
					errors.push(`${ctx}: duplicate name "${link.name}" in subcategory`);
				} else {
					seenNamesInSub.add(link.name.toLowerCase());
				}

				if (
					!link.displayName ||
					typeof link.displayName !== "string" ||
					!link.displayName.trim()
				) {
					errors.push(`${ctx}: missing non-empty displayName`);
				}

				// Must have at least one actionable contact/URL field
				const actionable = [
					link.url,
					link.website,
					link.portal,
					link.donation,
					link.form,
					link.forms,
					link.whatsapp,
					link.telegram,
					link.facebook,
					link.instagram,
					link.youtube,
					link.twitter,
					link.linkedin,
					link.tiktok,
					link.drive,
					link.doc,
					link.docs,
					link.phone,
					link.email,
					link.contactEmail,
				].some((v) => typeof v === "string" && v.trim().length > 0);
				if (!actionable) {
					errors.push(`${ctx}: must have at least one URL, phone, or email`);
				}

				// Validate primary URL fields if present
				for (const field of ["url", "website", "portal", "donation"]) {
					if (
						link[field] &&
						!isValidHttpUrl(link[field]) &&
						!String(link[field]).startsWith("tel:") &&
						!String(link[field]).startsWith("mailto:")
					) {
						errors.push(`${ctx}: invalid URL in "${field}": ${link[field]}`);
					}
				}

				// Validate local initiativeImage exists if starting with "/"
				if (
					typeof link.initiativeImage === "string" &&
					link.initiativeImage.startsWith("/")
				) {
					const imgPath = path.join(repoRoot, "public", link.initiativeImage);
					try {
						await fs.access(imgPath);
					} catch {
						errors.push(
							`${ctx}: local initiativeImage not found at public${link.initiativeImage}`,
						);
					}
				}

				if (link.intents !== undefined) {
					if (
						!Array.isArray(link.intents) ||
						link.intents.some((i) => !VALID_INTENTS.has(i))
					) {
						errors.push(`${ctx}: invalid intents array`);
					}
				}

				if (
					link.organizationType !== undefined &&
					!VALID_ORG_TYPES.has(link.organizationType)
				) {
					errors.push(
						`${ctx}: invalid organizationType "${link.organizationType}"`,
					);
				}

				if (
					link.registrationNumber !== undefined &&
					!/^\d{8,9}$/.test(String(link.registrationNumber))
				) {
					errors.push(
						`${ctx}: registrationNumber must be 8-9 digits ("${link.registrationNumber}")`,
					);
				}

				if (link.references !== undefined) {
					if (!Array.isArray(link.references)) {
						errors.push(`${ctx}: references must be an array`);
					} else {
						for (const [rIdx, ref] of link.references.entries()) {
							if (!isValidHttpUrl(ref?.url)) {
								errors.push(`${ctx}.references[${rIdx}]: invalid url`);
							}
							if (!VALID_REF_TYPES.has(ref?.type)) {
								errors.push(
									`${ctx}.references[${rIdx}]: invalid type "${ref?.type}"`,
								);
							}
						}
					}
				}
			}
		}
	}

	return {
		errors,
		categoriesCount: categories.length,
		initiativesCount,
	};
}

if (import.meta.url === `file://${process.argv[1]}`) {
	validateDirectoryData()
		.then(({ errors, categoriesCount, initiativesCount }) => {
			if (errors.length > 0) {
				console.error(`Schema validation failed (${errors.length} errors):`);
				for (const e of errors) console.error(`  - ${e}`);
				process.exit(1);
			}
			console.log(
				`Schema validation passed: ${categoriesCount} categories, ${initiativesCount} initiatives.`,
			);
		})
		.catch((err) => {
			console.error(err);
			process.exit(1);
		});
}
