import type { MetadataRoute } from "next";

import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/app/utils/seo";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: `${SITE_NAME} – פורטל יוזמות`,
		short_name: SITE_NAME,
		description: DEFAULT_DESCRIPTION,
		start_url: "/",
		display: "standalone",
		background_color: "#f8fafc",
		theme_color: "#0038b8",
		lang: "he",
		dir: "rtl",
		icons: [
			{
				src: "/favIcon.png",
				sizes: "48x48",
				type: "image/png",
			},
			{
				src: "/icon-192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icon-512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
