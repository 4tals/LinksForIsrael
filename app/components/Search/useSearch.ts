import { useCallback, useState } from "react";

import { analyticsService } from "@/app/utils/analytica/analytics";
import {
	Category,
	InitiativeLink,
	SubCategoryData,
} from "@/app/utils/categories";

import { mapStringToHebrew } from "./SearchHelpers";

function filterCategories(
	categories: Category[],
	generalAssistanceSubCategory: SubCategoryData,
	searchTerm: string,
): Category[] {
	const lowerSearchTerm = searchTerm.toLowerCase();

	// Create a mock category for generalAssistanceSubCategory
	const generalAssistanceCategory: Category = {
		id: "",
		name: "",
		displayName: "סיוע אזרחי כללי",
		longDisplayName: "",
		description: "",
		image: "", // Provide a default image or leave it empty
		subCategories: [generalAssistanceSubCategory],
	};

	const allCategories = [...categories, generalAssistanceCategory];

	const filteredCategories: Category[] = allCategories
		.map((category) => {
			const filteredSubCategories = category.subCategories
				.map((subCategory) => {
					const filteredLinks = subCategory.links.filter(
						(link) =>
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
	const results = filterCategories(
		categories,
		generalAssistanceSubCategory,
		searchTerm,
	);
	if (results.length !== 0) {
		return results;
	}

	const mappedSearchTerm = mapStringToHebrew(searchTerm);
	if (!mappedSearchTerm) {
		return [];
	}

	return filterCategories(
		categories,
		generalAssistanceSubCategory,
		mappedSearchTerm,
	);
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
