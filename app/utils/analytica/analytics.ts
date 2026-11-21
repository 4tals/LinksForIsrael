import mixpanel from "mixpanel-browser";

let mixpanelInitialized = false;

function ensureMixpanel(): boolean {
	if (typeof window === "undefined") return false;
	if (mixpanelInitialized) return true;

	const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
	if (!token) return false;

	try {
		mixpanel.init(token);
		mixpanelInitialized = true;
		return true;
	} catch {
		return false;
	}
}

function isLocalhost(): boolean {
	if (typeof window === "undefined") return true;
	return (
		window.location.hostname.includes("localhost") ||
		window.location.hostname === "127.0.0.1"
	);
}

export const analyticsService = {
	trackSearch: (
		searchTerm: string,
		resultsCount: number,
		usedHebrewMapping: boolean,
	) => {
		if (isLocalhost() || !searchTerm.trim()) return;

		if (ensureMixpanel()) {
			try {
				mixpanel.track("Search", {
					searchTerm,
					resultsCount,
					usedHebrewMapping,
				});
			} catch {
				// Ignore analytics failures
			}
		}

		window.gtag?.("event", "search", {
			event_category: "Search",
			event_label: searchTerm,
			value: resultsCount,
		});
	},
	trackCategoryView: (categoryId: string) => {
		if (isLocalhost()) return;

		if (ensureMixpanel()) {
			try {
				mixpanel.track("Category Viewed", {
					categoryId,
				});
			} catch {
				// Ignore analytics failures
			}
		}

		window.gtag?.("event", "view_category", {
			event_category: "Category",
			event_label: categoryId,
		});
	},
	trackInitiativeClick: (initiativeName: string, url: string) => {
		if (isLocalhost()) return;

		if (ensureMixpanel()) {
			try {
				mixpanel.track("Initiative Clicked", {
					initiativeName,
					url,
				});
			} catch {
				// Ignore analytics failures
			}
		}

		window.gtag?.("event", "initiative_click", {
			event_category: "Initiative",
			event_label: initiativeName,
		});
	},
};
