import { useCallback, useState } from "react";

import { analyticsService } from "@/app/utils/analytica/analytics";
import { Category, Link } from "@/app/utils/categories";

import { mapStringToHebrew } from "./SearchHelpers";

export function useSearch(categories: Category[]) {
	const [search, setSearch] = useState("");
	const [displaySearchResults, setDisplaySearchResults] = useState<Category[]>(
		[],
	);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

	const toggleMobileSearch = useCallback(() => {
		setIsMobileSearchOpen((prevState) => !prevState);
	}, [setIsMobileSearchOpen]);

	function filterCategories(searchTerm: string): Category[] {
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

	function handleChangeSearch(searchTerm: string) {
		setSearch(searchTerm);
		const results = getResults(searchTerm);
		setDisplaySearchResults(results);

		let usedHebrewMapping = false;
		if (results.length === 0) {
			const mappedSearchTerm = mapStringToHebrew(searchTerm);
			if (mappedSearchTerm) {
				usedHebrewMapping = true;
				setDisplaySearchResults(getResults(mappedSearchTerm));
			}
		}

		analyticsService.trackSearch(searchTerm, results.length, usedHebrewMapping);

		function getResults(searchTerm: string) {
			if (!searchTerm) {
				return [];
			}
			const results = filterCategories(searchTerm);
			if (results.length !== 0) {
				return results;
			}

			const mappedSearchTerm = mapStringToHebrew(searchTerm);
			if (!mappedSearchTerm) {
				return [];
			}

			return filterCategories(mappedSearchTerm);
		}
	}

	return {
		search,
		onSearch: handleChangeSearch,
		results: displaySearchResults,
		isMobileSearchOpen,
		toggleMobileSearch,
	} as const;
}
