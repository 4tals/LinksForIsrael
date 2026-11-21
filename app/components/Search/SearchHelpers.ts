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

// Plain-language Hebrew & English life-event synonyms so users searching natural
// feelings/needs find the right organizations without knowing official titles.
const SYNONYM_GROUPS: string[][] = [
	[
		"חרדה",
		"דיכאון",
		"לחץ",
		"פחד",
		"מצוקה",
		"טראומה",
		"פוסט טראומה",
		"נפשי",
		"סיוע נפשי",
		"טיפול",
		"פסיכולוג",
		"רגשי",
		"אובדנות",
		"ערן",
		"נטל",
		"סהר",
		"anxiety",
		"mental",
		"trauma",
		"ptsd",
		"therapy",
	],
	[
		"אוכל",
		"מזון",
		"רעב",
		"עוני",
		"נזקקים",
		"סל מזון",
		"לתת",
		"לקט",
		"פתחון לב",
		"food",
		"hunger",
	],
	[
		"מילואים",
		"מילואימניק",
		"מילואימניקים",
		"חייל",
		"חיילים",
		"פצוע",
		"פצועים",
		"נכי צהל",
		"צו 8",
		"אחים לחיים",
		"העוגן",
		"veteran",
		"reserve",
		"soldier",
	],
	[
		"התנדבות",
		"להתנדב",
		"מתנדב",
		"מתנדבים",
		"רוח טובה",
		"ידידים",
		"לב אחד",
		"volunteer",
		"volunteering",
	],
	[
		"זכויות",
		"ביטוח לאומי",
		"מענק",
		"מענקים",
		"פיצויים",
		"הטבות",
		"כל זכות",
		"rights",
	],
	[
		"תרומה",
		"תרומות",
		"לתרום",
		"כסף",
		"צדקה",
		"סעיף 46",
		"jgive",
		"donate",
		"charity",
	],
	[
		"כלב",
		"כלבים",
		"חתול",
		"חתולים",
		"חיות",
		"בעלי חיים",
		"אימוץ",
		"צער בעלי חיים",
		"pet",
		"dog",
		"cat",
	],
	[
		"אזעקה",
		"טילים",
		"מקלט",
		"ממד",
		"ממ״ד",
		"מיגון",
		"חירום",
		"פיקוד העורף",
		"shelter",
		"emergency",
	],
	[
		"ילדים",
		"נוער",
		"מתבגרים",
		"משפחה",
		"חינוך",
		"עלם",
		"כנפיים של קרמבו",
		"kids",
		"youth",
		"children",
	],
	[
		"חקלאות",
		"חקלאי",
		"חקלאים",
		"קטיף",
		"תוצרת",
		"השומר החדש",
		"משק",
		"agriculture",
		"farmer",
	],
	[
		"דם",
		"תרומת דם",
		"עזרה ראשונה",
		"רופא",
		"רפואי",
		"מדא",
		"מד״א",
		"blood",
		"medical",
	],
];

export function expandSearchTerms(rawTerm: string): string[] {
	const term = rawTerm.trim().toLowerCase();
	if (!term) return [];

	const expanded = new Set<string>([term]);
	for (const group of SYNONYM_GROUPS) {
		if (
			group.some((kw) => kw === term || (term.length >= 3 && kw.includes(term)))
		) {
			for (const kw of group) {
				expanded.add(kw);
			}
		}
	}
	return Array.from(expanded);
}
