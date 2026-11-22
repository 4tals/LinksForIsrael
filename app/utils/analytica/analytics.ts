type MixpanelModule = typeof import("mixpanel-browser").default;

let mixpanelInstance: MixpanelModule | null = null;
let mixpanelLoading: Promise<MixpanelModule | null> | null = null;

function isLocalhost(): boolean {
	if (typeof window === "undefined") return true;
	return (
		window.location.hostname.includes("localhost") ||
		window.location.hostname === "127.0.0.1"
	);
}

async function getMixpanel(): Promise<MixpanelModule | null> {
	if (typeof window === "undefined" || isLocalhost()) return null;
	const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
	if (!token) return null;
	if (mixpanelInstance) return mixpanelInstance;

	if (!mixpanelLoading) {
		mixpanelLoading = import("mixpanel-browser")
			.then((mod) => {
				const mp = mod.default;
				mp.init(token);
				mixpanelInstance = mp;
				return mp;
			})
			.catch(() => null);
	}
	return mixpanelLoading;
}

function trackMixpanel(event: string, props: Record<string, unknown>) {
	void getMixpanel().then((mp) => {
		if (!mp) return;
		try {
			mp.track(event, props);
		} catch {
			// Ignore analytics failures
		}
	});
}

export const analyticsService = {
	trackSearch: (
		searchTerm: string,
		resultsCount: number,
		usedHebrewMapping: boolean,
	) => {
		if (isLocalhost() || !searchTerm.trim()) return;

		trackMixpanel("Search", {
			searchTerm,
			resultsCount,
			usedHebrewMapping,
		});

		window.gtag?.("event", "search", {
			event_category: "Search",
			event_label: searchTerm,
			value: resultsCount,
		});
	},
	trackCategoryView: (categoryId: string) => {
		if (isLocalhost()) return;

		trackMixpanel("Category Viewed", { categoryId });

		window.gtag?.("event", "view_category", {
			event_category: "Category",
			event_label: categoryId,
		});
	},
	trackInitiativeClick: (initiativeName: string, url: string) => {
		if (isLocalhost()) return;

		trackMixpanel("Initiative Clicked", { initiativeName, url });

		window.gtag?.("event", "initiative_click", {
			event_category: "Initiative",
			event_label: initiativeName,
		});
	},
};
