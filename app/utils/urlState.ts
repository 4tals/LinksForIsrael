import { InitiativeIntent } from "./categories";

export const URL_CHANGE_EVENT = "linksforisrael:urlchange";

const VALID_INTENTS = new Set<InitiativeIntent>([
	"get-help",
	"volunteer",
	"donate",
]);

export interface UrlTrustFilters {
	verifiedOnly: boolean;
	taxDeductible46: boolean;
	hasReferences: boolean;
	hasPhone: boolean;
	intent: InitiativeIntent | null;
}

export function getUrlParams(): URLSearchParams {
	if (typeof window === "undefined") {
		return new URLSearchParams();
	}
	return new URLSearchParams(window.location.search);
}

export function updateUrlParams(
	patch: Record<string, string | null | undefined>,
	options?: { push?: boolean },
): void {
	if (typeof window === "undefined") return;

	const params = new URLSearchParams(window.location.search);
	for (const [key, value] of Object.entries(patch)) {
		if (value === null || value === undefined || value === "") {
			params.delete(key);
		} else {
			params.set(key, value);
		}
	}

	const queryString = params.toString();
	const nextUrl = `${window.location.pathname}${
		queryString ? `?${queryString}` : ""
	}${window.location.hash}`;
	const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

	if (nextUrl === currentUrl) return;

	if (options?.push) {
		window.history.pushState(null, "", nextUrl);
	} else {
		window.history.replaceState(null, "", nextUrl);
	}
	window.dispatchEvent(new Event(URL_CHANGE_EVENT));
}

export function parseIntentParam(
	value: string | null,
): InitiativeIntent | null {
	if (!value) return null;
	return VALID_INTENTS.has(value as InitiativeIntent)
		? (value as InitiativeIntent)
		: null;
}

export function parseTrustFiltersFromParams(
	params: URLSearchParams,
): UrlTrustFilters {
	return {
		verifiedOnly: params.get("verified") === "1",
		taxDeductible46: params.get("s46") === "1",
		hasReferences: params.get("refs") === "1",
		hasPhone: params.get("phone") === "1",
		intent: parseIntentParam(params.get("intent")),
	};
}

export function trustFiltersToUrlPatch(
	state: UrlTrustFilters,
	options?: { includeIntent?: boolean },
): Record<string, string | null> {
	const patch: Record<string, string | null> = {
		verified: state.verifiedOnly ? "1" : null,
		s46: state.taxDeductible46 ? "1" : null,
		refs: state.hasReferences ? "1" : null,
		phone: state.hasPhone ? "1" : null,
	};
	if (options?.includeIntent !== false) {
		patch.intent = state.intent || null;
	}
	return patch;
}

export function buildUrlWithCard(cardName: string): string {
	if (typeof window === "undefined") return "";
	const url = new URL(window.location.href);
	url.searchParams.set("card", cardName);
	return url.toString();
}
