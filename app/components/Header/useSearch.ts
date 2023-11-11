import { useCallback, useState } from "react";

import { analyticsService } from "@/app/analytics";
import { Category, Link } from "@/app/utils/categories";

export interface LinkResult extends Link {
	category: string;
	subCategory: string;
}

export function useSearch(categories: Category[]) {
	const [search, setSearch] = useState("");
	const [displaySearchResults, setDisplaySearchResults] = useState<Category[]>(
		[],
	);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

	const toggleMobileSearch = useCallback(() => {
		setIsMobileSearchOpen((prevState) => !prevState);
	}, [setIsMobileSearchOpen]);

	function filterCategories(searchTerm: string): Category[] {
		const filteredCategories: Category[] = [];
		categories.forEach((category) => {
			const filteredSubCategories = category.subCategories
				.map((subCategory) => {
					const filteredLinks: Link[] = subCategory.links.filter((link) => {
						return (
							link.name?.includes(searchTerm) ||
							link.displayName?.includes(searchTerm) ||
							link.description?.includes(searchTerm) ||
							link.shortDescription?.includes(searchTerm) ||
							link.tags?.some((tag) => tag.includes(searchTerm))
						);
					});

					return { ...subCategory, links: filteredLinks };
				})
				.filter((subCategory) => subCategory.links.length > 0);

			if (filteredSubCategories.length > 0) {
				filteredCategories.push({
					...category,
					subCategories: filteredSubCategories,
				});
			}
		});

		return filteredCategories;
	}

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
			const results = filterCategories(searchTerm);
			if (results.length !== 0) {
				return results;
			}

			const mappedSearchTerm = mapStringToHebrew(searchTerm);
			if (!mappedSearchTerm) {
				return [];
			}

			return filterCategories(mappedSearchTerm);
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
		results: displaySearchResults,
		isMobileSearchOpen,
		toggleMobileSearch,
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
