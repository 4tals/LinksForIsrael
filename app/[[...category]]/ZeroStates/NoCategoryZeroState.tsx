"use client";

import Link from "next/link";
import React, { useContext } from "react";
import {
	FaHandHoldingHeart,
	FaHandsHelping,
	FaLifeRing,
	FaMagic,
	FaSearch,
	FaShieldAlt,
} from "react-icons/fa";

import { getNumberOfInitiatives } from "@/app/components/Categories/CategoriesList";
import { CategoryContent } from "@/app/components/Categories/CategoryContent";
import { HotlinesBar } from "@/app/components/Hotlines/HotlinesBar";
import { Logo } from "@/app/components/Logo";
import { LifeEventPathways } from "@/app/components/Pathways/LifeEventPathways";
import { AppToolsContext, SearchContext } from "@/app/components/RootApp";
import { SearchInput } from "@/app/components/Search/SearchInput";
import { analyticsService } from "@/app/utils/analytica/analytics";
import {
	Category,
	InitiativeIntent,
	SubCategoryData,
} from "@/app/utils/categories";
import {
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Icon,
	Image,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";

const QUICK_SEARCH_TAGS = [
	"התנדבות",
	"סיוע נפשי",
	"זכויות",
	"מילואים",
	"תרומות",
	"חקלאות",
	"הסברה",
];

const INTENT_BUTTONS: Array<{
	id: InitiativeIntent;
	label: string;
	icon: React.ElementType;
	colorScheme: string;
}> = [
	{
		id: "get-help",
		label: "אני צריך עזרה",
		icon: FaLifeRing,
		colorScheme: "blue",
	},
	{
		id: "volunteer",
		label: "רוצה להתנדב",
		icon: FaHandsHelping,
		colorScheme: "teal",
	},
	{
		id: "donate",
		label: "רוצה לתרום ולתמוך",
		icon: FaHandHoldingHeart,
		colorScheme: "purple",
	},
];

interface NoCategoryZeroStateProps {
	categories: Category[];
	assistanceSubCategory: SubCategoryData;
}

export const NoCategoryZeroState: React.FC<NoCategoryZeroStateProps> = ({
	categories,
	assistanceSubCategory,
}) => {
	const { onSearch, setActiveIntent } = useContext(SearchContext);
	const { openCommandPalette, openHelperWizard } = useContext(AppToolsContext);

	const allLinks = categories.flatMap((c) =>
		c.subCategories.flatMap((s) => s.links),
	);
	const totalInitiatives = allLinks.length;
	const nihulCount = allLinks.filter((l) => l.properManagement).length;
	const totalMentions = allLinks.reduce(
		(sum, l) => sum + (l.references?.length || 0),
		0,
	);

	return (
		<Box px={{ base: 3, md: 6 }} pt={{ base: 5, md: 8 }} pb={8}>
			{/* Hero Section */}
			<Box
				bg="white"
				borderRadius="2xl"
				borderWidth="1px"
				borderColor="gray.200"
				boxShadow="sm"
				p={{ base: 6, md: 10 }}
				mb={6}
				position="relative"
				overflow="hidden"
			>
				<Box
					position="absolute"
					left={{ base: "-40px", md: "20px" }}
					top="50%"
					transform="translateY(-50%)"
					opacity={0.06}
					pointerEvents="none"
					display={{ base: "none", sm: "block" }}
				>
					<Logo width={260} height={290} />
				</Box>

				<VStack
					spacing={4}
					align="center"
					textAlign="center"
					maxW="700px"
					mx="auto"
					position="relative"
					zIndex={1}
				>
					<HStack spacing={2} wrap="wrap" justify="center">
						<Badge
							colorScheme="blue"
							variant="subtle"
							px={3}
							py={1}
							borderRadius="full"
							fontSize="xs"
						>
							{totalInitiatives} עמותות ויוזמות
						</Badge>
						<Badge
							colorScheme="teal"
							variant="subtle"
							px={3}
							py={1}
							borderRadius="full"
							fontSize="xs"
							display="inline-flex"
							alignItems="center"
							gap={1}
						>
							<Icon as={FaShieldAlt} boxSize={2.5} />
							<span>{nihulCount} ניהול תקין (data.gov.il)</span>
						</Badge>
						<Badge
							colorScheme="green"
							variant="subtle"
							px={3}
							py={1}
							borderRadius="full"
							fontSize="xs"
						>
							{totalMentions} אזכורים עצמאיים · 4 שפות
						</Badge>
					</HStack>

					<Heading
						as="h1"
						fontSize={{ base: "2xl", md: "4xl" }}
						fontWeight="bold"
						color="brand.700"
						lineHeight="1.2"
					>
						פורטל לינק לישראל
					</Heading>

					<Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
						המדריך הפתוח להתנדבות, עמותות, סיוע נפשי, זכויות אזרחים ויוזמות
						קהילתיות בישראל — בשגרה ובחירום.
					</Text>

					{/* Guided Helper + Spotlight Command Palette + Intent Buttons */}
					<Flex wrap="wrap" justify="center" gap={2.5} pt={1}>
						<Button
							size={{ base: "sm", md: "md" }}
							colorScheme="blue"
							bg="brand.600"
							color="white"
							borderRadius="full"
							px={5}
							fontWeight="bold"
							leftIcon={<Icon as={FaMagic} />}
							onClick={openHelperWizard}
							boxShadow="sm"
							_hover={{ bg: "brand.700", transform: "translateY(-1px)" }}
							transition="all 0.15s ease"
						>
							עזרו לי למצוא ב-10 שניות
						</Button>
						<Button
							size={{ base: "sm", md: "md" }}
							variant="outline"
							colorScheme="blue"
							bg="white"
							borderRadius="full"
							px={4}
							fontWeight="semibold"
							leftIcon={<Icon as={FaSearch} boxSize={3} />}
							onClick={openCommandPalette}
							display={{ base: "none", sm: "inline-flex" }}
							_hover={{ bg: "brand.50", transform: "translateY(-1px)" }}
							transition="all 0.15s ease"
						>
							חיפוש מהיר (⌘K)
						</Button>
						{INTENT_BUTTONS.map((btn) => (
							<Button
								key={btn.id}
								size={{ base: "sm", md: "md" }}
								colorScheme={btn.colorScheme}
								variant="subtle"
								bg={`${btn.colorScheme}.50`}
								color={`${btn.colorScheme}.700`}
								borderWidth="1px"
								borderColor={`${btn.colorScheme}.200`}
								borderRadius="full"
								px={5}
								fontWeight="bold"
								leftIcon={<Icon as={btn.icon} />}
								onClick={() => setActiveIntent(btn.id)}
								_hover={{
									bg: `${btn.colorScheme}.100`,
									transform: "translateY(-1px)",
								}}
								transition="all 0.15s ease"
							>
								{btn.label}
							</Button>
						))}
					</Flex>

					<Box w="100%" maxW="540px" pt={1}>
						<SearchInput
							id="searchInputHero"
							size="lg"
							placeholder="חפשו עמותה, מוקד סיוע, התנדבות או תחום..."
						/>
					</Box>

					<Flex wrap="wrap" justify="center" gap={2}>
						{QUICK_SEARCH_TAGS.map((tag) => (
							<Button
								key={tag}
								size="xs"
								variant="outline"
								colorScheme="blue"
								borderRadius="full"
								fontWeight="medium"
								onClick={() => onSearch(tag)}
								_hover={{ bg: "blue.50" }}
							>
								{tag}
							</Button>
						))}
					</Flex>
				</VStack>
			</Box>

			{/* Essential Hotlines Strip */}
			<HotlinesBar />

			{/* Guided Life-Event Pathways */}
			<LifeEventPathways />

			{/* Category Grid */}
			<Box mb={10}>
				<Flex align="baseline" justify="space-between" mb={4}>
					<Heading as="h2" size="md" color="gray.800">
						בחרו תחום
					</Heading>
					<Text fontSize="sm" color="gray.500">
						לחצו על קטגוריה לצפייה בכל היוזמות
					</Text>
				</Flex>

				<SimpleGrid
					columns={{ base: 2, sm: 3, lg: 4 }}
					spacing={{ base: 3, md: 4 }}
				>
					{categories.map((category) => {
						const count = getNumberOfInitiatives(category);
						return (
							<Flex
								key={category.id}
								as={Link}
								href={`/${category.id}`}
								onClick={() => analyticsService.trackCategoryView(category.id)}
								direction="column"
								bg="white"
								p={{ base: 4, md: 5 }}
								borderRadius="xl"
								borderWidth="1px"
								borderColor="gray.200"
								boxShadow="xs"
								transition="all 0.2s ease"
								_hover={{
									borderColor: "brand.400",
									boxShadow: "md",
									transform: "translateY(-3px)",
								}}
								justify="space-between"
								gap={3}
							>
								<Flex align="center" justify="space-between" gap={2}>
									{category.image && (
										<Box
											p={2}
											bg="brand.50"
											borderRadius="lg"
											display="inline-flex"
										>
											<Image
												src={category.image}
												alt=""
												boxSize={{ base: "32px", md: "38px" }}
												objectFit="contain"
											/>
										</Box>
									)}
									<Badge
										colorScheme="blue"
										variant="subtle"
										borderRadius="full"
										px={2.5}
										py={0.5}
										fontSize="xs"
									>
										{count} יוזמות
									</Badge>
								</Flex>

								<Box>
									<Text
										fontWeight="bold"
										fontSize={{ base: "sm", md: "md" }}
										color="gray.800"
										lineHeight="1.3"
									>
										{category.displayName}
									</Text>
									{category.description && (
										<Text
											fontSize="xs"
											color="gray.500"
											mt={1}
											noOfLines={2}
											lineHeight="1.4"
										>
											{category.description}
										</Text>
									)}
								</Box>
							</Flex>
						);
					})}
				</SimpleGrid>
			</Box>

			{/* Evergreen SEO Guides & Multilingual Portals Hub */}
			<Box
				mb={10}
				p={{ base: 5, md: 6 }}
				bg="white"
				borderRadius="2xl"
				borderWidth="1px"
				borderColor="gray.200"
			>
				<Flex
					align="baseline"
					justify="space-between"
					mb={4}
					wrap="wrap"
					gap={2}
				>
					<Heading as="h2" size="md" color="gray.800">
						מדריכים מרכזיים ופורטלים בשפות נוספות
					</Heading>
					<Text fontSize="xs" color="gray.500">
						מידע מאומת וזמין לקריאה, שיתוף והדפסה
					</Text>
				</Flex>
				<SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={3}>
					{[
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
							sub: "עמוד A4 מסודר ב-4 שפות עם כל מוקדי ההצלה 24/7",
						},
						{
							href: "/en",
							title: "English · العربية · Русский Portals",
							sub: "Verified Israeli charities (501(c)(3) & §46) and hotlines",
						},
					].map((guide) => (
						<Flex
							key={guide.href}
							as={Link}
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

			{/* General Assistance Section */}
			<Box>
				<CategoryContent
					categoryId="GeneralAssistance"
					subCategories={[assistanceSubCategory]}
					headingAs="h2"
					enableTrustFilters={false}
				/>
			</Box>
		</Box>
	);
};
