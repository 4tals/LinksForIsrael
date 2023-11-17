import { Category } from "@/app/utils/categories";

export interface SearchContextProps {
	search: string;
	results: Category[];
	onSearch: (search: string) => void;
	isMobileSearchOpen: boolean;
	toggleMobileSearch: () => void;
}

export const initialSearchContext: SearchContextProps = {
	search: "",
	results: [],
	onSearch: () => {},
	isMobileSearchOpen: false,
	toggleMobileSearch: () => {},
};

export const hebrewMapping = {
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
