"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { createContext, useCallback, useEffect, useState } from "react";

import { BookmarksProvider } from "@/app/components/Bookmarks/BookmarksContext";
import { SharedListBanner } from "@/app/components/Bookmarks/SharedListBanner";
import { ServiceWorkerRegistrar } from "@/app/components/Pwa/ServiceWorkerRegistrar";
import { MobileSearchInput } from "@/app/components/Search/MobileSearchInput";
import { useSearch } from "@/app/components/Search/useSearch";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { AnalyticsTracker } from "@/app/utils/analytica/AnalyticsTracker";
import { analyticsService } from "@/app/utils/analytica/analytics";
import { Category, SubCategoryData } from "@/app/utils/categories";
import {
	getUrlParams,
	updateUrlParams,
	URL_CHANGE_EVENT,
} from "@/app/utils/urlState";

import { Footer } from "./Footer";
import { Header } from "./Header/Header";
import { MenuContextProps, initialMenuContext } from "./RootAppConsts";
import {
	SearchContextProps,
	initialSearchContext,
} from "./Search/SearchConsts";

const SavedListDrawer = dynamic(
	() =>
		import("@/app/components/Bookmarks/SavedListDrawer").then(
			(m) => m.SavedListDrawer,
		),
	{ ssr: false },
);

const CommandPalette = dynamic(
	() =>
		import("@/app/components/CommandPalette/CommandPalette").then(
			(m) => m.CommandPalette,
		),
	{ ssr: false },
);

const HelperWizardModal = dynamic(
	() =>
		import("@/app/components/HelperWizard/HelperWizardModal").then(
			(m) => m.HelperWizardModal,
		),
	{ ssr: false },
);

const EmergencyModeOverlay = dynamic(
	() =>
		import("@/app/components/Emergency/EmergencyModeOverlay").then(
			(m) => m.EmergencyModeOverlay,
		),
	{ ssr: false },
);

export const SearchContext =
	createContext<SearchContextProps>(initialSearchContext);
export const MenuContext = createContext<MenuContextProps>(initialMenuContext);

export interface AppToolsContextProps {
	openCommandPalette: () => void;
	openHelperWizard: () => void;
	openEmergencyMode: () => void;
}

export const AppToolsContext = createContext<AppToolsContextProps>({
	openCommandPalette: () => {},
	openHelperWizard: () => {},
	openEmergencyMode: () => {},
});

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
	const isChromeFree =
		pathname?.startsWith("/embed") || pathname?.startsWith("/print");

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
	const [isPaletteOpen, setIsPaletteOpen] = useState(false);
	const [isHelperOpen, setIsHelperOpen] = useState(false);
	const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

	const toggleMenu = useCallback(() => {
		setIsMenuOpen((prevState) => !prevState);
	}, []);

	const openCommandPalette = useCallback(() => {
		setIsPaletteOpen(true);
		analyticsService.trackToolUsed("command_palette");
	}, []);
	const openHelperWizard = useCallback(() => {
		setIsHelperOpen(true);
		updateUrlParams({ helper: "1" });
		analyticsService.trackToolUsed("helper_wizard");
	}, []);
	const openEmergencyMode = useCallback(() => {
		setIsEmergencyOpen(true);
		updateUrlParams({ emergency: "1" });
		analyticsService.trackToolUsed("emergency_mode");
	}, []);

	// Hydrate ?helper=1 and ?emergency=1 from URL query strings
	useEffect(() => {
		const sync = () => {
			const params = getUrlParams();
			if (params.get("helper") === "1") setIsHelperOpen(true);
			if (params.get("emergency") === "1") setIsEmergencyOpen(true);
		};
		sync();
		window.addEventListener("popstate", sync);
		window.addEventListener(URL_CHANGE_EVENT, sync);
		return () => {
			window.removeEventListener("popstate", sync);
			window.removeEventListener(URL_CHANGE_EVENT, sync);
		};
	}, []);

	// Global Cmd/Ctrl+K or "/" Spotlight Command Palette shortcut
	useEffect(() => {
		if (isChromeFree) return;
		const onKeyDown = (e: KeyboardEvent) => {
			const tag = (e.target as HTMLElement | null)?.tagName;
			const isTyping =
				tag === "INPUT" ||
				tag === "TEXTAREA" ||
				(e.target as HTMLElement | null)?.isContentEditable;
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setIsPaletteOpen((prev) => !prev);
			} else if (e.key === "/" && !isTyping) {
				e.preventDefault();
				setIsPaletteOpen(true);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isChromeFree]);

	if (isChromeFree) {
		return (
			<>
				<AnalyticsTracker />
				<ServiceWorkerRegistrar />
				<main id="content">{children}</main>
			</>
		);
	}

	return (
		<BookmarksProvider>
			<AppToolsContext.Provider
				value={{ openCommandPalette, openHelperWizard, openEmergencyMode }}
			>
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
						<AnalyticsTracker />
						<ServiceWorkerRegistrar />
						<div className="app-shell">
							<a href="#content" className="skip-to-content">
								דלג לתוכן הראשי
							</a>
							<Header />
							<MobileSearchInput />
							<SharedListBanner categories={categories} />
							<main id="content" className="main-content" tabIndex={-1}>
								{children}
							</main>
							<Footer />
							<SavedListDrawer />
							{isPaletteOpen && (
								<CommandPalette
									isOpen={isPaletteOpen}
									onClose={() => setIsPaletteOpen(false)}
									categories={categories}
									onOpenHelper={openHelperWizard}
									onOpenEmergency={openEmergencyMode}
								/>
							)}
							{isHelperOpen && (
								<HelperWizardModal
									isOpen={isHelperOpen}
									onClose={() => setIsHelperOpen(false)}
									categories={categories}
								/>
							)}
							{isEmergencyOpen && (
								<EmergencyModeOverlay
									isOpen={isEmergencyOpen}
									onClose={() => setIsEmergencyOpen(false)}
								/>
							)}
						</div>
					</MenuContext.Provider>
				</SearchContext.Provider>
			</AppToolsContext.Provider>
		</BookmarksProvider>
	);
}
