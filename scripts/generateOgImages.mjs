/**
 * Build-time branded 1200x630 Open Graph PNG generator for WhatsApp/Telegram/X/LinkedIn previews.
 * Uses ImageMagick (`magick`) with explicit system TrueType fonts and composites `public/icon-192.png`.
 */
import { execFileSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

const REPO_ROOT = process.cwd();
const OG_DIR = path.join(REPO_ROOT, "public/og");
const LOGO_PNG = path.join(REPO_ROOT, "public/icon-192.png");
const FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf";
const FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf";

const CARDS = [
	{
		file: "home.png",
		badge: "LINKS FOR ISRAEL · OPEN CIVIC DIRECTORY",
		title: "Links For Israel",
		subtitle: "160+ Verified Israeli Nonprofits, Aliyah, Mental Health & 24/7 Hotlines",
		accent: "#0038b8",
	},
	{
		file: "en.png",
		badge: "ENGLISH DIASPORA PORTAL",
		title: "Support, Volunteer & Donate",
		subtitle: "MOJ-Verified Israeli Charities · Aliyah & Olim · Section 46 & 501(c)(3)",
		accent: "#0f4c81",
	},
	{
		file: "methodology.png",
		badge: "OPEN VERIFICATION METHODOLOGY",
		title: "How We Verify & Rank NGOs",
		subtitle: "Live data.gov.il Ministry of Justice Checks & Independent Media Citations",
		accent: "#065f46",
	},
	{
		file: "Medical.png",
		badge: "HEALTH & MENTAL SUPPORT",
		title: "Medical & Mental Health",
		subtitle: "ERAN 1201 · NATAL · Yad Sarah · United Hatzalah · MDA · Ezer Mizion",
		accent: "#0369a1",
	},
	{
		file: "Defense.png",
		badge: "EMERGENCY & RESERVISTS",
		title: "Emergency, Defense & Reserves",
		subtitle: "Home Front Command 104 · Reservist Rights · Wounded Veterans · ZAKA",
		accent: "#1e3a8a",
	},
	{
		file: "Economic.png",
		badge: "DONATIONS & ECONOMIC AID",
		title: "Donations, Food & Economy",
		subtitle: "Latet · Leket Israel · Paamonim · Ogen · Section 46 Verified Charities",
		accent: "#5b21b6",
	},
	{
		file: "FamilyAndPets.png",
		badge: "FAMILY, YOUTH & ANIMALS",
		title: "Family, Children & Pets",
		subtitle: "ALUT · AKIM · Krembo Wings · ELEM · Perach · Animal Rescue",
		accent: "#0f766e",
	},
	{
		file: "GeneralAssistance.png",
		badge: "VOLUNTEERING & RIGHTS",
		title: "Volunteering, Rights & Community",
		subtitle: "KolZchut · Ruach Tova · Yedidim 1230 · Kav LaOved · SPNI",
		accent: "#1d4ed8",
	},
	{
		file: "Olim.png",
		badge: "ALIYAH & NEW OLIM",
		title: "Aliyah, Absorption & Olim",
		subtitle: "MOIA *2994 · Jewish Agency · Nefesh B'Nefesh · Gvahim · Lone Soldiers",
		accent: "#1e40af",
	},
	{
		file: "Agriculture.png",
		badge: "ISRAELI AGRICULTURE",
		title: "Support Israeli Farmers",
		subtitle: "Leket Israel · HaShomer HaChadash · Direct-from-Farm Produce",
		accent: "#15803d",
	},
	{
		file: "MemorialRemembrance.png",
		badge: "MEMORIAL & ARCHIVES",
		title: "Memorial & Remembrance",
		subtitle: "National Library Archive · Zikaron BaSalon · Oct 7 Documentation",
		accent: "#334155",
	},
	{
		file: "StrategicCommunication.png",
		badge: "ADVOCACY & PUBLIC DIPLOMACY",
		title: "Advocacy & Information",
		subtitle: "Verified Research, Fact-Checking & Global Israeli Advocacy Networks",
		accent: "#9a3412",
	},
];

async function main() {
	await fs.mkdir(OG_DIR, { recursive: true });

	for (const card of CARDS) {
		const outPath = path.join(OG_DIR, card.file);
		execFileSync(
			"magick",
			[
				"-size",
				"1200x630",
				`gradient:#0b1f52-${card.accent}`,
				// Soft translucent inner frame
				"-fill",
				"rgba(255,255,255,0.08)",
				"-stroke",
				"rgba(255,255,255,0.22)",
				"-strokewidth",
				"2",
				"-draw",
				"roundrectangle 44,44 1156,586 30,30",
				// Badge pill
				"-stroke",
				"none",
				"-fill",
				"rgba(255,255,255,0.16)",
				"-draw",
				"roundrectangle 90,92 590,136 22,22",
				"-font",
				FONT_BOLD,
				"-pointsize",
				"19",
				"-fill",
				"#e0f2fe",
				"-annotate",
				"+114+121",
				card.badge,
				// Main title
				"-font",
				FONT_BOLD,
				"-pointsize",
				"58",
				"-fill",
				"#ffffff",
				"-annotate",
				"+90+285",
				card.title,
				// Subtitle
				"-font",
				FONT_REGULAR,
				"-pointsize",
				"26",
				"-fill",
				"#dbeafe",
				"-annotate",
				"+90+350",
				card.subtitle,
				// Bottom divider
				"-fill",
				"rgba(255,255,255,0.25)",
				"-draw",
				"rectangle 90,468 1110,470",
				// Footer domain & provenance
				"-font",
				FONT_BOLD,
				"-pointsize",
				"24",
				"-fill",
				"#ffffff",
				"-annotate",
				"+90+530",
				"www.linksforisrael.com",
				"-font",
				FONT_REGULAR,
				"-pointsize",
				"21",
				"-fill",
				"#93c5fd",
				"-annotate",
				"+675+530",
				"Open Source · MOJ Verified · 24/7 Hotlines",
				// White circular badge behind logo in top-right
				"-fill",
				"rgba(255,255,255,0.95)",
				"-draw",
				"roundrectangle 985,84 1115,214 26,26",
				"(",
				LOGO_PNG,
				"-resize",
				"108x108",
				")",
				"-geometry",
				"+996+95",
				"-composite",
				outPath,
			],
			{ stdio: "pipe" },
		);
	}

	console.log(
		`Generated ${CARDS.length} branded 1200x630 OG PNG cards in public/og/.`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
