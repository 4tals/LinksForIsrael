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
	},
	trackCategoryView: (categoryId: string) => {
		if (window.location.hostname.includes("localhost")) return;

		mixpanel.track("Category Viewed", {
			categoryId,
		});
	},
};
