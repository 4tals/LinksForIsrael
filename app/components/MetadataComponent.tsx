import Head from "next/head";
import React from "react";

export function MetaDataComponent() {
	const metadata = {
		title: "לינק לישראל – פורטל יוזמות - חרבות הברזל!",
		description:
			"אם אתם מחפשים איך לעזור או צריכים עזרה או מידע – זה המקום. לינק לישראל מרכז את כל המשאבים האלה במקום אחד, במטרה שכל אחד ואחת יוכלו למצוא או לתת את הסיוע הנכון עבורם - פרויקט קוד פתוח.",
		viewport: "width=device-width, initial-scale=1",
		appleWebApp: {
			statusBarStyle: "black-translucent",
		},
		openGraph: {
			url: "https://www.linksforisrael.com",
			title: "לינק לישראל – פורטל יוזמות - חרבות הברזל!",
			description:
				"אם אתם מחפשים איך לעזור או צריכים עזרה או מידע – זה המקום. לינק לישראל מרכז את כל המשאבים והיוזמות במקום אחד.",
			images:
				"https://res.cloudinary.com/dargbitr2/image/upload/v1697311977/LinksForIsrael/jix5eizmqcegmfra89gs.jpg",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			site: "@linksforisrael",
			creator: "@PortalIdan",
			title: "לינק לישראל – פורטל יוזמות - חרבות הברזל!",
			description:
				"אם אתם מחפשים איך לעזור או צריכים עזרה או מידע – זה המקום. לינק לישראל מרכז את כל המשאבים והיוזמות במקום אחד.",
			images: [
				"https://res.cloudinary.com/dargbitr2/image/upload/v1697311977/LinksForIsrael/jix5eizmqcegmfra89gs.jpg",
			],
		},
		icons: {
			icon: "https://res.cloudinary.com/dargbitr2/image/upload/v1697228919/LinksForIsrael/r5ysb355egkpyd10jovq.jpg",
		},
	};

	return (
		<Head>
			{/* Basic Meta Tags */}
			<meta name="title" content={metadata.title} />
			<meta name="description" content={metadata.description} />
			<meta name="viewport" content={metadata.viewport} />

			{/* Open Graph Meta Tags */}
			<meta property="og:url" content={metadata.openGraph.url} />
			<meta property="og:title" content={metadata.openGraph.title} />
			<meta
				property="og:description"
				content={metadata.openGraph.description}
			/>
			<meta property="og:image" content={metadata.openGraph.images} />
			<meta property="og:type" content={metadata.openGraph.type} />

			{/* Twitter Card Meta Tags */}
			<meta name="twitter:card" content={metadata.twitter.card} />
			<meta name="twitter:site" content={metadata.twitter.site} />
			<meta name="twitter:creator" content={metadata.twitter.creator} />
			<meta name="twitter:title" content={metadata.twitter.title} />
			<meta name="twitter:description" content={metadata.twitter.description} />
			<meta name="twitter:image" content={metadata.twitter.images[0]} />

			{/* Apple-specific Meta Tags */}
			<meta
				name="apple-mobile-web-app-status-bar-style"
				content={metadata.appleWebApp.statusBarStyle}
			/>

			{/* Icons */}
			<link rel="icon" href={metadata.icons.icon} />
		</Head>
	);
}

export default MetaDataComponent;
