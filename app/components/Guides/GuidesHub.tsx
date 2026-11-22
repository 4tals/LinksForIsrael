"use client";

import NextLink from "next/link";
import React from "react";

import { Box, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";

const GUIDES_BY_LOCALE = {
	he: {
		heading: "מדריכים מרכזיים וכלים שימושיים",
		subtitle: "מידע מאומת וזמין לקריאה, שיתוף והדפסה",
		items: [
			{
				href: "/docs/mental-health",
				title: "מוקדי סיוע נפשי חינם 24/7 בישראל",
				sub: "ער״ן 1201, נט״ל, סה״ר, מרכזי חוסן ותקיפה מינית",
			},
			{
				href: "/docs/tax-deductible-donations",
				title: "מדריך תרומות סעיף 46 וניהול תקין",
				sub: "איך לוודא שעמותה מאומתת מול רשם העמותות (data.gov.il)",
			},
			{
				href: "/docs/volunteering-israel",
				title: "איפה ואיך להתנדב בישראל",
				sub: "רוח טובה, ידידים, חקלאות, נוער, רפואה והצלה",
			},
			{
				href: "/docs/methodology",
				title: "איך אנחנו מאמתים ומדרגים עמותות",
				sub: "שקיפות מלאה, ניהול תקין ואזכורים עצמאיים בתקשורת",
			},
			{
				href: "/print",
				title: "דף חירום להדפסה לממ״ד ולמקרר",
				sub: "עמוד A4 מסודר בעברית ובאנגלית עם כל מוקדי ההצלה 24/7",
			},
			{
				href: "/en",
				title: "English Portal — Support & Donate",
				sub: "Verified Israeli charities (501(c)(3) & §46) and 24/7 hotlines",
			},
		],
	},
	en: {
		heading: "Essential Guides & Civic Tools",
		subtitle: "Verified resources ready to read, share, embed, or print",
		items: [
			{
				href: "/docs/methodology?lang=en",
				title: "How We Verify & Rank Nonprofits",
				sub: "Live Ministry of Justice (data.gov.il) checks & independent citations",
			},
			{
				href: "/en?us501c3=1",
				title: "US 501(c)(3) Tax-Deductible Charities",
				sub: "Filter flagship Israeli nonprofits with US tax-deductible giving",
			},
			{
				href: "/en?s46=1",
				title: "Israeli Section 46 Verified Charities",
				sub: "Organizations recognized under Israel's Income Tax Section 46",
			},
			{
				href: "/print?lang=en",
				title: "Printable 24/7 Emergency Fridge Sheet",
				sub: "Clean A4 crisis & hotline sheet for safe rooms (Mamad) & homes",
			},
			{
				href: "/embed/hotlines?lang=en",
				title: "Embeddable 24/7 Hotlines Widget",
				sub: "Free open-source HTML snippet for blogs, communities & sites",
			},
			{
				href: "/",
				title: "לפורטל המלא בעברית (130+ יוזמות)",
				sub: "Browse all 8 Israeli civic categories in Hebrew with live search",
			},
		],
	},
} as const;

export function GuidesHub({ locale = "he" }: { locale?: "he" | "en" }) {
	const cfg = GUIDES_BY_LOCALE[locale];

	return (
		<Box
			mb={10}
			p={{ base: 5, md: 6 }}
			bg="white"
			borderRadius="2xl"
			borderWidth="1px"
			borderColor="gray.200"
		>
			<Flex align="baseline" justify="space-between" mb={4} wrap="wrap" gap={2}>
				<Heading as="h2" size="md" color="gray.800">
					{cfg.heading}
				</Heading>
				<Text fontSize="xs" color="gray.600">
					{cfg.subtitle}
				</Text>
			</Flex>
			<SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={3}>
				{cfg.items.map((guide) => (
					<Flex
						key={guide.href}
						as={NextLink}
						href={guide.href}
						direction="column"
						p={4}
						bg="gray.50"
						borderRadius="xl"
						borderWidth="1px"
						borderColor="gray.200"
						transition="all 0.15s ease"
						_hover={{
							bg: "brand.50",
							borderColor: "brand.300",
							transform: "translateY(-1px)",
							textDecoration: "none",
						}}
					>
						<Text fontWeight="bold" fontSize="sm" color="brand.700" mb={1}>
							{guide.title}
						</Text>
						<Text fontSize="xs" color="gray.600" lineHeight="1.5">
							{guide.sub}
						</Text>
					</Flex>
				))}
			</SimpleGrid>
		</Box>
	);
}
