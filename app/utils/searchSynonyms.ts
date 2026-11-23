/**
 * Bilingual Hebrew/English synonym & everyday intent expansion for search & Command Palette.
 * Ensures stressed citizens searching everyday words ("חרדה", "אוכל", "פיטורין", "PTSD")
 * reliably discover the most relevant verified organizations and hotlines.
 */
const SYNONYM_GROUPS: string[][] = [
	[
		"חרדה",
		"לחץ",
		"דיכאון",
		"מצוקה",
		"נפשי",
		"סיוע נפשי",
		"פסיכולוג",
		"טיפול",
		"טראומה",
		"פוסט טראומה",
		"ptsd",
		"trauma",
		"anxiety",
		"mental health",
		"ערן",
		"ער״ן",
		"נטל",
		"נט״ל",
		"סהר",
		"סה״ר",
		"1201",
	],
	[
		"אוכל",
		"מזון",
		"סל מזון",
		"סלי מזון",
		"רעב",
		"ארוחות",
		"עוני",
		"food",
		"meals",
		"לקט",
		"לתת",
		"חסדי נעמי",
		"פתחון לב",
	],
	[
		"מילואים",
		"מילואימניקים",
		"חיילים",
		"לוחמים",
		"פצועים",
		"נכי צהל",
		"נכי צה״ל",
		"veterans",
		"soldiers",
		"idf",
		"שיקום",
	],
	[
		"עבודה",
		"פיטורין",
		"שכר",
		"מעסיק",
		"זכויות",
		"ביטוח לאומי",
		"משפטי",
		"זכויות עובדים",
		"כל זכות",
		"קו לעובד",
		"rights",
		"workers",
	],
	[
		"תרומה",
		"תרומות",
		"לתרום",
		"סעיף 46",
		"donate",
		"charity",
		"501c3",
		"jgive",
	],
	["התנדבות", "להתנדב", "מתנדבים", "volunteer", "רוח טובה", "ידידים"],
	[
		"חיות",
		"בעלי חיים",
		"כלב",
		"כלבים",
		"חתול",
		"חתולים",
		"אימוץ",
		"pets",
		"animals",
	],
	["חקלאות", "חקלאים", "קטיף", "משקים", "תוצרת", "agriculture", "farmers"],
	[
		"סרטן",
		"אונקולוגיה",
		"מחלה",
		"חולים",
		"מח עצם",
		"רפואי",
		"אמבולנס",
		"ציוד רפואי",
		"כיסא גלגלים",
		"cancer",
		"medical",
	],
	[
		"מוגבלות",
		"מוגבלויות",
		"נכים",
		"אוטיזם",
		"עיוורון",
		"שיקום",
		"נגישות",
		"autism",
		"disabilities",
	],
	[
		"כסף",
		"חובות",
		"הלוואה",
		"הלוואות",
		"כלכלי",
		"עסקים",
		"תקציב",
		"פעמונים",
		"עוגן",
		"finance",
		"loans",
	],
	["תקיפה מינית", "אלימות", "הטרדה", "1202", "1203", "נשים"],
	["שורדי שואה", "ניצולי שואה", "קשישים", "גיל שלישי", "holocaust", "elderly"],
	[
		"עולים",
		"עלייה",
		"עולים חדשים",
		"סל קליטה",
		"אולפן",
		"חייל בודד",
		"חיילים בודדים",
		"נפש בנפש",
		"משרד הקליטה",
		"aliyah",
		"olim",
		"immigrants",
		"ulpan",
		"lone soldier",
		"lone soldiers",
		"sal klita",
	],
	[
		"העברת כספים",
		"מט״ח",
		"מטח",
		"המרת מטבע",
		"שוברים",
		"מס רכישה",
		"adesco",
		"wise",
		"isratransfer",
		"covercy",
		"payoneer",
		"money transfer",
		"transfer funds",
		"wire",
		"fx",
		"currency exchange",
		"banking",
	],
	[
		"יהדות",
		"יהודי",
		"מסורתי",
		"מסורתית",
		"קונסרבטיבי",
		"קונסרבטיבית",
		"התנועה המסורתית",
		"בית כנסת",
		"גיור",
		"נישואין",
		"חתונה",
		"שבת",
		"לוח עברי",
		"תנ״ך",
		"תלמוד",
		"ספריא",
		"צהר",
		"עתים",
		"שכטר",
		"judaism",
		"jewish",
		"masorti",
		"conservative",
		"synagogue",
		"sefaria",
		"shabbat",
		"torah",
		"heritage",
	],
	[
		"הנצחה",
		"זיכרון",
		"נופלים",
		"7 באוקטובר",
		"שבעה באוקטובר",
		"memorial",
		"remembrance",
	],
];

const SYNONYM_LOOKUP = new Map<string, string[]>();
for (const group of SYNONYM_GROUPS) {
	for (const term of group) {
		const key = term.toLowerCase();
		const existing = SYNONYM_LOOKUP.get(key) || [];
		for (const peer of group) {
			const p = peer.toLowerCase();
			if (p !== key && !existing.includes(p)) {
				existing.push(p);
			}
		}
		SYNONYM_LOOKUP.set(key, existing);
	}
}

/**
 * Given a normalized query string, returns additional synonym terms that should
 * also match initiatives (capped for fast, precise client-side search).
 */
export function expandSearchSynonyms(rawQuery: string): string[] {
	const cleaned = rawQuery.trim().toLowerCase();
	if (cleaned.length < 2) return [];

	const expanded = new Set<string>();

	const exact = SYNONYM_LOOKUP.get(cleaned);
	if (exact) {
		for (const term of exact.slice(0, 6)) expanded.add(term);
	}

	const words = cleaned.split(/\s+/).filter((w) => w.length >= 2);
	for (const word of words) {
		const peers = SYNONYM_LOOKUP.get(word);
		if (peers) {
			for (const term of peers.slice(0, 4)) expanded.add(term);
		}
	}

	expanded.delete(cleaned);
	return Array.from(expanded);
}
