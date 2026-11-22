"use client";

import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { FaCode, FaCopy, FaExternalLinkAlt, FaPhoneAlt } from "react-icons/fa";

import { getUrlParams, updateUrlParams } from "@/app/utils/urlState";
import {
	Badge,
	Box,
	Button,
	Code,
	Container,
	Flex,
	Heading,
	HStack,
	Icon,
	Link,
	Text,
	useToast,
} from "@chakra-ui/react";

type EmbedLang = "he" | "en" | "ar" | "ru";

const HOTLINES_BY_LANG: Record<
	EmbedLang,
	{
		dir: "rtl" | "ltr";
		heading: string;
		poweredBy: string;
		items: Array<{
			name: string;
			subtitle: string;
			number: string;
			href: string;
		}>;
	}
> = {
	he: {
		dir: "rtl",
		heading: "מוקדי חירום וסיוע מיידי בישראל (24/7)",
		poweredBy: "מתעדכן שוטף ע״י לינק לישראל (קוד פתוח)",
		items: [
			{
				name: "ער״ן",
				subtitle: "סיוע נפשי 24/7",
				number: "1201",
				href: "tel:1201",
			},
			{
				name: "נט״ל",
				subtitle: "טראומה וחרדה",
				number: "1-800-363-363",
				href: "tel:1800363363",
			},
			{
				name: "תקיפה מינית",
				subtitle: "סיוע 24/7",
				number: "1202",
				href: "tel:1202",
			},
			{
				name: "איחוד הצלה",
				subtitle: "חירום רפואי",
				number: "1221",
				href: "tel:1221",
			},
			{
				name: "ידידים",
				subtitle: "סיוע בדרכים",
				number: "1230",
				href: "tel:1230",
			},
			{
				name: "פיקוד העורף",
				subtitle: "חירום ומידע",
				number: "104",
				href: "tel:104",
			},
			{ name: "מד״א", subtitle: "אמבולנס", number: "101", href: "tel:101" },
			{ name: "משטרה", subtitle: "חירום", number: "100", href: "tel:100" },
		],
	},
	en: {
		dir: "ltr",
		heading: "Israel 24/7 Emergency & Mental Health Hotlines",
		poweredBy: "Maintained open-source by Links For Israel",
		items: [
			{
				name: "ERAN",
				subtitle: "Emotional First Aid",
				number: "1201",
				href: "tel:1201",
			},
			{
				name: "NATAL",
				subtitle: "Trauma Helpline",
				number: "1-800-363-363",
				href: "tel:1800363363",
			},
			{
				name: "Crisis Line",
				subtitle: "Assault Support",
				number: "1202",
				href: "tel:1202",
			},
			{
				name: "United Hatzalah",
				subtitle: "Volunteer EMS",
				number: "1221",
				href: "tel:1221",
			},
			{
				name: "Yedidim",
				subtitle: "Roadside Aid",
				number: "1230",
				href: "tel:1230",
			},
			{
				name: "Home Front",
				subtitle: "Emergency Info",
				number: "104",
				href: "tel:104",
			},
			{ name: "MDA", subtitle: "Ambulance", number: "101", href: "tel:101" },
			{ name: "Police", subtitle: "Emergency", number: "100", href: "tel:100" },
		],
	},
	ar: {
		dir: "rtl",
		heading: "خطوط الطوارئ والدعم النفسي في إسرائيل (24/7)",
		poweredBy: "بإشراف مشروع لينك لإسرائيل مفتوح المصدر",
		items: [
			{
				name: "عيران (ERAN)",
				subtitle: "دعم نفسي بالعربية",
				number: "1201",
				href: "tel:1201",
			},
			{
				name: "نطال (NATAL)",
				subtitle: "طوارئ وصدمات",
				number: "1-800-363-363",
				href: "tel:1800363363",
			},
			{
				name: "خط الدعم",
				subtitle: "طوارئ 24/7",
				number: "1202",
				href: "tel:1202",
			},
			{
				name: "إيحود هتسالا",
				subtitle: "إسعاف طبي",
				number: "1221",
				href: "tel:1221",
			},
			{
				name: "يديديم",
				subtitle: "مساعدة طرق",
				number: "1230",
				href: "tel:1230",
			},
			{
				name: "الجبهة الداخلية",
				subtitle: "معلومات",
				number: "104",
				href: "tel:104",
			},
			{ name: "نجمة داوود", subtitle: "إسعاف", number: "101", href: "tel:101" },
			{ name: "الشرطة", subtitle: "طوارئ", number: "100", href: "tel:100" },
		],
	},
	ru: {
		dir: "ltr",
		heading: "Круглосуточные горячие линии Израиля (24/7)",
		poweredBy: "Обновляется открытым проектом Links For Israel",
		items: [
			{
				name: "ЭРАН",
				subtitle: "Психолог 24/7 (рус.)",
				number: "1201",
				href: "tel:1201",
			},
			{
				name: "НАТАЛЬ",
				subtitle: "Помощь при травме",
				number: "1-800-363-363",
				href: "tel:1800363363",
			},
			{
				name: "Кризис-линия",
				subtitle: "Поддержка 24/7",
				number: "1202",
				href: "tel:1202",
			},
			{
				name: "Ихуд Ацала",
				subtitle: "Экстренная помощь",
				number: "1221",
				href: "tel:1221",
			},
			{
				name: "Едидим",
				subtitle: "Дорожная помощь",
				number: "1230",
				href: "tel:1230",
			},
			{
				name: "Служба тыла",
				subtitle: "Информация",
				number: "104",
				href: "tel:104",
			},
			{
				name: "МАДА",
				subtitle: "Скорая помощь",
				number: "101",
				href: "tel:101",
			},
			{
				name: "Полиция",
				subtitle: "Экстренно",
				number: "100",
				href: "tel:100",
			},
		],
	},
};

export default function EmbedHotlinesPage() {
	const [lang, setLang] = useState<EmbedLang>("he");
	const [compact, setCompact] = useState(false);
	const toast = useToast();

	useEffect(() => {
		const params = getUrlParams();
		const qLang = params.get("lang") as EmbedLang | null;
		if (qLang && qLang in HOTLINES_BY_LANG) {
			setLang(qLang);
		}
		setCompact(params.get("compact") === "1");
	}, []);

	const cfg = HOTLINES_BY_LANG[lang];
	const embedUrl = `https://www.linksforisrael.com/embed/hotlines?lang=${lang}&compact=1`;
	const iframeSnippet = `<iframe src="${embedUrl}" title="${cfg.heading}" style="width:100%;min-height:150px;border:0;border-radius:12px;" loading="lazy"></iframe>`;

	const handleSelectLang = (next: EmbedLang) => {
		setLang(next);
		updateUrlParams({ lang: next === "he" ? null : next });
	};

	const copySnippet = async () => {
		try {
			await navigator.clipboard.writeText(iframeSnippet);
			toast({
				title: lang === "he" ? "קוד ההטמעה הועתק!" : "Embed snippet copied!",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		} catch {
			// Ignore
		}
	};

	const widgetCard = (
		<Box
			bg="white"
			borderRadius="xl"
			borderWidth="1px"
			borderColor="gray.200"
			boxShadow="xs"
			p={{ base: 3.5, md: 4 }}
			dir={cfg.dir}
		>
			<Flex align="center" justify="space-between" wrap="wrap" gap={2} mb={3}>
				<Flex align="center" gap={2}>
					<Flex
						align="center"
						justify="center"
						boxSize="26px"
						borderRadius="full"
						bg="red.50"
						color="red.600"
					>
						<Icon as={FaPhoneAlt} boxSize={3} />
					</Flex>
					<Text fontSize="sm" fontWeight="bold" color="gray.800">
						{cfg.heading}
					</Text>
				</Flex>

				<Link
					href={
						lang === "he"
							? "https://www.linksforisrael.com/"
							: `https://www.linksforisrael.com/${lang}`
					}
					isExternal
					fontSize="xs"
					color="brand.600"
					fontWeight="semibold"
					display="inline-flex"
					alignItems="center"
					gap={1}
					_hover={{ textDecoration: "underline" }}
				>
					<span>{cfg.poweredBy}</span>
					<Icon as={FaExternalLinkAlt} boxSize={2.5} />
				</Link>
			</Flex>

			<Flex wrap="wrap" gap={2}>
				{cfg.items.map((h) => (
					<Link
						key={h.number}
						href={h.href}
						_hover={{ textDecoration: "none" }}
					>
						<Flex
							align="center"
							gap={2}
							px={3}
							py={1.5}
							borderRadius="full"
							bg="gray.50"
							borderWidth="1px"
							borderColor="gray.200"
							transition="all 0.15s ease"
							_hover={{
								bg: "brand.50",
								borderColor: "brand.300",
								transform: "translateY(-1px)",
							}}
						>
							<Text fontSize="xs" fontWeight="bold" color="gray.800">
								{h.name}
							</Text>
							<Text fontSize="xs" color="gray.500">
								{h.subtitle}
							</Text>
							<Text fontSize="xs" fontWeight="bold" color="brand.600" dir="ltr">
								{h.number}
							</Text>
						</Flex>
					</Link>
				))}
			</Flex>
		</Box>
	);

	// Compact iframe mode — pure widget with zero surrounding page chrome
	if (compact) {
		return <Box p={2}>{widgetCard}</Box>;
	}

	return (
		<Box py={{ base: 6, md: 10 }} px={4} dir="rtl">
			<Container maxW="920px">
				<Flex justify="space-between" align="center" wrap="wrap" gap={3} mb={6}>
					<Box>
						<Badge colorScheme="blue" borderRadius="full" px={3} py={1} mb={2}>
							ווידג׳ט פתוח וחינמי להטמעה
						</Badge>
						<Heading as="h1" size="lg" color="brand.700">
							הטמעת סרגל מוקדי חירום וסיוע באתר שלכם
						</Heading>
						<Text fontSize="sm" color="gray.600" mt={1}>
							אתרי תוכן, קהילות, חברות ועמותות יכולים להטמיע את סרגל מוקדי
							החירום המתעדכן של לינק לישראל ב-4 שפות (עברית, אנגלית, ערבית
							ורוסית).
						</Text>
					</Box>
					<Button
						as={NextLink}
						href="/"
						size="sm"
						variant="outline"
						colorScheme="blue"
						borderRadius="full"
					>
						חזרה לפורטל
					</Button>
				</Flex>

				{/* Language Selector */}
				<HStack spacing={2} mb={4}>
					{(["he", "en"] as EmbedLang[]).map((code) => (
						<Button
							key={code}
							size="xs"
							borderRadius="full"
							colorScheme="blue"
							variant={lang === code ? "solid" : "outline"}
							onClick={() => handleSelectLang(code)}
						>
							{code === "he" ? "עברית" : "English"}
						</Button>
					))}
				</HStack>

				{/* Live Preview */}
				<Box mb={6}>{widgetCard}</Box>

				{/* Copyable Snippet */}
				<Box
					bg="gray.50"
					borderRadius="xl"
					borderWidth="1px"
					borderColor="gray.200"
					p={5}
				>
					<Flex
						align="center"
						justify="space-between"
						mb={3}
						wrap="wrap"
						gap={2}
					>
						<Flex align="center" gap={2}>
							<Icon as={FaCode} color="brand.600" />
							<Text fontSize="sm" fontWeight="bold" color="gray.800">
								קוד הטמעה (HTML / iframe)
							</Text>
						</Flex>
						<Button
							size="xs"
							colorScheme="blue"
							borderRadius="full"
							leftIcon={<Icon as={FaCopy} />}
							onClick={copySnippet}
						>
							העתק קוד
						</Button>
					</Flex>
					<Code
						display="block"
						whiteSpace="pre-wrap"
						p={3}
						borderRadius="lg"
						bg="white"
						borderWidth="1px"
						borderColor="gray.200"
						fontSize="xs"
						dir="ltr"
						textAlign="left"
					>
						{iframeSnippet}
					</Code>
				</Box>
			</Container>
		</Box>
	);
}
