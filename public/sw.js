// Links For Israel — Offline-First Emergency PWA Service Worker
// Caches core routes, hotlines, and open civic data so the portal remains usable even offline (e.g. inside a safe room / ממ״ד).

const CACHE_NAME = "linksforisrael-v1";
const PRECACHE_URLS = [
	"/",
	"/en",
	"/ar",
	"/ru",
	"/embed/hotlines",
	"/print",
	"/manifest.webmanifest",
	"/api/v1/initiatives.json",
	"/icon-192.png",
	"/favIcon.png",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) =>
				Promise.allSettled(
					PRECACHE_URLS.map((url) =>
						cache.add(new Request(url, { cache: "reload" })),
					),
				),
			)
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => key !== CACHE_NAME)
						.map((key) => caches.delete(key)),
				),
			)
			.then(() => self.clients.claim()),
	);
});

self.addEventListener("fetch", (event) => {
	const { request } = event;
	if (request.method !== "GET") return;

	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;

	// Network-first for HTML & JSON data with seamless offline cache fallback
	if (
		request.mode === "navigate" ||
		url.pathname.startsWith("/api/v1/")
	) {
		event.respondWith(
			fetch(request)
				.then((response) => {
					if (response && response.ok) {
						const copy = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
					}
					return response;
				})
				.catch(() =>
					caches
						.match(request)
						.then((cached) => cached || caches.match("/")),
				),
		);
		return;
	}

	// Stale-while-revalidate for static assets
	event.respondWith(
		caches.match(request).then((cached) => {
			const networkFetch = fetch(request)
				.then((response) => {
					if (response && response.ok) {
						const copy = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
					}
					return response;
				})
				.catch(() => cached);
			return cached || networkFetch;
		}),
	);
});
