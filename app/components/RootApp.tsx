"use client";

import React, {
	createContext,
	useCallback,
	useState,
	useRef,
	TouchEvent,
} from "react";

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

	const contentRef = useRef<HTMLDivElement>(null);
	let startY = 0;
	let endY = 0;

	const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
		startY = e.touches[0].clientY;
	};

	const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
		endY = e.touches[0].clientY;
	};

	const onTouchEnd = () => {
		if (startY < endY && Math.abs(startY - endY) > 50) {
			console.log("Refresh triggered");
			window.location.reload(); // Refreshes the page
		}
	};

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
				<main
					id="content"
					className="main-content"
					role="main"
					ref={contentRef}
					onTouchStart={onTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={onTouchEnd}
				>
					{children}
				</main>
				<Footer />
			</MenuContext.Provider>
		</SearchContext.Provider>
	);
}
