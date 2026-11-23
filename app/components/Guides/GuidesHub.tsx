"use client";

import NextLink from "next/link";
import React from "react";

import { analyticsService } from "@/app/utils/analytica/analytics";
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
				href: "/docs/olim",
				title: "מדריך לעולה החדש — 90 הימים הראשונים",
				sub: "תעודת עולה, סל קליטה, קופת חולים, אולפן, הנחה בארנונה וגופי סיוע",
			},
			{
				href: "/docs/healthcare",
				title: "שירותי בריאות בישראל — קופות חולים וזכויות",
				sub: "מוקדי הקופות, רישום עולים, מעבר קופה, מיון וקול הבריאות ‎*5400",
			},
			{
				href: "/docs/abroad",
				title: "מדריך לישראלים וליהודים בחו״ל",
				sub: "קונסוליות, ביטחון בקמפוסים (ארה״ב/בריטניה/צרפת), תרומות מחו״ל ותושבים חוזרים",
			},
			{
				href: "/print",
				title: "דף חירום להדפסה לממ״ד ולמקרר",
				sub: "עמוד A4 מסודר בעברית ובאנגלית עם כל מוקדי ההצלה 24/7",
			},
		],
	},
	en: {
		heading: "Essential Guides & Civic Tools",
		subtitle: "Verified resources ready to read, share, embed, or print",
		items: [
			{
				href: "/docs/olim?lang=en",
				title: "New Olim Guide — First 90 Days & Money Transfers",
				sub: "Teudat Oleh, Sal Klita, health funds, Ulpan, tax benefits & licensed FX",
			},
			{
				href: "/docs/healthcare?lang=en",
				title: "Healthcare in Israel — Health Funds & Your Rights",
				sub: "Fund call centers, olim registration, switching funds, ER & the *5400 hotline",
			},
			{
				href: "/docs/abroad?lang=en",
				title: "Guide for Israelis & Jewish Life Abroad",
				sub: "Consulates, campus legal aid (US/UK/FR/CA/AU), tax-deductible giving & returning residents",
			},
			{
				href: "/docs/methodology?lang=en",
				title: "How We Verify & Rank Resources",
				sub: "Live Ministry of Justice (data.gov.il) checks & explicit licensed-service labels",
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
				title: "לפורטל המלא בעברית (210+ משאבים ויוזמות)",
				sub: "Browse all 11 Israel & Jewish life categories in Hebrew with live search",
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
						onClick={() =>
							analyticsService.trackGuideClick(guide.href, guide.title, locale)
						}
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
