/**
 * Live Israeli Ministry of Justice (Registrar of Associations / data.gov.il) verifier.
 *
 * Queries the official CKAN Action API (`moj-amutot`) for every initiative that has a
 * registrationNumber (or GuideStar Israel registry URL) and verifies:
 *  - Registered Amutot (ע״ר): resource_id = be5b7935-3922-45d4-9638-08871b17ec95
 *  - Proper Management Certificate (ניהול תקין): resource_id = cb12ac14-7429-4268-bc03-460f48157858
 *  - Registered Public Benefit Companies (חל״צ): resource_id = 85e40960-5426-4f4c-874f-2d1ec1b94609
 *
 * Usage:
 *   node scripts/verifyGovRegistry.mjs            # verify & report (read-only)
 *   node scripts/verifyGovRegistry.mjs --write    # write registrationNumber, properManagement, registryCheckedAt into _data/links
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const REPO_ROOT = process.cwd();
const WRITE_MODE = process.argv.includes("--write");

const CKAN_BASE = "https://data.gov.il/api/3/action/datastore_search";
const RESOURCES = {
	amutot: "be5b7935-3922-45d4-9638-08871b17ec95",
	nihul: "cb12ac14-7429-4268-bc03-460f48157858",
	halatz: "85e40960-5426-4f4c-874f-2d1ec1b94609",
};

async function ckanLookup(resourceId, filterField, value) {
	const filters = JSON.stringify({ [filterField]: value });
	const url = `${CKAN_BASE}?resource_id=${resourceId}&filters=${encodeURIComponent(
		filters,
	)}&limit=50`;
	const res = await fetch(url, {
		headers: { Accept: "application/json" },
		signal: AbortSignal.timeout(12000),
	});
	if (!res.ok) {
		throw new Error(`HTTP ${res.status} from data.gov.il`);
	}
	const data = await res.json();
	if (!data.success) {
		throw new Error("data.gov.il returned success=false");
	}
	return data.result?.records || [];
}

function extractRegistrationNumber(link) {
	if (link.registrationNumber) return String(link.registrationNumber).trim();
	const gsRef = (link.references || []).find(
		(r) => r.url && r.url.includes("guidestar.org.il/organization/"),
	);
	if (gsRef) {
		const m = gsRef.url.match(/organization\/(\d{8,9})/);
		if (m) return m[1];
	}
	const textMatch = (link.initiativeValidationDetails || "").match(
		/\b(580\d{6}|51\d{7})\b/,
	);
	return textMatch ? textMatch[1] : null;
}

async function verifyRegistration(regNum) {
	const isHalatz = regNum.startsWith("51");
	const [entityRecords, nihulRecords] = await Promise.all([
		ckanLookup(
			isHalatz ? RESOURCES.halatz : RESOURCES.amutot,
			isHalatz ? "מספר חלצ" : "מספר עמותה",
			isHalatz ? Number(regNum) : regNum,
		),
		ckanLookup(RESOURCES.nihul, "מספר עמותה", regNum),
	]);

	const entity = entityRecords[0] || null;
	const statusField = isHalatz ? "סטטוס חלצ" : "סטטוס עמותה";
	const nameField = isHalatz ? "שם חלצ בעברית" : "שם עמותה בעברית";
	const status = entity ? String(entity[statusField] || "").trim() : null;
	const officialName = entity ? String(entity[nameField] || "").trim() : null;

	// Pick latest Nihul Takin record by approval year
	const currentYear = new Date().getFullYear();
	let properManagement = false;
	let properManagementYear = null;
	if (nihulRecords.length > 0) {
		const validRecords = nihulRecords
			.filter((rec) => {
				const approved = String(rec["האם יש אישור"] || "").trim();
				return (
					approved.includes("נחתם אישור") ||
					approved === "כן" ||
					approved.toLowerCase() === "yes"
				);
			})
			.sort(
				(a, b) => Number(b["שנת האישור"] || 0) - Number(a["שנת האישור"] || 0),
			);

		if (validRecords.length > 0) {
			const latestYear = Number(validRecords[0]["שנת האישור"] || 0);
			properManagementYear = latestYear || null;
			properManagement = latestYear >= currentYear;
		}
	}

	const foundInRegistry = Boolean(entity || nihulRecords.length > 0);
	const resolvedName =
		officialName ||
		(nihulRecords[0] ? String(nihulRecords[0]["שם עמותה"] || "").trim() : null);

	return {
		found: foundInRegistry,
		entityType: isHalatz ? "חל״צ" : "ע״ר",
		officialName: resolvedName,
		status: status || (properManagement ? "אישור ניהול תקין בתוקף" : null),
		active: status
			? !status.includes("מחוק") && !status.includes("פירוק")
			: properManagement
				? true
				: null,
		properManagement,
		properManagementYear,
	};
}

async function collectLinkFiles(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await collectLinkFiles(full)));
		} else if (entry.name === "links.json") {
			const rel = path.relative(path.join(REPO_ROOT, "_data/links"), full);
			if (rel.includes(path.sep)) {
				files.push(full);
			}
		}
	}
	return files;
}

async function main() {
	const files = await collectLinkFiles(path.join(REPO_ROOT, "_data/links"));
	const today = new Date().toISOString().slice(0, 10);

	// Deduplicate lookups across registration numbers
	const targets = [];
	const regSet = new Set();

	for (const file of files) {
		const data = JSON.parse(await fs.readFile(file, "utf8"));
		for (const link of data.links || []) {
			const reg = extractRegistrationNumber(link);
			if (reg) {
				regSet.add(reg);
				targets.push({ file, name: link.name, displayName: link.displayName, reg });
			}
		}
	}

	const uniqueRegs = [...regSet];
	console.log(
		`Checking ${uniqueRegs.length} unique NGO registration numbers against data.gov.il...`,
	);

	const results = new Map();
	const errors = [];

	for (let i = 0; i < uniqueRegs.length; i += 6) {
		const chunk = uniqueRegs.slice(i, i + 6);
		await Promise.all(
			chunk.map(async (reg) => {
				try {
					results.set(reg, await verifyRegistration(reg));
				} catch (err) {
					errors.push({ reg, error: err.message });
				}
			}),
		);
	}

	let activeCount = 0;
	let nihulCount = 0;
	const flagged = [];

	for (const t of targets) {
		const r = results.get(t.reg);
		if (!r) continue;
		if (r.active) activeCount++;
		if (r.properManagement) nihulCount++;
		if (!r.found || r.active === false) {
			flagged.push({ ...t, ...r });
		}
	}

	console.log(
		`Verified ${targets.length} listings (${activeCount} active in Ministry of Justice registry, ${nihulCount} with valid ניהול תקין, ${errors.length} API errors, ${flagged.length} flagged).`,
	);

	if (flagged.length > 0) {
		console.log("Flagged listings:", JSON.stringify(flagged, null, 2));
	}
	if (errors.length > 0) {
		console.log("API errors:", JSON.stringify(errors, null, 2));
	}

	if (WRITE_MODE) {
		let filesUpdated = 0;
		for (const file of files) {
			const raw = await fs.readFile(file, "utf8");
			const data = JSON.parse(raw);
			let changed = false;

			for (const link of data.links || []) {
				const reg = extractRegistrationNumber(link);
				if (!reg) continue;
				const r = results.get(reg);
				if (!r || !r.found) continue;

				if (link.registrationNumber !== reg) {
					link.registrationNumber = reg;
					changed = true;
				}
				if (r.properManagement && !link.properManagement) {
					link.properManagement = true;
					changed = true;
				} else if (!r.properManagement && link.properManagement) {
					delete link.properManagement;
					changed = true;
				}
				if (link.registryCheckedAt !== today) {
					link.registryCheckedAt = today;
					changed = true;
				}
			}

			if (changed) {
				await fs.writeFile(file, `${JSON.stringify(data, null, "\t")}\n`, "utf8");
				filesUpdated++;
			}
		}
		console.log(`Updated ${filesUpdated} data files with live data.gov.il provenance.`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
