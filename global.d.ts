interface Window {
	gtag: typeof gtag;
}

declare const gtag: (
	type: "config" | "event",
	googleAnalyticsKey: string,
	config?: any,
) => void;
