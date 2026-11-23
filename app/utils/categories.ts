import categories from "@/_data/categories.json";

export type InitiativeIntent = "get-help" | "volunteer" | "donate";
export type OrganizationType = "ngo" | "official" | "community" | "licensed";
export type ReferenceType =
	| "official"
	| "registry"
	| "article"
	| "video"
	| "podcast"
	| "blog"
	| "endorsement"
	| "x_post"
	| "linkedin"
	| "social"
	| "other";

export interface InitiativeReference {
	url: string;
	type: ReferenceType;
	source?: string;
	title?: string;
	author?: string;
	quote?: string;
	date?: string;
}

export interface CategoryData {
	name: string;
	displayName: string;
	longDisplayName: string;
	description: string;
	image: string;
	subCategories: string[];
}

export interface SubCategoryData {
	name: string;
	displayName: string;
	links: Array<InitiativeLink>;
}

export interface InitiativeLink {
	name: string;
	displayName: string;
	shortDescription?: string;
	initiativeValidationDetails?: string;
	description?: string;
	url?: string;
	initiativeImage?: string;
	whatsapp?: string;
	telegram?: string;
	drive?: string;
	form?: string;
	forms?: string;
	doc?: string;
	docs?: string;
	website?: string;
	facebook?: string;
	discord?: string;
	instagram?: string;
	tiktok?: string;
	twitter?: string;
	portal?: string;
	phone?: string;
	linkedin?: string;
	youtube?: string;
	email?: string;
	contactEmail?: string;
	donation?: string;
	tags?: string[];
	intents?: InitiativeIntent[];
	verified?: boolean;
	taxDeductible46?: boolean;
	properManagement?: boolean;
	registrationNumber?: string;
	registryCheckedAt?: string;
	us501c3?: boolean;
	organizationType?: OrganizationType;
	regulator?: string;
	references?: InitiativeReference[];
	createdAt?: string;
}

function extractNormalizedHost(url?: string): string | null {
	if (!url) return null;
	try {
		return new URL(url).hostname
			.toLowerCase()
			.replace(/^(www|m|he|en|news|nadlan)\./, "");
	} catch {
		return null;
	}
}

export function isThirdPartyReference(
	link: InitiativeLink,
	ref: InitiativeReference,
): boolean {
	const refHost = extractNormalizedHost(ref.url);
	if (!refHost) return false;
	const ownHosts = new Set(
		[link.url, link.website, link.portal]
			.map((u) => extractNormalizedHost(u))
			.filter((h): h is string => Boolean(h)),
	);
	return !ownHosts.has(refHost);
}

export function getReferenceSummary(
	link: InitiativeLink,
	maxSources = 2,
): { label: string; tooltip: string; count: number } | null {
	const refs = link.references || [];
	if (refs.length === 0) return null;

	const uniqueSources: string[] = [];
	for (const ref of refs) {
		const name =
			ref.source || extractNormalizedHost(ref.url) || ref.author || "";
		if (name && !uniqueSources.includes(name)) {
			uniqueSources.push(name);
		}
	}

	const shown = uniqueSources.slice(0, maxSources);
	const remaining = refs.length - shown.length;
	const label =
		shown.length > 0
			? remaining > 0
				? `${shown.join(" · ")} +${remaining}`
				: shown.join(" · ")
			: `${refs.length} אזכורים`;

	const tooltip = refs
		.map((r) => {
			const src = r.source || extractNormalizedHost(r.url) || r.url;
			return r.title ? `${src}: ${r.title}` : src;
		})
		.join(" | ");

	return { label, tooltip, count: refs.length };
}

export function computeInitiativeRankScore(link: InitiativeLink): number {
	let score = 0;

	if (link.verified) score += 35;
	if (link.organizationType === "official") score += 15;
	if (link.organizationType === "licensed" && link.regulator) score += 35;
	if (link.taxDeductible46) score += 10;

	// Weighted independent third-party references with per-tier caps + source diversity bonus
	const refs = link.references || [];
	let officialRegPoints = 0;
	let mediaPoints = 0;
	let communityPoints = 0;
	const distinctThirdPartyDomains = new Set<string>();

	for (const ref of refs) {
		if (!isThirdPartyReference(link, ref)) continue;

		const host = extractNormalizedHost(ref.url);
		if (host) distinctThirdPartyDomains.add(host);

		switch (ref.type) {
			case "official":
			case "registry":
				officialRegPoints += 14;
				break;
			case "article":
			case "video":
			case "podcast":
				mediaPoints += 12;
				break;
			case "blog":
			case "endorsement":
			case "x_post":
			case "linkedin":
			case "social":
				communityPoints += 6;
				break;
			default:
				communityPoints += 3;
		}
	}

	score += Math.min(24, officialRegPoints);
	score += Math.min(24, mediaPoints);
	score += Math.min(15, communityPoints);

	// Reward mentions across multiple distinct independent sources (+3 each beyond first, cap +9)
	if (distinctThirdPartyDomains.size > 1) {
		score += Math.min(9, (distinctThirdPartyDomains.size - 1) * 3);
	}

	// Contact & profile completeness (up to +6)
	if (link.website || link.url) score += 2;
	if (link.phone) score += 2;
	if (link.shortDescription && link.description) score += 2;

	return Math.min(100, score);
}

export function sortInitiativesByRank(
	links: InitiativeLink[],
): InitiativeLink[] {
	return [...links].sort(
		(a, b) => computeInitiativeRankScore(b) - computeInitiativeRankScore(a),
	);
}

export function getInitiativeIntents(
	link: InitiativeLink,
	categoryId?: string,
): InitiativeIntent[] {
	if (link.intents && link.intents.length > 0) {
		return link.intents;
	}

	const intents = new Set<InitiativeIntent>();
	const text = [
		link.displayName,
		link.shortDescription,
		link.description,
		...(link.tags || []),
	]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();

	if (
		link.donation ||
		categoryId === "Economic" ||
		/תרומ|לתרום|donat|jgive|paybox|עמותה|קונים|חקלאות|עסקים/.test(text)
	) {
		intents.add("donate");
	}

	if (
		categoryId === "Agriculture" ||
		categoryId === "StrategicCommunication" ||
		categoryId === "GeneralAssistance" ||
		/התנדב|מתנדב|volunteer|חמ״ל|חמל|הסברה|הסעות|שינוע|קדיש/.test(text)
	) {
		intents.add("volunteer");
	}

	if (
		categoryId === "Medical" ||
		categoryId === "Defense" ||
		categoryId === "FamilyAndPets" ||
		categoryId === "GeneralAssistance" ||
		/סיוע|עזרה|טיפול|תמיכה|נפשי|זכויות|מוקד|מקלט|ממ״ד|ממד|חירום|מילואים|ילדים|רפואי|יעוץ|ייעוץ|support|help/.test(
			text,
		)
	) {
		intents.add("get-help");
	}

	if (intents.size === 0) {
		intents.add("get-help");
	}

	return Array.from(intents);
}

export function getPrimaryInitiativeUrl(link: InitiativeLink): string | null {
	const candidates = [
		link.url,
		link.website,
		link.portal,
		link.form,
		link.forms,
		link.whatsapp,
		link.telegram,
		link.facebook,
		link.instagram,
		link.donation,
		link.drive,
		link.docs,
		link.doc,
		link.youtube,
		link.twitter,
		link.linkedin,
		link.tiktok,
		link.discord,
	];

	for (const candidate of candidates) {
		if (typeof candidate === "string" && candidate.trim().length > 0) {
			return candidate.trim();
		}
	}

	return null;
}

export async function getCategories() {
	return await Promise.all(categories.map(getCategory));
}

export type Category = Awaited<ReturnType<typeof getCategory>>;

export async function getCategory(category: string) {
	const categoryData = (await import(`@/_data/links/${category}/links.json`))
		.default as CategoryData;

	const subCategories = await Promise.all(
		categoryData.subCategories.map(async (subCategory) => {
			const data = (
				await import(`@/_data/links/${category}/${subCategory}/links.json`)
			).default as SubCategoryData;
			return {
				...data,
				links: sortInitiativesByRank(data.links),
			};
		}),
	);

	return {
		...categoryData,
		id: category,
		subCategories,
	};
}

export async function getAssistanceSubCategory() {
	const data = (await import(`@/_data/links/GeneralAssistance/Main/links.json`))
		.default as unknown as SubCategoryData;
	return {
		...data,
		links: sortInitiativesByRank(data.links),
	};
}
