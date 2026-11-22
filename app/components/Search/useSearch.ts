import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { analyticsService } from "@/app/utils/analytica/analytics";
import {
	Category,
	getInitiativeIntents,
	InitiativeIntent,
	sortInitiativesByRank,
	SubCategoryData,
} from "@/app/utils/categories";
import { expandSearchSynonyms } from "@/app/utils/searchSynonyms";
import {
	getUrlParams,
	parseIntentParam,
	updateUrlParams,
} from "@/app/utils/urlState";

import { expandSearchTerms, mapStringToHebrew } from "./SearchHelpers";

function filterCategories(
	categories: Category[],
	generalAssistanceSubCategory: SubCategoryData,
	searchTerm: string,
	activeIntent: InitiativeIntent | null,
): Category[] {
	const baseTerms = expandSearchTerms(searchTerm);
	const synonymTerms = expandSearchSynonyms(searchTerm);
	const expandedTerms = Array.from(new Set([...baseTerms, ...synonymTerms]));
	if (expandedTerms.length === 0 && !activeIntent) return [];

	const hasGeneralAssistance = categories.some(
		(c) => c.id === "GeneralAssistance",
	);
	const allCategories = hasGeneralAssistance
		? categories
		: [
				...categories,
				{
					id: "GeneralAssistance",
					name: "GeneralAssistance",
					displayName: "התנדבות, זכויות וקהילה",
					longDisplayName: "התנדבות, זכויות וקהילה",
					description: "",
					image: "",
					subCategories: [generalAssistanceSubCategory],
				} satisfies Category,
			];

	const matchesAnyTerm = (haystack: string): boolean => {
		const lower = haystack.toLowerCase();
		return expandedTerms.some((term) => lower.includes(term));
	};

	return allCategories
		.map((category) => {
			const categoryMatches =
				expandedTerms.length > 0 &&
				matchesAnyTerm(`${category.displayName || ""} ${category.name || ""}`);

			const filteredSubCategories = category.subCategories
				.map((subCategory) => {
					const filteredLinks = subCategory.links.filter((link) => {
						if (activeIntent) {
							const intents = getInitiativeIntents(link, category.id);
							if (!intents.includes(activeIntent)) {
								return false;
							}
						}

						if (expandedTerms.length === 0) {
							return true;
						}

						if (categoryMatches) return true;

						const searchableText = [
							link.name,
							link.displayName,
							link.shortDescription,
							link.description,
							link.url,
							link.website,
							link.portal,
							link.phone,
							link.facebook,
							link.instagram,
							link.whatsapp,
							link.telegram,
							...(link.tags || []),
							...(link.references || []).map((r) => r.source || ""),
						]
							.filter(Boolean)
							.join(" ");

						return matchesAnyTerm(searchableText);
					});

					return {
						...subCategory,
						links: sortInitiativesByRank(filteredLinks),
					};
				})
				.filter((subCategory) => subCategory.links.length > 0);

			return { ...category, subCategories: filteredSubCategories };
		})
		.filter((category) => category.subCategories.length > 0);
}

function searchCategories(
	categories: Category[],
	generalAssistanceSubCategory: SubCategoryData,
	searchTerm: string,
	activeIntent: InitiativeIntent | null,
): { results: Category[]; mappedSearchTerm: string | null } {
	const trimmed = searchTerm.trim();
	if (!trimmed && !activeIntent) {
		return { results: [], mappedSearchTerm: null };
	}

	const directResults = filterCategories(
		categories,
		generalAssistanceSubCategory,
		trimmed,
		activeIntent,
	);
	if (directResults.length > 0 || !trimmed) {
		return { results: directResults, mappedSearchTerm: null };
	}

	const mapped = mapStringToHebrew(trimmed);
	if (!mapped) {
		return { results: [], mappedSearchTerm: null };
	}

	const mappedResults = filterCategories(
		categories,
		generalAssistanceSubCategory,
		mapped,
		activeIntent,
	);
	return {
		results: mappedResults,
		mappedSearchTerm: mappedResults.length > 0 ? mapped : null,
	};
}

export function useSearch(
	categories: Category[],
	generalAssistanceSubCategory: SubCategoryData,
) {
	const [search, setSearch] = useState("");
	const [activeIntent, setActiveIntentState] =
		useState<InitiativeIntent | null>(null);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
	const analyticsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const isPortalSearchPath = () => {
		if (typeof window === "undefined") return false;
		const p = window.location.pathname;
		return (
			!p.startsWith("/en") &&
			!p.startsWith("/ar") &&
			!p.startsWith("/ru") &&
			!p.startsWith("/embed") &&
			!p.startsWith("/print") &&
			!p.startsWith("/docs")
		);
	};

	// Hydrate global search & intent from URL query params (?q=...&intent=...)
	useEffect(() => {
		const syncFromUrl = () => {
			if (!isPortalSearchPath()) return;
			const params = getUrlParams();
			const urlQ = params.get("q") || "";
			const urlIntent = parseIntentParam(params.get("intent"));
			// Only hijack intent globally on the homepage (category pages own their local intent pill)
			const isHome = window.location.pathname === "/";
			setSearch(urlQ);
			if (isHome || urlQ) {
				setActiveIntentState(urlIntent);
			}
		};
		syncFromUrl();
		window.addEventListener("popstate", syncFromUrl);
		return () => window.removeEventListener("popstate", syncFromUrl);
	}, []);

	const setActiveIntent = useCallback((next: InitiativeIntent | null) => {
		setActiveIntentState(next);
		if (isPortalSearchPath()) {
			updateUrlParams({ intent: next || null });
		}
	}, []);

	const handleChangeSearch = useCallback((searchTerm: string) => {
		setSearch(searchTerm);
		if (isPortalSearchPath()) {
			updateUrlParams({ q: searchTerm.trim() ? searchTerm : null });
		}
	}, []);

	const { results, mappedSearchTerm } = useMemo(
		() =>
			searchCategories(
				categories,
				generalAssistanceSubCategory,
				search,
				activeIntent,
			),
		[categories, generalAssistanceSubCategory, search, activeIntent],
	);

	const totalResults = useMemo(
		() =>
			results.reduce(
				(catAcc, category) =>
					catAcc +
					category.subCategories.reduce(
						(subAcc, sub) => subAcc + sub.links.length,
						0,
					),
				0,
			),
		[results],
	);

	useEffect(() => {
		if (analyticsTimerRef.current) {
			clearTimeout(analyticsTimerRef.current);
		}
		const trimmed = search.trim();
		if (!trimmed) return;

		analyticsTimerRef.current = setTimeout(() => {
			analyticsService.trackSearch(
				trimmed,
				totalResults,
				Boolean(mappedSearchTerm),
			);
		}, 500);

		return () => {
			if (analyticsTimerRef.current) {
				clearTimeout(analyticsTimerRef.current);
			}
		};
	}, [search, totalResults, mappedSearchTerm]);

	const toggleMobileSearch = useCallback(() => {
		setIsMobileSearchOpen((prevState) => !prevState);
	}, []);

	return {
		search,
		mappedSearchTerm,
		activeIntent,
		setActiveIntent,
		onSearch: handleChangeSearch,
		results,
		totalResults,
		isMobileSearchOpen,
		toggleMobileSearch,
	} as const;
}
