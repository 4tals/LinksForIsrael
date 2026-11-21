export interface EnglishInitiative {
	id: string;
	name: string;
	category: "donate" | "rehab" | "volunteer" | "advocacy";
	categoryLabel: string;
	summary: string;
	url: string;
	tags: string[];
}

export const ENGLISH_INITIATIVES: EnglishInitiative[] = [
	{
		id: "Latet",
		name: "Latet — Israeli Humanitarian Aid",
		category: "donate",
		categoryLabel: "Humanitarian & Donations",
		summary:
			"Israel's largest food rescue and humanitarian aid NGO, supporting families in need, Holocaust survivors, and emergency response nationwide.",
		url: "https://www.latet.org.il/",
		tags: ["humanitarian", "food", "donate", "emergency"],
	},
	{
		id: "JGive",
		name: "JGive",
		category: "donate",
		categoryLabel: "Humanitarian & Donations",
		summary:
			"Transparent donation platform connecting donors worldwide with hundreds of vetted, tax-deductible Israeli nonprofits.",
		url: "https://www.jgive.com/new/he/ils/donation-targets/110048",
		tags: ["donate", "tax-deductible", "verified", "charities"],
	},
	{
		id: "GiveIsrael",
		name: "Give Israel",
		category: "donate",
		categoryLabel: "Humanitarian & Donations",
		summary:
			"Curated directory of verified Israeli charitable funds and grassroots relief initiatives.",
		url: "https://giveisrael.org/",
		tags: ["donate", "charities", "vetted"],
	},
	{
		id: "PitchonLev",
		name: "Pitchon Lev",
		category: "donate",
		categoryLabel: "Humanitarian & Donations",
		summary:
			"Provides food, clothing, rights advocacy, and youth education programs to help Israeli families break the cycle of poverty.",
		url: "https://www.pitchonlev.org.il/",
		tags: ["food", "clothing", "poverty", "donate"],
	},
	{
		id: "BrothersForLife",
		name: "Brothers For Life",
		category: "rehab",
		categoryLabel: "Veterans & Mental Health",
		summary:
			"Created and run by injured Israeli combat veterans helping newly wounded soldiers rebuild their bodies, minds, and lives.",
		url: "https://www.brothersforlife.com/",
		tags: ["veterans", "rehabilitation", "wounded soldiers", "donate"],
	},
	{
		id: "NATAL",
		name: "NATAL — Israel Trauma & Resiliency Center",
		category: "rehab",
		categoryLabel: "Veterans & Mental Health",
		summary:
			"Multidisciplinary mental health treatment, 24/7 helpline, and long-term therapy for civilians, soldiers, and families affected by trauma.",
		url: "https://www.natal.org.il/",
		tags: ["mental health", "trauma", "PTSD", "helpline"],
	},
	{
		id: "SafeHeart",
		name: "SafeHeart",
		category: "rehab",
		categoryLabel: "Veterans & Mental Health",
		summary:
			"Dedicated specialized psychological care and long-term community rehabilitation for survivors of the October 7 music festivals.",
		url: "https://www.safeheartil.com/",
		tags: ["mental health", "Nova", "survivors", "therapy"],
	},
	{
		id: "ERAN",
		name: "ERAN — Emotional First Aid (1201)",
		category: "rehab",
		categoryLabel: "Veterans & Mental Health",
		summary:
			"Free, anonymous 24/7 emotional first-aid helpline serving all residents of Israel in Hebrew, Arabic, Russian, and English.",
		url: "https://www.eran.org.il/",
		tags: ["helpline", "mental health", "24/7", "crisis"],
	},
	{
		id: "INZ",
		name: "IDF Disabled Veterans Organization",
		category: "rehab",
		categoryLabel: "Veterans & Mental Health",
		summary:
			"Operates Beit Halochem rehabilitation centers across Israel and provides lifelong medical, legal, and community support for injured veterans.",
		url: "https://www.inz.org.il/",
		tags: ["veterans", "Beit Halochem", "rehabilitation"],
	},
	{
		id: "RuachTova",
		name: "Ruach Tova — Good Spirit",
		category: "volunteer",
		categoryLabel: "Volunteering & Community",
		summary:
			"Israel's largest volunteering matching hub connecting individuals and groups with thousands of local NGOs across the country.",
		url: "https://www.ruachtova.org.il/",
		tags: ["volunteer", "NGOs", "community"],
	},
	{
		id: "LeketIsrael",
		name: "Leket Israel — Agricultural Volunteering",
		category: "volunteer",
		categoryLabel: "Volunteering & Community",
		summary:
			"Israel's National Food Bank — volunteer to harvest rescued produce with local farmers and distribute nutritious meals nationwide.",
		url: "https://www.leket.org/volunteering-for-farmers/",
		tags: ["agriculture", "volunteer", "food rescue", "farmers"],
	},
	{
		id: "HashomerHaChadash",
		name: "HaShomer HaChadash",
		category: "volunteer",
		categoryLabel: "Volunteering & Community",
		summary:
			"Mobilizes thousands of volunteers to support Israeli farmers in the Galilee and Negev through hands-on agricultural work and protection.",
		url: "https://www.hashomer.org.il/",
		tags: ["agriculture", "farmers", "volunteer", "Negev", "Galilee"],
	},
	{
		id: "Yedidim",
		name: "Yedidim — Roadside & Civic Rescue (1230)",
		category: "volunteer",
		categoryLabel: "Volunteering & Community",
		summary:
			"Nationwide volunteer network offering free 24/6 non-medical emergency assistance on the road and at home.",
		url: "https://yedidim-il.org/",
		tags: ["volunteer", "roadside", "emergency", "community"],
	},
	{
		id: "KremboWings",
		name: "Krembo Wings",
		category: "volunteer",
		categoryLabel: "Volunteering & Community",
		summary:
			"Inclusive Israeli youth movement bringing together children and teens with and without disabilities across dozens of branches.",
		url: "https://www.krembo.org.il/",
		tags: ["youth", "inclusion", "volunteer", "education"],
	},
	{
		id: "Elem",
		name: "ELEM — Youth in Distress",
		category: "volunteer",
		categoryLabel: "Volunteering & Community",
		summary:
			"Nationwide nonprofit providing street outreach, safe spaces, counseling, and mentorship for at-risk youth in Israel.",
		url: "https://elem.org.il/",
		tags: ["youth", "mental health", "outreach", "donate"],
	},
	{
		id: "StopAntisemitism",
		name: "StopAntisemitism",
		category: "advocacy",
		categoryLabel: "Advocacy & Remembrance",
		summary:
			"Grassroots watchdog exposing and holding antisemitic hate accountable globally with incident reporting tools.",
		url: "https://stopantisemitism.org/",
		tags: ["advocacy", "antisemitism", "report"],
	},
	{
		id: "VoicesOfIsrael",
		name: "Voices of Israel",
		category: "advocacy",
		categoryLabel: "Advocacy & Remembrance",
		summary:
			"Global network combating antisemitism and delegitimization through coordinated digital advocacy and community partnerships.",
		url: "https://voicesofisrael.org/",
		tags: ["advocacy", "public diplomacy", "global"],
	},
	{
		id: "Oct7Map",
		name: "Mapping the October 7th Massacres",
		category: "advocacy",
		categoryLabel: "Advocacy & Remembrance",
		summary:
			"Interactive, verified historical map documenting the events and communities affected on October 7, 2023.",
		url: "https://oct7map.com/",
		tags: ["remembrance", "archive", "history", "October 7"],
	},
	{
		id: "NationalLibrary",
		name: "National Library of Israel — Oct 7 Archive",
		category: "advocacy",
		categoryLabel: "Advocacy & Remembrance",
		summary:
			"The official national documentation archive preserving testimonies, media, and civic records from October 7 and beyond.",
		url: "https://www.nli.org.il/he/at-your-service/who-we-are/projects/7-october-documentation#projects",
		tags: ["archive", "documentation", "history", "remembrance"],
	},
	{
		id: "LeketIsraelMain",
		name: "Leket Israel — National Food Bank",
		category: "donate",
		categoryLabel: "Humanitarian & Donations",
		summary:
			"Israel's national food rescue organization redistributing surplus agricultural produce and cooked meals through hundreds of local NGOs.",
		url: "https://www.leket.org/",
		tags: ["food rescue", "humanitarian", "donate", "volunteer"],
	},
	{
		id: "YadSarah",
		name: "Yad Sarah",
		category: "donate",
		categoryLabel: "Humanitarian & Donations",
		summary:
			"Israel's largest volunteer medical-equipment lending network, providing free wheelchairs, hospital beds, home-care, and 24/7 emergency distress buttons.",
		url: "https://yad-sarah.net/",
		tags: ["medical", "equipment", "elderly", "volunteer", "donate"],
	},
	{
		id: "EzerMizion",
		name: "Ezer Mizion",
		category: "donate",
		categoryLabel: "Humanitarian & Donations",
		summary:
			"Operates the world's largest Jewish bone marrow donor registry alongside comprehensive medical transport, meals, and cancer patient support.",
		url: "https://www.ami.org.il/",
		tags: ["bone marrow", "cancer", "medical", "donate"],
	},
	{
		id: "UnitedHatzalah",
		name: "United Hatzalah (1221)",
		category: "donate",
		categoryLabel: "Humanitarian & Donations",
		summary:
			"Nationwide 24/7 volunteer emergency medical response network of ambucycles and medics reaching emergencies within minutes.",
		url: "https://1221.org.il/",
		tags: ["emergency", "EMS", "medics", "1221", "donate"],
	},
	{
		id: "ZAKA",
		name: "ZAKA — Search & Rescue (1220)",
		category: "donate",
		categoryLabel: "Humanitarian & Donations",
		summary:
			"Volunteer emergency response, search-and-rescue, diving, and disaster victim recovery teams operating across Israel and internationally.",
		url: "https://zaka.org.il/",
		tags: ["rescue", "emergency", "volunteer", "donate"],
	},
	{
		id: "LargerThanLife",
		name: "Larger Than Life (Gdolim MeHaChaim)",
		category: "donate",
		categoryLabel: "Humanitarian & Donations",
		summary:
			"Improves the quality of life for children fighting cancer and their families across Israel regardless of background.",
		url: "https://gdolim.org.il/",
		tags: ["children", "cancer", "medical", "donate"],
	},
	{
		id: "Enosh",
		name: "Enosh — Israeli Mental Health Association",
		category: "rehab",
		categoryLabel: "Veterans & Mental Health",
		summary:
			"Israel's leading community mental health rehabilitation NGO offering housing, employment, youth Headspace centers, and family counseling.",
		url: "https://www.enosh.org.il/",
		tags: ["mental health", "rehabilitation", "youth", "family"],
	},
	{
		id: "IsraelTraumaCoalition",
		name: "Israel Trauma Coalition (ITC)",
		category: "rehab",
		categoryLabel: "Veterans & Mental Health",
		summary:
			"Umbrella network operating Israel's Resilience Centers nationwide and training emergency responders and communities in trauma care.",
		url: "https://israeltraumacoalition.org/",
		tags: ["trauma", "resilience", "emergency", "mental health"],
	},
	{
		id: "ALUT",
		name: "ALUT — National Society for Children & Adults with Autism",
		category: "rehab",
		categoryLabel: "Veterans & Mental Health",
		summary:
			"Supports Israelis on the autism spectrum and their families through rehabilitative daycare, family centers, employment, and housing.",
		url: "https://alut.org.il/",
		tags: ["autism", "disabilities", "family", "rehabilitation"],
	},
	{
		id: "ADIIsrael",
		name: "ADI Israel (ADI Negev-Nahalat Eran)",
		category: "rehab",
		categoryLabel: "Veterans & Mental Health",
		summary:
			"Operates the Negev's first rehabilitative hospital and specialized residential, medical, and educational care for people with severe disabilities.",
		url: "https://adi-il.org.il/",
		tags: ["rehabilitation", "disabilities", "Negev", "hospital"],
	},
	{
		id: "Etgarim",
		name: "Etgarim — Adaptive Outdoor Sports",
		category: "volunteer",
		categoryLabel: "Volunteering & Community",
		summary:
			"Empowers children, youth, adults with disabilities, and wounded veterans through cycling, sailing, running, and outdoor adaptive sports.",
		url: "https://etgarim.org/",
		tags: ["adaptive sports", "disabilities", "veterans", "volunteer"],
	},
	{
		id: "ZikaronBaSalon",
		name: "Zikaron BaSalon (Memories in the Living Room)",
		category: "advocacy",
		categoryLabel: "Advocacy & Remembrance",
		summary:
			"Global grassroots tradition hosting intimate living-room testimonies, music, and dialogue for Holocaust Remembrance Day worldwide.",
		url: "https://www.zikaronbasalon.com/",
		tags: ["Holocaust", "remembrance", "community", "global"],
	},
	{
		id: "GiveThemAKaddish",
		name: "Give Them a Kaddish",
		category: "advocacy",
		categoryLabel: "Advocacy & Remembrance",
		summary:
			"Connects volunteers worldwide to say Kaddish in memory of victims who have no surviving family members to do so.",
		url: "https://www.givethemakaddish.org/",
		tags: ["memorial", "remembrance", "Kaddish"],
	},
];
