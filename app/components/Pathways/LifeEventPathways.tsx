"use client";

import NextLink from "next/link";
import React from "react";
import {
	FaBalanceScale,
	FaHandHoldingHeart,
	FaHandsHelping,
	FaHeart,
	FaPlaneArrival,
	FaSeedling,
	FaShieldAlt,
} from "react-icons/fa";

import { Box, Flex, Heading, Icon, SimpleGrid, Text } from "@chakra-ui/react";

interface Pathway {
	id: string;
	title: string;
	subtitle: string;
	icon: React.ElementType;
	accentBg: string;
	accentColor: string;
	href: string;
}

const PATHWAYS_BY_LOCALE: Record<
	"he" | "en",
	{ heading: string; subtitle: string; items: Pathway[] }
> = {
	he: {
		heading: "מצאו מענה מהיר לפי מצב",
		subtitle: "לא צריך לדעת את שם העמותה — בחרו מה רלוונטי לכם עכשיו",
		items: [
			{
				id: "mental-health",
				title: "מרגיש/ה חרדה או מצוקה?",
				subtitle: "מוקדי סיוע נפשי 24/7, צ׳אט אנונימי ותמיכה חינם",
				icon: FaHeart,
				accentBg: "red.50",
				accentColor: "red.600",
				href: "/Medical?phone=1",
			},
			{
				id: "reservists",
				title: "מילואים, פצועים ומשפחות",
				subtitle: "מענקים, זכויות, ליווי שיקומי ותמיכה במשפחה",
				icon: FaShieldAlt,
				accentBg: "blue.50",
				accentColor: "brand.600",
				href: "/Defense?verified=1",
			},
			{
				id: "volunteer",
				title: "רוצה להתנדב השבוע?",
				subtitle: "התנדבות גמישה בעמותות מאומתות, בקהילה ובחקלאות",
				icon: FaHandsHelping,
				accentBg: "teal.50",
				accentColor: "teal.600",
				href: "/GeneralAssistance?intent=volunteer",
			},
			{
				id: "donate",
				title: "רוצה לתרום למקום אמין?",
				subtitle: "עמותות עם אישור סעיף 46, ניהול תקין ושקיפות מלאה",
				icon: FaHandHoldingHeart,
				accentBg: "purple.50",
				accentColor: "purple.600",
				href: "/Economic?s46=1",
			},
			{
				id: "olim",
				title: "עולים חדשים ועלייה לישראל",
				subtitle:
					"סל קליטה, אולפן, זכויות, תעסוקה, חיילים בודדים וקהילות עולים",
				icon: FaPlaneArrival,
				accentBg: "blue.50",
				accentColor: "brand.700",
				href: "/Olim",
			},
			{
				id: "rights",
				title: "בירור זכויות וביטוח לאומי",
				subtitle: "כל זכות, קו לעובד, פורטלים רשמיים ומיצוי זכויות",
				icon: FaBalanceScale,
				accentBg: "orange.50",
				accentColor: "orange.600",
				href: "/GeneralAssistance?verified=1",
			},
		],
	},
	en: {
		heading: "Find Verified Support by Situation",
		subtitle:
			"You don't need to know the charity's name — pick what matches now",
		items: [
			{
				id: "mental-health",
				title: "Emotional Distress or Trauma?",
				subtitle:
					"24/7 free anonymous helplines (ERAN 1201, NATAL) & resilience",
				icon: FaHeart,
				accentBg: "red.50",
				accentColor: "red.600",
				href: "/en?cat=rehab&phone=1",
			},
			{
				id: "olim",
				title: "Making Aliyah or New Oleh?",
				subtitle:
					"Official agencies (*2994), Nefesh B'Nefesh, careers & Lone Soldiers",
				icon: FaPlaneArrival,
				accentBg: "blue.50",
				accentColor: "brand.700",
				href: "/en?cat=olim",
			},
			{
				id: "veterans",
				title: "Wounded Veterans & Rehab",
				subtitle: "Brothers For Life, Beit Halochem, trauma & family care",
				icon: FaShieldAlt,
				accentBg: "blue.50",
				accentColor: "brand.600",
				href: "/en?cat=rehab&verified=1",
			},
			{
				id: "volunteer",
				title: "Want to Volunteer in Israel?",
				subtitle: "Ruach Tova, agricultural harvesting, youth & civic rescue",
				icon: FaHandsHelping,
				accentBg: "teal.50",
				accentColor: "teal.600",
				href: "/en?cat=volunteer",
			},
			{
				id: "donate-501c3",
				title: "Donate with US 501(c)(3)",
				subtitle:
					"MOJ-verified Israeli charities with US tax-deductible giving",
				icon: FaHandHoldingHeart,
				accentBg: "purple.50",
				accentColor: "purple.600",
				href: "/en?cat=donate&us501c3=1",
			},
			{
				id: "advocacy",
				title: "Advocacy & Remembrance",
				subtitle: "Verified Oct 7 archives, National Library & global networks",
				icon: FaSeedling,
				accentBg: "green.50",
				accentColor: "green.700",
				href: "/en?cat=advocacy",
			},
		],
	},
};

export function LifeEventPathways({ locale = "he" }: { locale?: "he" | "en" }) {
	const cfg = PATHWAYS_BY_LOCALE[locale];
	const isRtl = locale === "he";

	return (
		<Box mb={8}>
			<Flex align="baseline" justify="space-between" mb={4} wrap="wrap" gap={2}>
				<Heading as="h2" size="md" color="gray.800">
					{cfg.heading}
				</Heading>
				<Text fontSize="sm" color="gray.600">
					{cfg.subtitle}
				</Text>
			</Flex>

			<SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={3.5}>
				{cfg.items.map((pathway) => (
					<Flex
						key={pathway.id}
						as={NextLink}
						href={pathway.href}
						align="flex-start"
						gap={3.5}
						p={4}
						bg="white"
						borderRadius="14px"
						borderWidth="1px"
						borderColor="gray.200"
						boxShadow="0 1px 2px rgba(15, 23, 42, 0.04)"
						textAlign={isRtl ? "right" : "left"}
						cursor="pointer"
						transition="all 0.2s ease"
						_hover={{
							borderColor: "brand.300",
							transform: "translateY(-2px)",
							boxShadow: "md",
							textDecoration: "none",
						}}
						_focusVisible={{
							outline: "none",
							boxShadow: "0 0 0 3px rgba(29, 92, 214, 0.3)",
						}}
					>
						<Flex
							boxSize="40px"
							minW="40px"
							borderRadius="10px"
							bg={pathway.accentBg}
							color={pathway.accentColor}
							align="center"
							justify="center"
							flexShrink={0}
						>
							<Icon as={pathway.icon} boxSize={4} />
						</Flex>
						<Box minW={0} flex="1">
							<Text fontWeight="bold" fontSize="sm" color="gray.900" mb={0.5}>
								{pathway.title}
							</Text>
							<Text fontSize="xs" color="gray.600" lineHeight="1.45">
								{pathway.subtitle}
							</Text>
						</Box>
					</Flex>
				))}
			</SimpleGrid>
		</Box>
	);
}
