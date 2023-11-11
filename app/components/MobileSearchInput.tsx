"use client";

import { useContext } from "react";

import { SearchInput } from "@/app/components/Header/SearchInput";
import { SearchContext } from "@/app/components/RootApp";

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
