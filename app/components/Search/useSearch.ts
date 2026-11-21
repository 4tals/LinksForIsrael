import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { analyticsService } from "@/app/utils/analytica/analytics";
import {
	Category,
	getInitiativeIntents,
	InitiativeIntent,
	sortInitiativesByRank,
	SubCategoryData,
} from "@/app/utils/categories";

import { expandSearchTerms, mapStringToHebrew } from "./SearchHelpers";

function filterCategories(
	categories: Category[],
	generalAssistanceSubCategory: SubCategoryData,
	searchTerm: string,
	activeIntent: InitiativeIntent | null,
): Category[] {
	const expandedTerms = expandSearchTerms(searchTerm);
	if (expandedTerms.length === 0 && !activeIntent) return [];

	const generalAssistanceCategory: Category = {
		id: "GeneralAssistance",
		name: "GeneralAssistance",
		displayName: "סיוע אזרחי כללי",
		longDisplayName: "סיוע אזרחי כללי",
		description: "",
		image: "",
		subCategories: [generalAssistanceSubCategory],
	};

	const allCategories = [...categories, generalAssistanceCategory];

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
							...(link.tags || []),
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
	const [activeIntent, setActiveIntent] = useState<InitiativeIntent | null>(
		null,
	);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
	const analyticsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

	const handleChangeSearch = useCallback((searchTerm: string) => {
		setSearch(searchTerm);
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
