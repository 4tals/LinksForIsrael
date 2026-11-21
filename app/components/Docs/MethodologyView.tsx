"use client";

import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import {
	FaArrowLeft,
	FaArrowRight,
	FaCheckCircle,
	FaGithub,
	FaGlobe,
	FaNewspaper,
	FaPlus,
	FaRobot,
	FaShieldAlt,
} from "react-icons/fa";

import { ShareButtons } from "@/app/components/Share/ShareButtons";
import {
	getUrlParams,
	updateUrlParams,
	URL_CHANGE_EVENT,
} from "@/app/utils/urlState";
import {
	Badge,
	Box,
	Button,
	Container,
	Flex,
	Heading,
	HStack,
	Icon,
	Link,
	Progress,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";

export interface MethodologyStats {
	totalInitiatives: number;
	verifiedCount: number;
	withMentionsCount: number;
	totalMentions: number;
	categoriesCount: number;
}

const RANK_FACTORS = [
	{
		key: "verified",
		heLabel: "אימות רשמי / עמותתי (GuideStar / gov.il)",
		enLabel: "Verified Status (GuideStar Israel / Official Body)",
		pointsHe: "+35 נק׳",
		pointsEn: "+35 pts",
		pct: 35,
		color: "green",
	},
	{
		key: "official",
		heLabel: "גוף ממלכתי / רשמי לאומי (פיקוד העורף, צה״ל, הספרייה הלאומית)",
		enLabel: "National Official Institution (Home Front Command, IDF, NLI)",
		pointsHe: "+15 נק׳",
		pointsEn: "+15 pts",
		pct: 15,
		color: "teal",
	},
	{
		key: "s46",
		heLabel: "אישור סעיף 46 לתרומות מוכרות במס",
		enLabel: "Section 46 Tax-Deductible Status",
		pointsHe: "+10 נק׳",
		pointsEn: "+10 pts",
		pct: 10,
		color: "green",
	},
	{
		key: "registry",
		heLabel:
			"רישומים ומקורות רשמיים (גיידסטאר, ויקיפדיה, כל זכות, מבקר המדינה)",
		enLabel: "Registries & Official Citations (GuideStar, Wikipedia, gov.il)",
		pointsHe: "+14 לאזכור (עד 24)",
		pointsEn: "+14 each (cap 24)",
		pct: 24,
		color: "blue",
	},
	{
		key: "media",
		heLabel: "סיקור תקשורתי עצמאי (כתבות, וידאו / כאן 11, פודקאסטים)",
		enLabel: "Independent Media (Press Articles, TV / Video, Podcasts)",
		pointsHe: "+12 לאזכור (עד 24)",
		pointsEn: "+12 each (cap 24)",
		pct: 24,
		color: "blue",
	},
	{
		key: "community",
		heLabel: "המלצות חיצוניות ובודקי עובדות (X, בלוגים, לא רלוונטי)",
		enLabel: "Independent Endorsements & Fact-Checkers (X, Blogs)",
		pointsHe: "+6 לאזכור (עד 15)",
		pointsEn: "+6 each (cap 15)",
		pct: 15,
		color: "purple",
	},
	{
		key: "diversity",
		heLabel: "בונוס גיוון מקורות (אזכורים מדומיינים בלתי תלויים שונים)",
		enLabel: "Multi-Domain Diversity Bonus (Distinct Independent Sources)",
		pointsHe: "+3 לדומיין נוסף (עד 9)",
		pointsEn: "+3 per extra domain (cap 9)",
		pct: 9,
		color: "cyan",
	},
	{
		key: "completeness",
		heLabel: "שלמות פרטי קשר (אתר פעיל, מוקד טלפוני, תיאור מלא)",
		enLabel: "Profile Completeness (Live Website, Hotline, Full Description)",
		pointsHe: "עד +6 נק׳",
		pointsEn: "Up to +6 pts",
		pct: 6,
		color: "gray",
	},
];

export function MethodologyView({ stats }: { stats: MethodologyStats }) {
	const [lang, setLang] = useState<"he" | "en">("he");

	useEffect(() => {
		const syncFromUrl = () => {
			const params = getUrlParams();
			setLang(params.get("lang") === "en" ? "en" : "he");
		};
		syncFromUrl();
		window.addEventListener("popstate", syncFromUrl);
		window.addEventListener(URL_CHANGE_EVENT, syncFromUrl);
		return () => {
			window.removeEventListener("popstate", syncFromUrl);
			window.removeEventListener(URL_CHANGE_EVENT, syncFromUrl);
		};
	}, []);

	const switchLang = (next: "he" | "en") => {
		setLang(next);
		updateUrlParams({ lang: next === "en" ? "en" : null });
	};

	const isHe = lang === "he";

	const pillars = [
		{
			icon: FaCheckCircle,
			color: "green.600",
			bg: "green.50",
			title: isHe
				? "1. אימות רשמי מול רשם העמותות"
				: "1. Official & Registry Verification",
			body: isHe
				? "תג האימות ניתן רק לאחר בדיקה ישירה של רישום פעיל בגיידסטאר ישראל (משרד המשפטים), בדיקת ניהול תקין וסעיף 46 לתרומות, או אימות מול דומיין ממלכתי רשמי (gov.il / idf.il / oref.org.il)."
				: "The Verified badge is awarded only after checking active registration in GuideStar Israel (Ministry of Justice), Good Standing & Section 46 tax-deductible status, or official government domains (gov.il / idf.il).",
		},
		{
			icon: FaNewspaper,
			color: "brand.600",
			bg: "blue.50",
			title: isHe
				? "2. אזכורים חיצוניים בלבד (ללא פרופילים עצמיים)"
				: "2. Independent Third-Party Citations Only",
			body: isHe
				? "קישורים לדף הלינקדאין, הפייסבוק או האתר של הארגון עצמו מוצגים כאייקוני קשר בלבד ואינם נספרים בדירוג. רק אזכורים של צד שלישי (ויקיפדיה, גיידסטאר, כתבות, כאן 11, פודקאסטים, בודקי עובדות והמלצות של אחרים) משפיעים על הציון."
				: "Self-owned websites, Facebook groups, or LinkedIn company profiles appear as contact icons only and earn zero citation points. Only independent third-party mentions (Wikipedia, GuideStar, press, TV/podcasts, fact-checkers, and third-party recommendations) count toward rank.",
		},
		{
			icon: FaRobot,
			color: "purple.600",
			bg: "purple.50",
			title: isHe
				? "3. ניטור שבועי אוטומטי נגד דומיינים חטופים"
				: "3. Weekly Automated Dead & Hijacked Link Monitor",
			body: isHe
				? "סקריפט אוטומטי סורק מדי שבוע את כל האתרים והאזכורים באתר, כולל ניתוח תוכן HTML לזיהוי דומיינים שפגו ונחטפו להימורים/ספאם, וזיהוי הזמנות וואטסאפ שפגו — כדי למנוע קישורים מסוכנים או שבורים."
				: "An automated weekly GitHub Action checks every organization website and every citation URL — inspecting HTML payloads to catch parked/hijacked spam domains and revoked WhatsApp group invites before citizens encounter them.",
		},
		{
			icon: FaShieldAlt,
			color: "teal.600",
			bg: "teal.50",
			title: isHe
				? "4. קוד פתוח, ללא פרסומות וללא מטרות רווח"
				: "4. 100% Open Source, Ad-Free & Community Audited",
			body: isHe
				? "אין קידום ממומן, אין תשלום תמורת מיקום גבוה ואין איסוף מידע אישי. כל הקוד, רשימת היוזמות ונוסחת הדירוג פתוחים לחלוטין לביקורת ציבורית ב-GitHub."
				: "Zero sponsored placements, zero pay-to-rank listings, and zero ads. Every dataset, citation, and line of ranking code is public and auditable on GitHub.",
		},
	];

	return (
		<Box dir={isHe ? "rtl" : "ltr"} py={{ base: 6, md: 10 }}>
			<Container maxW="1040px" px={{ base: 4, md: 6 }}>
				{/* Top Bar: Back + Language Toggle + Share */}
				<Flex align="center" justify="space-between" wrap="wrap" gap={3} mb={5}>
					<Button
						as={NextLink}
						href={isHe ? "/" : "/en"}
						size="sm"
						variant="ghost"
						colorScheme="blue"
						borderRadius="full"
						leftIcon={isHe ? undefined : <Icon as={FaArrowLeft} boxSize={3} />}
						rightIcon={
							isHe ? <Icon as={FaArrowRight} boxSize={3} /> : undefined
						}
					>
						{isHe ? "חזרה לפורטל" : "Back to Directory"}
					</Button>

					<HStack spacing={2}>
						<Button
							size="xs"
							borderRadius="full"
							colorScheme="blue"
							variant={isHe ? "solid" : "outline"}
							onClick={() => switchLang("he")}
						>
							עברית
						</Button>
						<Button
							size="xs"
							borderRadius="full"
							colorScheme="blue"
							variant={!isHe ? "solid" : "outline"}
							leftIcon={<Icon as={FaGlobe} boxSize={3} />}
							onClick={() => switchLang("en")}
						>
							English
						</Button>
						<Box
							bg="white"
							px={2}
							py={0.5}
							borderRadius="full"
							borderWidth="1px"
							borderColor="gray.200"
						>
							<ShareButtons
								category={
									isHe
										? "איך אנחנו מאמתים ומדרגים יוזמות"
										: "Verification & Ranking Methodology"
								}
							/>
						</Box>
					</HStack>
				</Flex>

				{/* Hero Card */}
				<Box
					bg="white"
					borderRadius="2xl"
					borderWidth="1px"
					borderColor="gray.200"
					boxShadow="sm"
					p={{ base: 6, md: 9 }}
					mb={6}
				>
					<VStack spacing={4} align="stretch">
						<HStack spacing={2} wrap="wrap">
							<Badge
								colorScheme="green"
								variant="subtle"
								borderRadius="full"
								px={3}
								py={1}
								fontSize="xs"
							>
								{isHe ? "שקיפות מלאה" : "Full Transparency"}
							</Badge>
							<Badge
								colorScheme="blue"
								variant="subtle"
								borderRadius="full"
								px={3}
								py={1}
								fontSize="xs"
							>
								{isHe ? "ללא קידום ממומן" : "Zero Paid Placements"}
							</Badge>
						</HStack>

						<Heading
							as="h1"
							fontSize={{ base: "2xl", md: "3xl" }}
							color="brand.700"
							lineHeight="1.25"
						>
							{isHe
								? "איך אנחנו מאמתים ומדרגים יוזמות בפורטל לינק לישראל"
								: "How Links For Israel Verifies & Ranks Organizations"}
						</Heading>

						<Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
							{isHe
								? "כשמישהו מחפש סיוע נפשי, התנדבות או עמותה בטוחה לתרומה — אמון הוא הכול. כאן מפורט בדיוק איך כל יוזמה נבדקת, איך נספרים אזכורים חיצוניים ואיך נקבע סדר התוצאות."
								: "When someone needs crisis support, volunteering, or a trustworthy Israeli charity, trust is everything. Here is exactly how every organization is vetted, cited, monitored, and ranked."}
						</Text>

						{/* Live Directory Metrics Strip */}
						<SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} pt={2}>
							{[
								{
									value: stats.totalInitiatives,
									label: isHe ? "יוזמות פעילות" : "Active Initiatives",
									color: "brand.600",
								},
								{
									value: stats.verifiedCount,
									label: isHe ? "ארגונים מאומתים" : "Verified Organizations",
									color: "green.600",
								},
								{
									value: stats.totalMentions,
									label: isHe
										? "אזכורים חיצוניים מאומתים"
										: "Verified Third-Party Mentions",
									color: "blue.600",
								},
								{
									value: `${Math.round(
										(stats.withMentionsCount /
											Math.max(1, stats.totalInitiatives)) *
											100,
									)}%`,
									label: isHe ? "כיסוי סימוכין חיצוניים" : "Citation Coverage",
									color: "purple.600",
								},
							].map((stat) => (
								<Box
									key={stat.label}
									bg="gray.50"
									borderRadius="xl"
									borderWidth="1px"
									borderColor="gray.200"
									p={4}
									textAlign="center"
								>
									<Text fontSize="2xl" fontWeight="bold" color={stat.color}>
										{stat.value}
									</Text>
									<Text fontSize="xs" color="gray.600" mt={0.5}>
										{stat.label}
									</Text>
								</Box>
							))}
						</SimpleGrid>
					</VStack>
				</Box>

				{/* 4 Pillars Grid */}
				<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
					{pillars.map((pillar) => (
						<Box
							key={pillar.title}
							bg="white"
							borderRadius="xl"
							borderWidth="1px"
							borderColor="gray.200"
							p={6}
							boxShadow="xs"
						>
							<Flex align="center" gap={3} mb={3}>
								<Flex
									boxSize="40px"
									borderRadius="lg"
									bg={pillar.bg}
									color={pillar.color}
									align="center"
									justify="center"
									flexShrink={0}
								>
									<Icon as={pillar.icon} boxSize={4} />
								</Flex>
								<Heading as="h2" fontSize="md" color="gray.900">
									{pillar.title}
								</Heading>
							</Flex>
							<Text fontSize="sm" color="gray.600" lineHeight="1.7">
								{pillar.body}
							</Text>
						</Box>
					))}
				</SimpleGrid>

				{/* Transparent Ranking Breakdown */}
				<Box
					bg="white"
					borderRadius="2xl"
					borderWidth="1px"
					borderColor="gray.200"
					boxShadow="xs"
					p={{ base: 5, md: 7 }}
					mb={6}
				>
					<Heading as="h2" size="md" color="gray.900" mb={1}>
						{isHe
							? "נוסחת הדירוג השקופה (ציון 0–100)"
							: "Transparent Ranking Formula (0–100 Score)"}
					</Heading>
					<Text fontSize="sm" color="gray.500" mb={5}>
						{isHe
							? "לכל מרכיב יש תקרה ברורה כדי למנוע מניפולציות, ויש בונוס מיוחד לגיוון בין מקורות עצמאיים שונים."
							: "Every tier has a strict cap to prevent gaming, plus a diversity bonus when independent sources across multiple domains vouch for the same organization."}
					</Text>

					<VStack spacing={3.5} align="stretch">
						{RANK_FACTORS.map((factor) => (
							<Box key={factor.key}>
								<Flex justify="space-between" align="center" mb={1} gap={2}>
									<Text fontSize="sm" fontWeight="medium" color="gray.800">
										{isHe ? factor.heLabel : factor.enLabel}
									</Text>
									<Badge
										colorScheme={factor.color}
										variant="subtle"
										borderRadius="full"
										px={2.5}
										fontSize="xs"
										flexShrink={0}
									>
										{isHe ? factor.pointsHe : factor.pointsEn}
									</Badge>
								</Flex>
								<Progress
									value={factor.pct}
									max={40}
									size="xs"
									colorScheme={factor.color}
									borderRadius="full"
									bg="gray.100"
								/>
							</Box>
						))}
					</VStack>
				</Box>

				{/* Community Participation CTA */}
				<Box
					bg="brand.50"
					borderRadius="2xl"
					borderWidth="1px"
					borderColor="brand.200"
					p={{ base: 6, md: 7 }}
					textAlign="center"
				>
					<Heading as="h2" size="md" color="brand.700" mb={2}>
						{isHe
							? "עזרו לנו לשמור על המידע מדויק ועדכני"
							: "Help Keep This Directory Accurate & Trusted"}
					</Heading>
					<Text fontSize="sm" color="gray.600" mb={5} maxW="620px" mx="auto">
						{isHe
							? "מכירים ארגון מאומת שחסר, כתבה אמינה שכדאי לצרף או קישור שדורש תיקון? כל הצעה נבדקת ומתווספת בשקיפות דרך GitHub."
							: "Know a verified organization we should add, a press citation to attach, or a link that needs updating? Submit directly via GitHub Issues."}
					</Text>
					<Flex wrap="wrap" justify="center" gap={3}>
						<Button
							as={Link}
							href="https://github.com/4tals/LinksForIsrael/issues/new?template=new_initiative.yml"
							isExternal
							colorScheme="blue"
							bg="brand.600"
							_hover={{ bg: "brand.700", textDecoration: "none" }}
							borderRadius="full"
							size="sm"
							leftIcon={<Icon as={FaPlus} boxSize={3} />}
						>
							{isHe ? "הצע ארגון / יוזמה" : "Suggest Organization"}
						</Button>
						<Button
							as={Link}
							href="https://github.com/4tals/LinksForIsrael/issues/new?template=add_reference.yml"
							isExternal
							colorScheme="blue"
							variant="outline"
							bg="white"
							_hover={{ bg: "blue.50", textDecoration: "none" }}
							borderRadius="full"
							size="sm"
							leftIcon={<Icon as={FaNewspaper} boxSize={3} />}
						>
							{isHe ? "הוסף אזכור / כתבה" : "Add Third-Party Mention"}
						</Button>
						<Button
							as={Link}
							href="https://github.com/4tals/LinksForIsrael"
							isExternal
							colorScheme="gray"
							variant="outline"
							bg="white"
							_hover={{ bg: "gray.50", textDecoration: "none" }}
							borderRadius="full"
							size="sm"
							leftIcon={<Icon as={FaGithub} boxSize={3.5} />}
						>
							{isHe ? "צפו בקוד ב-GitHub" : "View Source on GitHub"}
						</Button>
					</Flex>
				</Box>
			</Container>
		</Box>
	);
}
