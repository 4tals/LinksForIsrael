import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { analyticsService } from "@/app/utils/analytica/analytics";
import { Category, SubCategoryData } from "@/app/utils/categories";

import { mapStringToHebrew } from "./SearchHelpers";

function filterCategories(
	categories: Category[],
	generalAssistanceSubCategory: SubCategoryData,
	searchTerm: string,
): Category[] {
	const lowerSearchTerm = searchTerm.trim().toLowerCase();
	if (!lowerSearchTerm) return [];

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

	return allCategories
		.map((category) => {
			const categoryMatches =
				category.displayName?.toLowerCase().includes(lowerSearchTerm) ||
				category.name?.toLowerCase().includes(lowerSearchTerm);

			const filteredSubCategories = category.subCategories
				.map((subCategory) => {
					const filteredLinks = subCategory.links.filter(
						(link) =>
							categoryMatches ||
							link.name?.toLowerCase().includes(lowerSearchTerm) ||
							link.displayName?.toLowerCase().includes(lowerSearchTerm) ||
							link.description?.toLowerCase().includes(lowerSearchTerm) ||
							link.shortDescription?.toLowerCase().includes(lowerSearchTerm) ||
							link.tags?.some((tag) =>
								tag.toLowerCase().includes(lowerSearchTerm),
							),
					);

					return { ...subCategory, links: filteredLinks };
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
): { results: Category[]; mappedSearchTerm: string | null } {
	const trimmed = searchTerm.trim();
	if (!trimmed) {
		return { results: [], mappedSearchTerm: null };
	}

	const directResults = filterCategories(
		categories,
		generalAssistanceSubCategory,
		trimmed,
	);
	if (directResults.length > 0) {
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
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
	const analyticsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const { results, mappedSearchTerm } = useMemo(
		() => searchCategories(categories, generalAssistanceSubCategory, search),
		[categories, generalAssistanceSubCategory, search],
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
		onSearch: handleChangeSearch,
		results,
		totalResults,
		isMobileSearchOpen,
		toggleMobileSearch,
	} as const;
}
