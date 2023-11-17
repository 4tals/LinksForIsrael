import { hebrewMapping } from "./SearchConsts";

function hasHebrewMapping(s: string): s is keyof typeof hebrewMapping {
	return s in hebrewMapping;
}

export function mapStringToHebrew(s: string) {
	s = s.toLowerCase();
	const chars = s.split("");
	if (chars.every(hasHebrewMapping)) {
		const mapped = chars.map((c) => hebrewMapping[c]).join("");
		return mapped === s ? null : mapped;
	}

	return null;
}
