"use client";

import { usePathname } from "next/navigation";
import React, { createContext, useCallback, useState } from "react";

import { BookmarksProvider } from "@/app/components/Bookmarks/BookmarksContext";
import { SavedListDrawer } from "@/app/components/Bookmarks/SavedListDrawer";
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
	const pathname = usePathname();
	const isEmbed = pathname?.startsWith("/embed");
	const {
		search,
		mappedSearchTerm,
		activeIntent,
		setActiveIntent,
		onSearch,
		results,
		totalResults,
		isMobileSearchOpen,
		toggleMobileSearch,
	} = useSearch(categories, generalAssistanceSubCategory);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = useCallback(() => {
		setIsMenuOpen((prevState) => !prevState);
	}, []);

	if (isEmbed) {
		return <main id="content">{children}</main>;
	}

	return (
		<BookmarksProvider>
			<SearchContext.Provider
				value={{
					search,
					mappedSearchTerm,
					activeIntent,
					setActiveIntent,
					results,
					totalResults,
					onSearch,
					isMobileSearchOpen,
					toggleMobileSearch,
				}}
			>
				<MenuContext.Provider value={{ isMenuOpen, toggleMenu, isMobile }}>
					<div className="app-shell">
						<a href="#content" className="skip-to-content">
							דלג לתוכן הראשי
						</a>
						<Header />
						<MobileSearchInput />
						<main
							id="content"
							className="main-content"
							role="main"
							tabIndex={-1}
						>
							{children}
						</main>
						<Footer />
						<SavedListDrawer />
					</div>
				</MenuContext.Provider>
			</SearchContext.Provider>
		</BookmarksProvider>
	);
}
