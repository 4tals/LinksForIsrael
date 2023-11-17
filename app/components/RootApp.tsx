"use client";

import { createContext, useCallback, useState } from "react";

import { MobileSearchInput } from "@/app/components/Search/MobileSearchInput";
import { useSearch } from "@/app/components/Search/useSearch";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { Category } from "@/app/utils/categories";

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
	children,
}: {
	categories: Category[];
	children: React.ReactNode;
}) {
	const isMobile = useIsMobile();
	const { search, onSearch, results, isMobileSearchOpen, toggleMobileSearch } =
		useSearch(categories);
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
				<main id="content" className="main-content" role="main">
					{children}
				</main>
			</MenuContext.Provider>
		</SearchContext.Provider>
	);
}
