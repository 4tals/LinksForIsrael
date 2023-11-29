"use client";

import React, { createContext, useCallback, useState } from "react";

import { MobileSearchInput } from "@/app/components/Search/MobileSearchInput";
import { useSearch } from "@/app/components/Search/useSearch";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { Category, SubCategoryData } from "@/app/utils/categories";

import { Footer } from "./Footer";
import { Header } from "./Header/Header";
import { MenuContextProps, initialMenuContext } from "./RootAppConsts";
import {
	SearchContextProps,
	initialSearchContext,
} from "./Search/SearchConsts";

export const SearchContext =
	createContext<SearchContextProps>(initialSearchContext);
export const MenuContext = createContext<MenuContextProps>(initialMenuContext);

export function RootApp({
	categories,
	generalAssistanceSubCategory,
	children,
}: {
	categories: Category[];
	generalAssistanceSubCategory: SubCategoryData;
	children: React.ReactNode;
}) {
	const isMobile = useIsMobile();
	const { search, onSearch, results, isMobileSearchOpen, toggleMobileSearch } =
		useSearch(categories, generalAssistanceSubCategory);
	const [isMenuOpen, setIsMenuOpen] = useState(!isMobile);

	const toggleMenu = useCallback(() => {
		setIsMenuOpen((prevState) => !prevState);
	}, []);

	return (
		<SearchContext.Provider
			value={{
				search,
				results,
				onSearch,
				isMobileSearchOpen,
				toggleMobileSearch,
			}}
		>
			<MenuContext.Provider value={{ isMenuOpen, toggleMenu, isMobile }}>
				<Header />
				<MobileSearchInput />
				{children}
				<Footer />
			</MenuContext.Provider>
		</SearchContext.Provider>
	);
}
