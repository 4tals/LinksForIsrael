export interface EnglishInitiative {
	id: string;
	name: string;
	category: "donate" | "rehab" | "volunteer" | "olim" | "judaism" | "advocacy";
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
		id: "IsraeliChildrensFund",
		name: "Israeli Children's Fund (Atufim B'Ahava)",
		category: "donate",
		categoryLabel: "Humanitarian & Donations",
		summary:
			"Provides long-term financial, emotional, educational, and mentorship support to hundreds of children and young adults orphaned on October 7 and during the war.",
		url: "https://israelichildrensfund.org/",
		tags: ["children", "orphans", "October 7", "donate", "family"],
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
	{
		id: "IDFWO",
		name: "IDF Widows & Orphans Organization",
		category: "rehab",
		categoryLabel: "Veterans & Mental Health",
		summary:
			"Israel's official statutory organization supporting thousands of widows and orphans of fallen IDF soldiers and security personnel.",
		url: "https://www.idfwo.org/",
		tags: ["widows", "orphans", "IDF", "bereaved families", "donate"],
	},
	{
		id: "ZichronMenachem",
		name: "Zichron Menachem",
		category: "donate",
		categoryLabel: "Humanitarian & Donations",
		summary:
			"Holistic medical, emotional, hair-donation wig salon, and summer-camp support for children and young adults battling cancer in Israel.",
		url: "https://zichron.org/",
		tags: ["cancer", "children", "medical", "donate"],
	},
	{
		id: "ILANIsrael",
		name: "ILAN — Israel Foundation for Handicapped Children",
		category: "rehab",
		categoryLabel: "Veterans & Mental Health",
		summary:
			"Empowering children and adults with physical disabilities since 1952 through adaptive sports centers, rehab daycares, and independent living.",
		url: "https://ilan-israel.co.il/",
		tags: ["disabilities", "rehabilitation", "sports", "children"],
	},
	{
		id: "AlehIsrael",
		name: "ALEH — Rehabilitative Care Network",
		category: "rehab",
		categoryLabel: "Veterans & Mental Health",
		summary:
			"Provides advanced medical, rehabilitative, and special-education care for children and adults with severe complex disabilities across Israel.",
		url: "https://aleh.org/",
		tags: ["disabilities", "rehabilitation", "special education"],
	},
	{
		id: "HolocaustSurvivorsWelfare",
		name: "Foundation for the Benefit of Holocaust Victims in Israel",
		category: "donate",
		categoryLabel: "Humanitarian & Donations",
		summary:
			"Provides nursing hours, emergency distress buttons, eyeglasses, home repairs, and volunteer companionship for tens of thousands of Holocaust survivors.",
		url: "https://www.k-shoa.org/",
		tags: ["Holocaust survivors", "elderly", "welfare", "donate"],
	},
	{
		id: "YadLaKashish",
		name: "Yad LaKashish — Lifeline for the Old",
		category: "volunteer",
		categoryLabel: "Volunteering & Community",
		summary:
			"Empowers hundreds of elderly Jerusalem residents with purpose, dignity, artisan workshops, hot meals, and social care.",
		url: "https://www.lifeline.org.il/",
		tags: ["elderly", "Jerusalem", "community", "art"],
	},
	{
		id: "SPNI",
		name: "Society for the Protection of Nature in Israel (SPNI)",
		category: "volunteer",
		categoryLabel: "Volunteering & Community",
		summary:
			"Israel's oldest and largest nature conservation NGO leading wildlife restoration, Israel National Trail stewardship, and environmental volunteering.",
		url: "https://www.teva.org.il/",
		tags: ["nature", "environment", "volunteer", "Israel Trail"],
	},
	{
		id: "GhettoFightersHouse",
		name: "Ghetto Fighters' House Museum & Archive",
		category: "advocacy",
		categoryLabel: "Advocacy & Remembrance",
		summary:
			"The world's first Holocaust museum founded by survivors, preserving open historical archives, testimonies, and Yad Layeled youth education.",
		url: "https://www.gfh.org.il/",
		tags: ["Holocaust", "archive", "museum", "remembrance"],
	},
	{
		id: "MinistryOfAliyah",
		name: "Ministry of Aliyah and Integration (*2994)",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Official Israeli government ministry for new immigrants & returning residents — Sal Klita, Ulpan vouchers, rental assistance, licensing, and *2994 hotline in 7 languages.",
		url: "https://www.gov.il/he/departments/ministry_of_aliyah_and_integration",
		tags: ["aliyah", "olim", "sal klita", "ulpan", "official", "rights"],
	},
	{
		id: "JewishAgency",
		name: "The Jewish Agency for Israel",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Official global Aliyah organization guiding eligibility, pre-Aliyah preparation, absorption centers, Ulpan Etzion, and emergency community support.",
		url: "https://www.jewishagency.org/",
		tags: ["aliyah", "olim", "ulpan", "absorption", "official"],
	},
	{
		id: "NefeshBNefesh",
		name: "Nefesh B'Nefesh",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Comprehensive Aliyah planning, post-Aliyah rights guidance, career support, community integration, and national Lone Soldiers program for North American Olim.",
		url: "https://www.nbn.org.il/",
		tags: ["aliyah", "olim", "lone soldiers", "careers", "North America"],
	},
	{
		id: "YadLOlim",
		name: "Yad L'Olim",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Hands-on bureaucratic assistance, medical & licensing advocacy, and Knesset representation helping Olim from every country navigate Israeli ministries.",
		url: "https://www.yadlolim.org/",
		tags: ["olim", "aliyah", "rights", "advocacy", "bureaucracy"],
	},
	{
		id: "AACI",
		name: "AACI — Americans & Canadians in Israel",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Serving English-speaking Olim since 1951 with personal Aliyah counselors, rights & retirement workshops, libraries, and community branches nationwide.",
		url: "https://aaci.org.il/",
		tags: ["olim", "aliyah", "English", "community", "counseling"],
	},
	{
		id: "Telfed",
		name: "Telfed — South African & Australian Olim",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Absorption support, student scholarships, rental housing, employment placement, and Lone Soldier care for Olim from South Africa, Australia, and New Zealand.",
		url: "https://www.telfed.org.il/",
		tags: ["olim", "aliyah", "South Africa", "Australia", "scholarships"],
	},
	{
		id: "Qualita",
		name: "Qualita — French & European Olim Umbrella",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Umbrella hub for French-speaking and European Olim offering career centers, Ulpan programs, entrepreneurship guidance, and family absorption aid.",
		url: "https://www.qualita.org.il/",
		tags: ["olim", "aliyah", "French", "Europe", "careers"],
	},
	{
		id: "OLEI",
		name: "OLEI — Latin American, Spanish & Portuguese Olim",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Nationwide branches providing absorption counseling, bureaucratic guidance, scholarships, and career networking for Spanish- and Portuguese-speaking Olim.",
		url: "https://olei.org.il/",
		tags: ["olim", "aliyah", "Latin America", "Spanish", "Portuguese"],
	},
	{
		id: "ESRA",
		name: "ESRA — English Speaking Residents Association",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Israel's largest volunteer-driven English-speaking community organization fostering social integration for Olim alongside educational and welfare projects.",
		url: "https://www.esra.org.il/",
		tags: ["olim", "English", "volunteer", "community"],
	},
	{
		id: "Gvahim",
		name: "Gvahim — Olim Career & Entrepreneurship",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Accelerates career integration for skilled Olim and returning residents through 1-on-1 mentoring, high-tech networking, and startup founder accelerators.",
		url: "https://gvahim.org.il/",
		tags: ["olim", "careers", "hi-tech", "mentoring", "startups"],
	},
	{
		id: "LoneSoldierCenter",
		name: "The Lone Soldier Center (In Memory of Michael Levin)",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Provides housing advice, IDF rights guidance, Shabbat meals, gear, and post-army transition support for Olim and Israeli Lone Soldiers nationwide.",
		url: "https://lonesoldiercenter.com/",
		tags: ["lone soldiers", "olim", "IDF", "housing", "volunteer"],
	},
	{
		id: "MichaelLevinBase",
		name: "The Michael Levin Base for Lone Soldiers & Bnot Sherut",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Support centers in Jerusalem and Tel Aviv offering pre-draft prep, personal & emotional counseling, workshops, and community for Lone Soldiers and National Service Olim.",
		url: "https://themichaellevinbase.org/",
		tags: ["lone soldiers", "olim", "national service", "support"],
	},
	{
		id: "GarinTzabar",
		name: "Garin Tzabar — IDF Aliyah Program",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Scouts-run program integrating young diaspora Jews and children of Israelis into adoptive kibbutz host communities before and throughout IDF Lone Soldier service.",
		url: "https://garintzabar.org/",
		tags: ["lone soldiers", "olim", "aliyah", "kibbutz", "IDF"],
	},
	{
		id: "KeepOlim",
		name: "KeepOlim",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Subsidized native-language mental health therapy, community events, job support, and integration programs helping Olim thrive in Israel.",
		url: "https://keepolim.org/",
		tags: ["olim", "mental health", "community", "aliyah"],
	},
	{
		id: "GetHelpIsrael",
		name: "Get Help Israel — English Mental Health Directory",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Free searchable directory connecting English-speaking Olim and residents with licensed therapists, counselors, and support groups across Israel.",
		url: "https://gethelpisrael.com/",
		tags: ["olim", "mental health", "English", "therapy"],
	},
	{
		id: "Adesco",
		name: "Adesco — Licensed Money Transfers to Israel",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"ISA-licensed Israeli Payments Company specializing in inbound FX transfers (USD/EUR/GBP/CAD/AUD/CHF to ILS), Olim transitions, and real estate payments (shovarim, Mas Rechisha & trust accounts). Commercial service, not an NGO.",
		url: "https://www.adesco.co.il/",
		tags: [
			"money transfer",
			"FX",
			"olim",
			"real estate",
			"banking",
			"licensed",
		],
	},
	{
		id: "IsraTransfer",
		name: "IsraTransfer — Currency Exchange to Israel",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Regulated Israel-focused FX and international wire transfer provider serving Olim, families, and real estate buyers since 2008. Commercial service, not an NGO.",
		url: "https://isratransfer.com/",
		tags: ["money transfer", "FX", "olim", "banking", "licensed"],
	},
	{
		id: "Wise",
		name: "Wise — International Transfers & Multi-Currency",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Globally regulated (FCA / FinCEN) multi-currency account and transparent international wire transfers into Israeli shekel (ILS) bank accounts. Commercial service, not an NGO.",
		url: "https://wise.com/",
		tags: ["money transfer", "FX", "olim", "remote work", "licensed"],
	},
	{
		id: "Covercy",
		name: "Covercy — Cross-Border & Real Estate FX",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Israel-founded regulated fintech providing cross-border FX transfers for individuals, property buyers, and international investors. Commercial service, not an NGO.",
		url: "https://www.covercy.com/",
		tags: ["money transfer", "FX", "olim", "real estate", "licensed"],
	},
	{
		id: "Payoneer",
		name: "Payoneer — Global Payments for Freelancers",
		category: "olim",
		categoryLabel: "Aliyah & New Olim",
		summary:
			"Israel-founded global payments platform widely used by Olim remote workers, freelancers, and businesses to receive foreign income and withdraw to Israeli banks. Commercial service, not an NGO.",
		url: "https://www.payoneer.com/",
		tags: ["money transfer", "freelancers", "remote work", "olim", "licensed"],
	},
	{
		id: "MasortiIsrael",
		name: "The Masorti Movement in Israel",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Israel's Masorti / Conservative Jewish movement uniting egalitarian congregations nationwide, Bar/Bat Mitzvah for children with disabilities, conversion, and pluralistic Jewish life.",
		url: "https://www.masorti.org.il/",
		tags: [
			"judaism",
			"masorti",
			"conservative",
			"synagogues",
			"Israel",
			"egalitarian",
		],
	},
	{
		id: "MasortiOlami",
		name: "Masorti Olami — Worldwide Masorti/Conservative Movement",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Global umbrella connecting Masorti / Conservative Jewish communities, rabbis, and youth movements across Europe, Latin America, Asia, Australia, and Africa with Israel.",
		url: "https://masortiolami.org/",
		tags: ["judaism", "masorti", "conservative", "diaspora", "communities"],
	},
	{
		id: "USCJ",
		name: "USCJ — United Synagogue of Conservative Judaism",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Network of Conservative Jewish congregations across North America fostering synagogue life, USY youth engagement, and deep connection with Israel.",
		url: "https://uscj.org/",
		tags: ["judaism", "conservative", "masorti", "North America", "synagogues"],
	},
	{
		id: "RabbinicalAssembly",
		name: "The Rabbinical Assembly",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"International association of Conservative / Masorti rabbis publishing halakhic responsa (CJLS), prayerbooks, holiday guides, and lifecycle resources worldwide.",
		url: "https://www.rabbinicalassembly.org/",
		tags: ["judaism", "conservative", "masorti", "halakha", "rabbis"],
	},
	{
		id: "SchechterInstitute",
		name: "Schechter Institutes (Jerusalem)",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Israel's flagship Masorti / Conservative academic institute for Jewish studies, rabbinical ordination, TALI schools, and Neve Schechter Jewish culture.",
		url: "https://schechter.ac.il/",
		tags: ["judaism", "masorti", "conservative", "Jerusalem", "learning"],
	},
	{
		id: "FuchsbergCenter",
		name: "Fuchsberg Jerusalem Center (Conservative Yeshiva)",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Jerusalem home of the Conservative Yeshiva offering open text study, egalitarian prayer, and community programs for Israelis, Olim, and diaspora visitors.",
		url: "https://fuchsbergcenter.org/",
		tags: ["judaism", "conservative", "masorti", "Jerusalem", "yeshiva"],
	},
	{
		id: "Sefaria",
		name: "Sefaria — Free Open-Source Jewish Library",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"The world's free, open-source digital library of Jewish texts — Tanakh, Talmud, Mishnah, Midrash, Halakha, and source sheets in Hebrew and English.",
		url: "https://www.sefaria.org/",
		tags: ["judaism", "Torah", "Talmud", "open source", "learning", "texts"],
	},
	{
		id: "Itim",
		name: "ITIM — Jewish Life-Cycle Advocacy in Israel",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Free guidance and legal advocacy helping Israelis and new Olim navigate Jewish status verification, marriage, conversion, and burial bureaucracy in Israel.",
		url: "https://itim.org.il/",
		tags: ["judaism", "lifecycle", "olim", "marriage", "conversion", "rights"],
	},
	{
		id: "Tzohar",
		name: "Tzohar Rabbinical Organization",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Bridging Jewish tradition and Israeli society through welcoming weddings, kashrut supervision, Shabbat initiatives, and ethics guidance.",
		url: "https://www.tzohar.org.il/",
		tags: ["judaism", "weddings", "kashrut", "Israel", "community"],
	},
	{
		id: "Chabad",
		name: "Chabad.org — Global Jewish Directory & Times",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Worldwide Chabad House locator for travelers and diaspora communities, Shabbat candle-lighting times, holiday guides, and Jewish study resources.",
		url: "https://www.chabad.org/",
		tags: ["judaism", "Shabbat", "holidays", "diaspora", "Chabad"],
	},
	{
		id: "ANUMuseum",
		name: "ANU — Museum of the Jewish People",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Tel Aviv museum and open digital archive celebrating the full story, genealogy, music, and heritage of Jewish communities in Israel and worldwide.",
		url: "https://www.anumuseum.org.il/",
		tags: ["judaism", "heritage", "museum", "diaspora", "history"],
	},
	{
		id: "BINA",
		name: "BINA — The Jewish Movement for Social Change",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Pluralistic Israeli Judaism, Secular Yeshiva campuses, pre-army leadership programs, and community social action across Israel and abroad.",
		url: "https://www.bina.org.il/",
		tags: ["judaism", "pluralism", "Israel", "culture", "education"],
	},
	{
		id: "HartmanInstitute",
		name: "Shalom Hartman Institute",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Leading pluralistic center for Jewish thought, research, podcasts, and leadership education bridging Israel and North American Jewry.",
		url: "https://www.hartman.org.il/",
		tags: ["judaism", "Israel", "diaspora", "thought", "podcasts"],
	},
	{
		id: "Pardes",
		name: "Pardes Institute of Jewish Studies",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Open, co-ed, non-denominational Jerusalem beit midrash welcoming students, Olim, and educators from every Jewish background.",
		url: "https://pardes.org.il/",
		tags: ["judaism", "Jerusalem", "learning", "beit midrash", "olim"],
	},
	{
		id: "Hebcal",
		name: "Hebcal — Open-Source Jewish Calendar",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Free open-source Hebrew date converter, Shabbat & holiday candle-lighting times worldwide, Torah readings, and Google/Apple calendar sync.",
		url: "https://www.hebcal.com/",
		tags: ["judaism", "calendar", "Shabbat", "holidays", "open source"],
	},
	{
		id: "MyJewishLearning",
		name: "My Jewish Learning",
		category: "judaism",
		categoryLabel: "Judaism & Heritage",
		summary:
			"Accessible, non-denominational online encyclopedia of Jewish holidays, history, prayer, culture, and life across Israel and the diaspora.",
		url: "https://www.myjewishlearning.com/",
		tags: ["judaism", "holidays", "learning", "culture", "diaspora"],
	},
];
