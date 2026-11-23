import {
	ENGLISH_INITIATIVES,
	EnglishInitiative,
} from "@/app/components/EnglishPortal/englishInitiatives";
import {
	computeInitiativeRankScore,
	getCategories,
	InitiativeLink,
} from "@/app/utils/categories";

export interface IntlInitiativeItem {
	id: string;
	name: string;
	category: "donate" | "rehab" | "volunteer" | "advocacy";
	categoryLabel: string;
	summary: string;
	url: string;
	tags: string[];
	us501c3?: boolean;
}

export interface EnrichedIntlInitiative extends IntlInitiativeItem {
	link: InitiativeLink;
	sharePath?: string;
	categoryId?: string;
	subCategoryName?: string;
	rankScore: number;
}

export const US_501C3_IDS = new Set([
	"Latet",
	"JGive",
	"PitchonLev",
	"BrothersForLife",
	"NATAL",
	"ERAN",
	"LeketIsrael",
	"LeketIsraelMain",
	"HashomerHaChadash",
	"Yedidim",
	"KremboWings",
	"Elem",
	"YadSarah",
	"EzerMizion",
	"UnitedHatzalah",
	"ZAKA",
	"IsraeliChildrensFund",
	"LargerThanLife",
	"Enosh",
	"IsraelTraumaCoalition",
	"ALUT",
	"ADIIsrael",
	"Etgarim",
	"ZikaronBaSalon",
	"IDFWO",
	"ZichronMenachem",
	"ILANIsrael",
	"AlehIsrael",
	"HolocaustSurvivorsWelfare",
	"YadLaKashish",
	"SPNI",
	"GhettoFightersHouse",
]);

export const EN_ITEMS: IntlInitiativeItem[] = ENGLISH_INITIATIVES.map(
	(item: EnglishInitiative) => ({
		...item,
		us501c3: US_501C3_IDS.has(item.id),
	}),
);

function normalizeHost(url?: string): string | null {
	if (!url) return null;
	try {
		return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
	} catch {
		return null;
	}
}

export async function getEnrichedEnglishInitiatives(): Promise<
	EnrichedIntlInitiative[]
> {
	const categories = await getCategories();

	const byName = new Map<
		string,
		{
			link: InitiativeLink;
			sharePath: string;
			categoryId: string;
			subCategoryName: string;
		}
	>();
	const byHost = new Map<
		string,
		{
			link: InitiativeLink;
			sharePath: string;
			categoryId: string;
			subCategoryName: string;
		}
	>();

	for (const cat of categories) {
		for (const sub of cat.subCategories) {
			for (const link of sub.links) {
				const entry = {
					link,
					categoryId: cat.id,
					subCategoryName: sub.name,
					sharePath: `/${encodeURIComponent(cat.id)}/${encodeURIComponent(
						sub.name,
					)}/${encodeURIComponent(link.name)}`,
				};
				byName.set(link.name.toLowerCase(), entry);
				const host = normalizeHost(link.url || link.website);
				if (host && !byHost.has(host)) {
					byHost.set(host, entry);
				}
			}
		}
	}

	return EN_ITEMS.map((item) => {
		const matched =
			byName.get(item.id.toLowerCase()) ||
			byHost.get(normalizeHost(item.url) || "");
		const source = matched?.link;

		const mergedLink: InitiativeLink = {
			...(source || {}),
			name: source?.name || item.id,
			displayName: item.name,
			shortDescription: item.summary,
			description: undefined,
			url: item.url,
			website: item.url,
			tags: item.tags,
			us501c3: item.us501c3 || source?.us501c3,
		};

		return {
			...item,
			link: mergedLink,
			sharePath: matched?.sharePath,
			categoryId: matched?.categoryId,
			subCategoryName: matched?.subCategoryName,
			rankScore: computeInitiativeRankScore(mergedLink),
		};
	}).sort((a, b) => b.rankScore - a.rankScore);
}
