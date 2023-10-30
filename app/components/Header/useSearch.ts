import lunr from "lunr";
// @ts-ignore
import withHebrewSupport from "lunr-languages/lunr.he";
// @ts-ignore
import withMulti from "lunr-languages/lunr.multi";
// @ts-ignore
import withStemmerSupport from "lunr-languages/lunr.stemmer.support";
import { useMemo, useState } from "react";

import { analyticsService } from "@/app/analytics";
import { Category, Link } from "@/app/utils/categories";

withStemmerSupport(lunr);
withHebrewSupport(lunr);
withMulti(lunr);

export interface Result extends Link {
	category: string;
	subCategory: string;
}

export function useSearch(categories: Category[]) {
	const [search, setSearch] = useState("");
	const { idx, links } = useMemo(() => {
		const links = Object.fromEntries(
			categories.flatMap((category) => {
				return category.subCategories.flatMap((subCategory) => {
					return subCategory.links.map((link) => {
						return [
							link.name,
							{
								...link,
								category: category.id,
								subCategory: subCategory.name,
							} satisfies Result,
						] as const;
					});
				});
			}),
		);

		const idx = lunr(function () {
			this.use(lunr.multiLanguage("en", "he"));

			this.field("displayName");
			this.field("description");
			this.field("shortDescription");
			this.field("tags");

			Object.values(links).forEach((link) => {
				const linkEntry = {
					id: link.name,
					displayName: link.displayName,
					shortDescription: link.shortDescription,
					description: link.description,
					tags: link.tags?.join(" "),
				};

				this.add(linkEntry);
			});
		});

		return { idx, links };
	}, [categories]);

	const [displaySearchResults, setDisplaySearchResults] = useState<
		lunr.Index.Result[]
	>([]);

	function handleChangeSearch(searchTerm: string) {
		setSearch(searchTerm);
		const results = getResults(searchTerm);
		setDisplaySearchResults(results);

		let usedHebrewMapping = false;
		if (results.length === 0) {
			const mappedSearchTerm = mapStringToHebrew(searchTerm);
			if (mappedSearchTerm) {
				usedHebrewMapping = true;
				setDisplaySearchResults(getResults(mappedSearchTerm));
			}
		}

		analyticsService.trackSearch(searchTerm, results.length, usedHebrewMapping);

		function getResults(searchTerm: string) {
			if (!searchTerm) {
				return [];
			}
			const results = idx.search(`*${searchTerm}*`);
			if (results.length !== 0) {
				return results;
			}

			const mappedSearchTerm = mapStringToHebrew(searchTerm);
			if (!mappedSearchTerm) {
				return [];
			}

			return idx.search(`*${mappedSearchTerm}*`);
		}

		function mapStringToHebrew(s: string) {
			s = s.toLowerCase();
			const chars = s.split("");
			if (chars.every(hasHebrewMapping)) {
				const mapped = chars.map((c) => hebrewMapping[c]).join("");
				return mapped === s ? null : mapped;
			}

			return null;
		}
	}

	return {
		search,
		onSearch: handleChangeSearch,
		results: displaySearchResults.map((res) => links[res.ref]).filter(Boolean),
	} as const;
}

const hebrewMapping = {
	// taken from https://github.com/ai/convert-layout/blob/master/he.json
	q: "/",
	w: "'",
	e: "ק",
	r: "ר",
	t: "א",
	y: "ט",
	u: "ו",
	i: "ן",
	o: "ם",
	p: "פ",
	"[": "]",
	"{": "}",
	"]": "[",
	"}": "{",
	"\\": "\\",
	"|": "|",
	a: "ש",
	s: "ד",
	d: "ג",
	f: "כ",
	g: "ע",
	h: "י",
	j: "ח",
	k: "ל",
	l: "ך",
	";": "ף",
	":": ":",
	"'": ",",
	'"': '"',
	z: "ז",
	x: "ס",
	c: "ב",
	v: "ה",
	b: "נ",
	n: "מ",
	m: "צ",
	",": "ת",
	"<": ">",
	".": "ץ",
	">": "<",
	"/": ".",
	"?": "?",
	" ": " ",
	"-": "-",
	_: "_",
} as const;

function hasHebrewMapping(s: string): s is keyof typeof hebrewMapping {
	return s in hebrewMapping;
}
