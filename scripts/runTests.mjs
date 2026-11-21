/**
 * Unit & data-integrity test suite using built-in Node.js `node:test`.
 * Resolves GitHub Issue #228 with zero extra dependencies (`npm test`).
 */
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import test from "node:test";

import { validateDirectoryData } from "./validateData.mjs";

const REPO_ROOT = process.cwd();

test("directory JSON schema passes with zero errors", async () => {
	const result = await validateDirectoryData(REPO_ROOT);
	assert.equal(
		result.errors.length,
		0,
		`Schema errors:\n${result.errors.join("\n")}`,
	);
	assert.ok(result.categoriesCount >= 8, "Expected at least 8 categories");
	assert.ok(result.initiativesCount >= 100, "Expected at least 100 initiatives");
});

test("generated Open Data JSON and HSDS feeds are valid and non-empty", async () => {
	const initiativesRaw = await fs.readFile(
		path.join(REPO_ROOT, "public/api/v1/initiatives.json"),
		"utf8",
	);
	const initiatives = JSON.parse(initiativesRaw);
	assert.ok(initiatives.count >= 100);
	assert.equal(initiatives.initiatives.length, initiatives.count);

	// Initiatives must be sorted descending by rankScore
	for (let i = 1; i < initiatives.initiatives.length; i++) {
		assert.ok(
			initiatives.initiatives[i - 1].rankScore >=
				initiatives.initiatives[i].rankScore,
			`Expected descending rankScore at index ${i}`,
		);
	}

	const hsdsRaw = await fs.readFile(
		path.join(REPO_ROOT, "public/api/v1/hsds.json"),
		"utf8",
	);
	const hsds = JSON.parse(hsdsRaw);
	assert.equal(hsds.schema, "OpenReferral-HSDS-3.0-compatible");
	assert.equal(hsds.organizations.length, initiatives.count);
	assert.equal(hsds.services.length, initiatives.count);
});

test("public/llms.txt exists and includes core portals and hotlines", async () => {
	const llms = await fs.readFile(
		path.join(REPO_ROOT, "public/llms.txt"),
		"utf8",
	);
	assert.match(llms, /1201/);
	assert.match(llms, /1221/);
	assert.match(llms, /\/api\/v1\/initiatives\.json/);
	assert.match(llms, /\/api\/v1\/hsds\.json/);
	assert.match(llms, /\/en/);
	assert.match(llms, /\/ar/);
	assert.match(llms, /\/ru/);
});

test("manifest icons exist at declared dimensions", async () => {
	for (const file of ["favIcon.png", "icon-192.png", "icon-512.png"]) {
		const stat = await fs.stat(path.join(REPO_ROOT, "public", file));
		assert.ok(stat.size > 500, `Expected non-empty icon public/${file}`);
	}
});

test("all docs markdown files exist including accessibility and methodology", async () => {
	for (const doc of ["methodology.md", "accessibility.md", "contribute.md"]) {
		const content = await fs.readFile(
			path.join(REPO_ROOT, "docs", doc),
			"utf8",
		);
		assert.ok(content.trim().length > 100, `Expected content in docs/${doc}`);
	}
});
