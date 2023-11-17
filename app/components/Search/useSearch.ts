import { useCallback, useState } from "react";

import { analyticsService } from "@/app/utils/analytica/analytics";
import { Category, Link, SubCategoryData } from "@/app/utils/categories";

import { mapStringToHebrew } from "./SearchHelpers";

function filterCategories(
	categories: Category[],
	searchTerm: string,
): Category[] {
	const filteredCategories: Category[] = [];
	categories.forEach((category) => {
		const filteredSubCategories = category.subCategories
			.map((subCategory) => {
				const filteredLinks: Link[] = subCategory.links.filter((link) => {
					const lowerSearchTerm = searchTerm.toLowerCase();
					return (
						link.name?.toLowerCase().includes(lowerSearchTerm) ||
						link.displayName?.toLowerCase().includes(lowerSearchTerm) ||
						link.description?.toLowerCase().includes(lowerSearchTerm) ||
						link.shortDescription?.toLowerCase().includes(lowerSearchTerm) ||
						link.tags?.some((tag) =>
							tag.toLowerCase().includes(lowerSearchTerm),
						)
					);
				});

				return { ...subCategory, links: filteredLinks };
			})
			.filter((subCategory) => subCategory.links.length > 0);

		if (filteredSubCategories.length > 0) {
			filteredCategories.push({
				...category,
				subCategories: filteredSubCategories,
			});
		}
	});

	return filteredCategories;
}

function getResults(
	categories: Category[],
	generalAssistanceSubCategory: SubCategoryData,
	searchTerm: string,
) {
	if (!searchTerm) {
		return [];
	}
	const results = filterCategories(categories, searchTerm);
	if (results.length !== 0) {
		return results;
	}

	const mappedSearchTerm = mapStringToHebrew(searchTerm);
	if (!mappedSearchTerm) {
		return [];
	}

	return filterCategories(categories, mappedSearchTerm);
}

export function useSearch(
	categories: Category[],
	generalAssistanceSubCategory: SubCategoryData,
) {
	const [search, setSearch] = useState("");
	const [displaySearchResults, setDisplaySearchResults] = useState<Category[]>(
		[],
	);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

	const toggleMobileSearch = useCallback(() => {
		setIsMobileSearchOpen((prevState) => !prevState);
	}, [setIsMobileSearchOpen]);

	function handleChangeSearch(searchTerm: string) {
		setSearch(searchTerm);

		let results = getResults(
			categories,
			generalAssistanceSubCategory,
			searchTerm,
		);
		setDisplaySearchResults(results);

		let usedHebrewMapping = false;

		if (results.length === 0) {
			const mappedSearchTerm = mapStringToHebrew(searchTerm);
			if (mappedSearchTerm) {
				usedHebrewMapping = true;
				results = getResults(
					categories,
					generalAssistanceSubCategory,
					mappedSearchTerm,
				);
				setDisplaySearchResults(results);
			}
		}

		analyticsService.trackSearch(searchTerm, results.length, usedHebrewMapping);
	}

	return {
		search,
		onSearch: handleChangeSearch,
		results: displaySearchResults,
		isMobileSearchOpen,
		toggleMobileSearch,
	} as const;
}
