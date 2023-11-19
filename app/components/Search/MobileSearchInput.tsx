"use client";

import { useContext } from "react";

import { SearchContext } from "@/app/components/RootApp";
import { SearchInput } from "@/app/components/Search/SearchInput";

export function MobileSearchInput() {
	const { isMobileSearchOpen } = useContext(SearchContext);
	return (
		<div
			className={`mobile-search mobile-search-${
				isMobileSearchOpen ? "open" : "close"
			}`}
		>
			<SearchInput />
		</div>
	);
}
