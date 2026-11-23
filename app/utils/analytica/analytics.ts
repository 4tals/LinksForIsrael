import type { OrganizationType } from "@/app/utils/categories";

const AI_REFERRER_HOSTS: Array<{ match: string; name: string }> = [
	{ match: "chatgpt.com", name: "chatgpt" },
	{ match: "chat.openai.com", name: "chatgpt" },
	{ match: "perplexity.ai", name: "perplexity" },
	{ match: "claude.ai", name: "claude" },
	{ match: "gemini.google.com", name: "gemini" },
	{ match: "copilot.microsoft.com", name: "copilot" },
	{ match: "grok.com", name: "grok" },
	{ match: "you.com", name: "you" },
	{ match: "phind.com", name: "phind" },
];

const SKIP_UTM_HOSTS = new Set([
	"wa.me",
	"api.whatsapp.com",
	"chat.whatsapp.com",
	"t.me",
	"bit.ly",
	"rebrand.ly",
	"linktr.ee",
]);

function isLocalhost(): boolean {
	if (typeof window === "undefined") return true;
	const host = window.location.hostname;
	return host.includes("localhost") || host === "127.0.0.1";
}

function getLocaleFromPath(pathname?: string): "he" | "en" {
	const p =
		pathname ??
		(typeof window !== "undefined" ? window.location.pathname : "/");
	return p === "/en" || p.startsWith("/en/") ? "en" : "he";
}

function extractDomain(url?: string | null): string | undefined {
	if (!url) return undefined;
	try {
		return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
	} catch {
		return undefined;
	}
}

export function detectAiSource(): {
	aiSource?: string;
	referrerDomain?: string;
} {
	if (typeof window === "undefined") return {};
	try {
		const params = new URLSearchParams(window.location.search);
		const utmSource = (params.get("utm_source") || "").toLowerCase();
		for (const entry of AI_REFERRER_HOSTS) {
			if (utmSource.includes(entry.name)) {
				return {
					aiSource: entry.name,
					referrerDomain: extractDomain(document.referrer),
				};
			}
		}
		const refDomain = extractDomain(document.referrer);
		if (refDomain) {
			for (const entry of AI_REFERRER_HOSTS) {
				if (
					refDomain === entry.match ||
					refDomain.endsWith(`.${entry.match}`)
				) {
					return { aiSource: entry.name, referrerDomain: refDomain };
				}
			}
			if (refDomain !== "linksforisrael.com") {
				return { referrerDomain: refDomain };
			}
		}
	} catch {
		// Ignore URL parse errors
	}
	return {};
}

export function classifyPageType(pathname: string): {
	pageType: string;
	categoryId?: string;
} {
	if (pathname === "/" || pathname === "") return { pageType: "home" };
	if (pathname === "/en" || pathname.startsWith("/en/")) {
		return { pageType: "english_portal" };
	}
	if (pathname.startsWith("/docs/")) return { pageType: "guide" };
	if (pathname.startsWith("/print")) return { pageType: "print" };
	if (pathname.startsWith("/embed")) return { pageType: "embed" };

	const segments = pathname.split("/").filter(Boolean);
	if (segments.length === 1) {
		return {
			pageType: "category",
			categoryId: decodeURIComponent(segments[0]),
		};
	}
	if (segments.length === 2) {
		return {
			pageType: "subcategory",
			categoryId: decodeURIComponent(segments[0]),
		};
	}
	return {
		pageType: "listing_detail",
		categoryId: segments[0] ? decodeURIComponent(segments[0]) : undefined,
	};
}

/**
 * Appends clean UTM referral parameters (`utm_source=linksforisrael&utm_medium=directory`)
 * to outbound HTTP(S) website links so partners (Adesco, NGOs, Jewish orgs) can see
 * referral attribution in their analytics. Skips gov.il, messaging apps, tel:/mailto:, and pre-tagged URLs.
 */
export function buildAttributedUrl(url: string): string {
	if (!url || !/^https?:\/\//i.test(url)) return url;
	try {
		const parsed = new URL(url);
		const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
		if (
			host === "linksforisrael.com" ||
			host.endsWith(".gov.il") ||
			host === "gov.il" ||
			SKIP_UTM_HOSTS.has(host) ||
			parsed.searchParams.has("utm_source")
		) {
			return url;
		}
		parsed.searchParams.set("utm_source", "linksforisrael");
		parsed.searchParams.set("utm_medium", "directory");
		return parsed.toString();
	} catch {
		return url;
	}
}

function sendGtag(eventName: string, params: Record<string, unknown>) {
	if (typeof window === "undefined" || isLocalhost()) return;
	try {
		const win = window as Window & {
			dataLayer?: unknown[];
			gtag?: (...args: unknown[]) => void;
		};
		if (!win.dataLayer) win.dataLayer = [];
		if (typeof win.gtag !== "function") {
			win.gtag = function gtagProxy(...args: unknown[]) {
				win.dataLayer?.push(args);
			};
		}
		win.gtag("event", eventName, {
			transport_type: "beacon",
			...params,
		});
	} catch {
		// Ignore analytics failures
	}
}

function emitEvent(gaEvent: string, props: Record<string, unknown>) {
	if (typeof window === "undefined" || isLocalhost()) return;
	const cleaned: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(props)) {
		if (v !== undefined && v !== null && v !== "") {
			cleaned[k] = v;
		}
	}
	if (!cleaned.locale) {
		cleaned.locale = getLocaleFromPath();
	}
	sendGtag(gaEvent, cleaned);
}

export interface ListingTrackMeta {
	categoryId?: string;
	organizationType?: OrganizationType | string;
	locale?: "he" | "en";
	clickSource?: string;
}

export const analyticsService = {
	trackPageView: (pathname: string, search?: string) => {
		if (typeof window === "undefined" || isLocalhost()) return;
		const locale = getLocaleFromPath(pathname);
		const { pageType, categoryId } = classifyPageType(pathname);
		const { aiSource, referrerDomain } = detectAiSource();
		const pagePath = search ? `${pathname}${search}` : pathname;

		emitEvent("page_view", {
			page_path: pagePath,
			page_location: window.location.href,
			page_title: document.title,
			page_type: pageType,
			category_id: categoryId,
			locale,
			ai_source: aiSource,
			referrer_domain: referrerDomain,
		});
	},

	trackSearch: (
		searchTerm: string,
		resultsCount: number,
		usedHebrewMapping: boolean,
		locale?: "he" | "en",
	) => {
		const trimmed = searchTerm.trim();
		if (isLocalhost() || !trimmed) return;

		emitEvent("search", {
			search_term: trimmed,
			results_count: resultsCount,
			zero_results: resultsCount === 0,
			used_hebrew_mapping: usedHebrewMapping,
			locale: locale || getLocaleFromPath(),
		});
	},

	trackCategoryView: (categoryId: string, locale?: "he" | "en") => {
		emitEvent("view_category", {
			category_id: categoryId,
			locale: locale || getLocaleFromPath(),
		});
	},

	trackListingOpen: (listingId: string, meta?: ListingTrackMeta) => {
		emitEvent("listing_open", {
			listing_id: listingId,
			category_id: meta?.categoryId,
			organization_type: meta?.organizationType,
			click_source: meta?.clickSource || "card",
			locale: meta?.locale || getLocaleFromPath(),
		});
	},

	trackInitiativeClick: (
		initiativeName: string,
		url: string,
		meta?: ListingTrackMeta,
	) => {
		const destinationDomain = extractDomain(url);
		emitEvent("outbound_click", {
			listing_id: initiativeName,
			outbound_url: url,
			destination_domain: destinationDomain,
			category_id: meta?.categoryId,
			organization_type: meta?.organizationType,
			click_source: meta?.clickSource || "card",
			locale: meta?.locale || getLocaleFromPath(),
		});
	},

	trackContactChannel: (params: {
		listingId: string;
		channel: string;
		url: string;
		organizationType?: OrganizationType | string;
		locale?: "he" | "en";
	}) => {
		emitEvent("contact_channel_click", {
			listing_id: params.listingId,
			channel: params.channel,
			destination_domain: extractDomain(params.url),
			organization_type: params.organizationType,
			locale: params.locale || getLocaleFromPath(),
		});
	},

	trackHotlineTap: (
		hotlineName: string,
		phoneNumber: string,
		source: string,
		locale?: "he" | "en",
	) => {
		emitEvent("hotline_tap", {
			hotline_name: hotlineName,
			phone_number: phoneNumber,
			click_source: source,
			locale: locale || getLocaleFromPath(),
		});
	},

	trackFilterChange: (
		filterName: string,
		filterValue: string | boolean,
		locale?: "he" | "en",
		categoryId?: string,
	) => {
		emitEvent("filter_applied", {
			filter_name: filterName,
			filter_value: String(filterValue),
			category_id: categoryId,
			locale: locale || getLocaleFromPath(),
		});
	},

	trackPathwayClick: (
		pathwayId: string,
		href: string,
		locale?: "he" | "en",
	) => {
		emitEvent("pathway_click", {
			pathway_id: pathwayId,
			destination_path: href,
			locale: locale || getLocaleFromPath(),
		});
	},

	trackGuideClick: (href: string, title: string, locale?: "he" | "en") => {
		emitEvent("guide_click", {
			guide_path: href,
			guide_title: title,
			locale: locale || getLocaleFromPath(),
		});
	},

	trackLanguageSwitch: (fromLocale: "he" | "en", toLocale: "he" | "en") => {
		emitEvent("language_switch", {
			from_locale: fromLocale,
			to_locale: toLocale,
			locale: toLocale,
		});
	},

	trackToolUsed: (tool: string, detail?: string, locale?: "he" | "en") => {
		emitEvent("tool_used", {
			tool_name: tool,
			tool_detail: detail,
			locale: locale || getLocaleFromPath(),
		});
	},

	trackWebVital: (metric: {
		name: string;
		value: number;
		rating?: string;
		id: string;
	}) => {
		if (typeof window === "undefined" || isLocalhost()) return;
		sendGtag("web_vital", {
			metric_name: metric.name,
			metric_value: Math.round(
				metric.name === "CLS" ? metric.value * 1000 : metric.value,
			),
			metric_rating: metric.rating,
			metric_id: metric.id,
			locale: getLocaleFromPath(),
			non_interaction: true,
		});
	},
};
