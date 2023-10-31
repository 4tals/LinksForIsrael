import mixpanel from "mixpanel-browser";

export const analyticsService = {
	trackSearch: (
		searchTerm: string,
		resultsCount: number,
		usedHebrewMapping: boolean,
	) => {
		if (window.location.hostname.includes("localhost")) return;

		mixpanel.track("Search", {
			searchTerm,
			resultsCount,
			usedHebrewMapping,
		});

		// Google Analytics event tracking
		window.gtag &&
			window.gtag("event", "search", {
				event_category: "Search",
				event_label: searchTerm,
				value: resultsCount,
			});
	},
	trackCategoryView: (categoryId: string) => {
		if (window.location.hostname.includes("localhost")) return;

		mixpanel.track("Category Viewed", {
			categoryId,
		});

		// Google Analytics event tracking
		window.gtag &&
			window.gtag("event", "view_category", {
				event_category: "Category",
				event_label: categoryId,
			});
	},
};
