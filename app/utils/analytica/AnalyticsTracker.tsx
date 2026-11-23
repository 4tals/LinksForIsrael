"use client";

import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { useEffect, useRef } from "react";

import { analyticsService } from "@/app/utils/analytica/analytics";

/**
 * Lightweight SPA Pageview + AI Referrer + Core Web Vitals (RUM) tracker.
 * Runs cleanly with zero DOM output and zero main-thread blocking.
 */
export function AnalyticsTracker() {
	const pathname = usePathname();
	const lastTrackedPathRef = useRef<string | null>(null);

	useEffect(() => {
		if (!pathname) return;
		const search = typeof window !== "undefined" ? window.location.search : "";
		const key = `${pathname}${search}`;
		if (lastTrackedPathRef.current === key) return;
		lastTrackedPathRef.current = key;
		analyticsService.trackPageView(pathname, search);
	}, [pathname]);

	useReportWebVitals((metric) => {
		if (
			metric.name === "LCP" ||
			metric.name === "INP" ||
			metric.name === "CLS" ||
			metric.name === "FCP" ||
			metric.name === "TTFB"
		) {
			analyticsService.trackWebVital({
				name: metric.name,
				value: metric.value,
				rating: "rating" in metric ? String(metric.rating) : undefined,
				id: metric.id,
			});
		}
	});

	return null;
}
