"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistrar() {
	useEffect(() => {
		if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
			return;
		}
		if (
			window.location.hostname === "localhost" ||
			window.location.hostname === "127.0.0.1"
		) {
			return;
		}
		navigator.serviceWorker.register("/sw.js").catch(() => {
			// Ignore SW registration failures in restricted environments
		});
	}, []);

	return null;
}
