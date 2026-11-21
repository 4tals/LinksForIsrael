"use client";

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

export interface SavedInitiative {
	name: string;
	displayName: string;
	shortDescription?: string;
	url: string | null;
	phone?: string;
	categoryId?: string;
	subCategoryName?: string;
}

interface BookmarksContextProps {
	savedItems: SavedInitiative[];
	isSaved: (name: string) => boolean;
	toggleSave: (item: SavedInitiative) => boolean;
	removeSaved: (name: string) => void;
	clearSaved: () => void;
	isDrawerOpen: boolean;
	openDrawer: () => void;
	closeDrawer: () => void;
}

const STORAGE_KEY = "linksforisrael_saved_v1";

const BookmarksContext = createContext<BookmarksContextProps>({
	savedItems: [],
	isSaved: () => false,
	toggleSave: () => false,
	removeSaved: () => {},
	clearSaved: () => {},
	isDrawerOpen: false,
	openDrawer: () => {},
	closeDrawer: () => {},
});

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
	const [savedItems, setSavedItems] = useState<SavedInitiative[]>([]);
	const [hydrated, setHydrated] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	useEffect(() => {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) {
					setSavedItems(parsed);
				}
			}
		} catch {
			// Ignore localStorage failures
		} finally {
			setHydrated(true);
		}
	}, []);

	useEffect(() => {
		if (!hydrated) return;
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
		} catch {
			// Ignore quota errors
		}
	}, [savedItems, hydrated]);

	const isSaved = useCallback(
		(name: string) => savedItems.some((item) => item.name === name),
		[savedItems],
	);

	const toggleSave = useCallback((item: SavedInitiative): boolean => {
		let added = false;
		setSavedItems((prev) => {
			const exists = prev.some((i) => i.name === item.name);
			if (exists) {
				added = false;
				return prev.filter((i) => i.name !== item.name);
			}
			added = true;
			return [item, ...prev];
		});
		return added;
	}, []);

	const removeSaved = useCallback((name: string) => {
		setSavedItems((prev) => prev.filter((i) => i.name !== name));
	}, []);

	const clearSaved = useCallback(() => {
		setSavedItems([]);
	}, []);

	const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
	const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

	return (
		<BookmarksContext.Provider
			value={{
				savedItems,
				isSaved,
				toggleSave,
				removeSaved,
				clearSaved,
				isDrawerOpen,
				openDrawer,
				closeDrawer,
			}}
		>
			{children}
		</BookmarksContext.Provider>
	);
}

export function useBookmarks() {
	return useContext(BookmarksContext);
}
