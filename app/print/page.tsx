"use client";

import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { FaArrowRight, FaPhoneAlt, FaPrint } from "react-icons/fa";

import { Logo } from "@/app/components/Logo";
import { getUrlParams, updateUrlParams } from "@/app/utils/urlState";
import {
	Badge,
	Box,
	Button,
	Container,
	Flex,
	Heading,
	HStack,
	Icon,
	SimpleGrid,
	Text,
} from "@chakra-ui/react";

type PrintLang = "he" | "en" | "ar" | "ru";

interface PrintableInitiative {
	name: string;
	displayName: string;
	shortDescription?: string;
	phone?: string | null;
	url?: string | null;
}

const PRINT_HOTLINES: Record<
	PrintLang,
	{
		dir: "rtl" | "ltr";
		title: string;
		subtitle: string;
		printBtn: string;
		backBtn: string;
		customHeading: string;
		footer: string;
		items: Array<{ name: string; desc: string; number: string }>;
	}
> = {
	he: {
		dir: "rtl",
		title: "דף חירום וסיוע לממ״ד ולמקרר — ישראל 24/7",
		subtitle:
			"מוקדי הצלה, בריאות הנפש וסיוע אזרחי מאומתים · linksforisrael.com",
		printBtn: "הדפס / שמור כ-PDF",
		backBtn: "חזרה לפורטל",
		customHeading: "הרשימה האישית שנבחרה להדפסה:",
		footer:
			"מתעדכן שוטף ע״י קהילת הקוד הפתוח של לינק לישראל — https://www.linksforisrael.com",
		items: [
			{ name: "משטרת ישראל", desc: "חירום וביטחון", number: "100" },
			{
				name: "מגן דוד אדום (מד״א)",
				desc: "אמבולנס וחירום רפואי",
				number: "101",
			},
			{ name: "כבאות והצלה", desc: "שריפות וחילוץ", number: "102" },
			{
				name: "פיקוד העורף",
				desc: "הנחיות התגוננות ומרחב מוגן",
				number: "104",
			},
			{
				name: "ער״ן — סיוע נפשי 24/7",
				desc: "עזרה ראשונה נפשית (עברית, ערבית, רוסית, אנגלית)",
				number: "1201",
			},
			{
				name: "נט״ל — טראומה וחרדה",
				desc: "סיוע נפשי לנפגעי חרדה וטראומה",
				number: "1-800-363-363",
			},
			{
				name: "מרכז סיוע לתקיפה מינית",
				desc: "נשים 24/7 (1202) · גברים (1203)",
				number: "1202",
			},
			{
				name: "איחוד הצלה",
				desc: "חובשים ופרמדיקים בהגעה מיידית",
				number: "1221",
			},
			{ name: "ידידים", desc: "סיוע חינם בדרכים ובבית", number: "1230" },
			{
				name: "מוקד 105 (מטה לאומי)",
				desc: "הגנה על ילדים ובני נוער ברשת",
				number: "105",
			},
		],
	},
	en: {
		dir: "ltr",
		title: "Israel 24/7 Emergency & Crisis Hotlines — Printable Sheet",
		subtitle:
			"Keep in your safe room (Mamad) or on the fridge · linksforisrael.com/en",
		printBtn: "Print / Save as PDF",
		backBtn: "Back to Portal",
		customHeading: "Selected Organizations:",
		footer:
			"Continuously verified open-source civic directory — https://www.linksforisrael.com/en",
		items: [
			{ name: "Israel Police", desc: "Security & emergency", number: "100" },
			{
				name: "Magen David Adom (MDA)",
				desc: "Ambulance & medical EMS",
				number: "101",
			},
			{ name: "Fire & Rescue", desc: "Fire & emergency rescue", number: "102" },
			{
				name: "Home Front Command",
				desc: "Alerts & shelter guidance",
				number: "104",
			},
			{
				name: "ERAN Emotional First Aid",
				desc: "Free anonymous 24/7 (EN/HE/AR/RU)",
				number: "1201",
			},
			{
				name: "NATAL Trauma Helpline",
				desc: "Trauma & anxiety support 24/7",
				number: "1-800-363-363",
			},
			{
				name: "Sexual Assault Crisis",
				desc: "Women (1202) · Men (1203) 24/7",
				number: "1202",
			},
			{
				name: "United Hatzalah",
				desc: "Volunteer EMS rapid response",
				number: "1221",
			},
			{
				name: "Yedidim Roadside Aid",
				desc: "Free non-medical roadside/home aid",
				number: "1230",
			},
			{
				name: "Hotline 105",
				desc: "Child online safety emergency",
				number: "105",
			},
		],
	},
	ar: {
		dir: "rtl",
		title: "ورقة الطوارئ والخطوط الساخنة في إسرائيل (24/7) — للطباعة",
		subtitle: "للثلاجة أو الغرفة الآمنة (المماد) · linksforisrael.com/ar",
		printBtn: "طباعة / حفظ PDF",
		backBtn: "العودة للبوابة",
		customHeading: "المنظمات المختارة:",
		footer:
			"دليل مجتمعي مفتوح المصدر وموثق — https://www.linksforisrael.com/ar",
		items: [
			{ name: "الشرطة الإسرائيلية", desc: "طوارئ وأمن", number: "100" },
			{ name: "نجمة داوود الحمراء", desc: "إسعاف وطوارئ طبية", number: "101" },
			{ name: "الإطفاء والإنقاذ", desc: "حرائق وإنقاذ", number: "102" },
			{
				name: "الجبهة الداخلية",
				desc: "إرشادات الطوارئ والملاجئ",
				number: "104",
			},
			{
				name: "عيران (ERAN) دعم نفسي",
				desc: "مجاني وسري 24/7 باللغة العربية",
				number: "1201",
			},
			{
				name: "نطال (NATAL)",
				desc: "دعم للصدمات والقلق",
				number: "1-800-363-363",
			},
			{ name: "دعم ضحايا الاعتداء", desc: "خط سري 24/7", number: "1202" },
			{ name: "إيحود هتسالا", desc: "إسعاف تطوعي سريع", number: "1221" },
			{ name: "يديديم", desc: "مساعدة مجانية على الطرق", number: "1230" },
			{ name: "الخط 105", desc: "حماية الأطفال على الإنترنت", number: "105" },
		],
	},
	ru: {
		dir: "ltr",
		title:
			"Экстренные линии Израиля 24/7 — Памятка для печати (МАМАД / холодильник)",
		subtitle:
			"Проверенные телефоны экстренной и психологической помощи · linksforisrael.com/ru",
		printBtn: "Печать / Сохранить PDF",
		backBtn: "Назад на портал",
		customHeading: "Выбранные организации:",
		footer:
			"Открытый общественный справочник — https://www.linksforisrael.com/ru",
		items: [
			{
				name: "Полиция Израиля",
				desc: "Экстренная безопасность",
				number: "100",
			},
			{
				name: "МАДА (Скорая помощь)",
				desc: "Медицинская помощь 24/7",
				number: "101",
			},
			{ name: "Пожарная служба", desc: "Пожары и спасение", number: "102" },
			{
				name: "Командование тыла",
				desc: "Инструкции при тревоге",
				number: "104",
			},
			{
				name: "ЭРАН (Психолог 24/7)",
				desc: "Бесплатно на русском, иврите, арабском",
				number: "1201",
			},
			{
				name: "НАТАЛЬ",
				desc: "Помощь при травме и стрессе",
				number: "1-800-363-363",
			},
			{
				name: "Кризис-линия",
				desc: "Женщины (1202) · Мужчины (1203)",
				number: "1202",
			},
			{ name: "Ихуд Ацала", desc: "Волонтёры-парамедики 24/7", number: "1221" },
			{ name: "Едидим", desc: "Бесплатная помощь на дорогах", number: "1230" },
			{ name: "Линия 105", desc: "Защита детей в интернете", number: "105" },
		],
	},
};

export default function PrintSheetPage() {
	const [lang, setLang] = useState<PrintLang>("he");
	const [customItems, setCustomItems] = useState<PrintableInitiative[]>([]);

	useEffect(() => {
		const params = getUrlParams();
		const qLang = params.get("lang") as PrintLang | null;
		if (qLang && qLang in PRINT_HOTLINES) {
			setLang(qLang);
		}

		const rawList = params.get("list") || "";
		const ids = rawList
			.split(",")
			.map((s) => s.trim().toLowerCase())
			.filter(Boolean);

		if (ids.length > 0) {
			fetch("/api/v1/initiatives.json")
				.then((r) => r.json())
				.then((data) => {
					const byName = new Map<string, PrintableInitiative>();
					for (const item of data.initiatives || []) {
						byName.set(String(item.name).toLowerCase(), item);
					}
					const picked = ids
						.map((id) => byName.get(id))
						.filter((x): x is PrintableInitiative => Boolean(x));
					setCustomItems(picked);
				})
				.catch(() => {});
		}
	}, []);

	const cfg = PRINT_HOTLINES[lang];

	const selectLang = (next: PrintLang) => {
		setLang(next);
		updateUrlParams({ lang: next === "he" ? null : next });
	};

	return (
		<Box bg="white" minH="100vh" py={{ base: 4, md: 6 }} px={4} dir={cfg.dir}>
			{/* Screen-only toolbar (hidden in print) */}
			<Container maxW="900px" mb={5} className="no-print">
				<Flex
					align="center"
					justify="space-between"
					wrap="wrap"
					gap={3}
					p={3.5}
					bg="gray.50"
					borderRadius="xl"
					borderWidth="1px"
					borderColor="gray.200"
				>
					<HStack spacing={2}>
						<Button
							as={NextLink}
							href="/"
							size="sm"
							variant="ghost"
							leftIcon={<Icon as={FaArrowRight} />}
							borderRadius="full"
						>
							{cfg.backBtn}
						</Button>
						{(["he", "en", "ar", "ru"] as PrintLang[]).map((code) => (
							<Button
								key={code}
								size="xs"
								borderRadius="full"
								colorScheme="blue"
								variant={lang === code ? "solid" : "outline"}
								onClick={() => selectLang(code)}
							>
								{code === "he"
									? "עברית"
									: code === "en"
										? "EN"
										: code === "ar"
											? "العربية"
											: "RU"}
							</Button>
						))}
					</HStack>

					<Button
						colorScheme="blue"
						bg="brand.600"
						size="sm"
						borderRadius="full"
						leftIcon={<Icon as={FaPrint} />}
						onClick={() => window.print()}
					>
						{cfg.printBtn}
					</Button>
				</Flex>
			</Container>

			{/* Printable A4 Emergency Sheet */}
			<Container
				maxW="900px"
				p={{ base: 5, md: 8 }}
				borderWidth="2px"
				borderColor="brand.600"
				borderRadius="2xl"
				bg="white"
			>
				<Flex
					align="center"
					justify="space-between"
					pb={4}
					mb={5}
					borderBottomWidth="2px"
					borderColor="brand.100"
					gap={4}
				>
					<Flex align="center" gap={3}>
						<Logo width={42} height={48} />
						<Box>
							<Heading as="h1" size="md" color="brand.700">
								{cfg.title}
							</Heading>
							<Text fontSize="xs" color="gray.600" mt={0.5}>
								{cfg.subtitle}
							</Text>
						</Box>
					</Flex>
					<Badge
						colorScheme="red"
						variant="solid"
						fontSize="xs"
						px={3}
						py={1}
						borderRadius="full"
					>
						24/7
					</Badge>
				</Flex>

				<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} mb={6}>
					{cfg.items.map((item) => (
						<Flex
							key={item.number}
							align="center"
							justify="space-between"
							p={3.5}
							borderRadius="xl"
							borderWidth="1px"
							borderColor="gray.300"
							gap={3}
						>
							<Box>
								<Text fontWeight="bold" fontSize="sm" color="gray.900">
									{item.name}
								</Text>
								<Text fontSize="xs" color="gray.600">
									{item.desc}
								</Text>
							</Box>
							<Flex
								align="center"
								gap={1.5}
								px={3}
								py={1}
								bg="brand.50"
								borderRadius="lg"
								flexShrink={0}
							>
								<Icon as={FaPhoneAlt} boxSize={3} color="brand.600" />
								<Text
									fontWeight="extrabold"
									fontSize="md"
									color="brand.700"
									dir="ltr"
								>
									{item.number}
								</Text>
							</Flex>
						</Flex>
					))}
				</SimpleGrid>

				{customItems.length > 0 && (
					<Box mb={6} pt={4} borderTopWidth="1px" borderColor="gray.200">
						<Heading as="h2" size="sm" color="gray.800" mb={3}>
							{cfg.customHeading}
						</Heading>
						<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
							{customItems.map((item) => (
								<Box
									key={item.name}
									p={3}
									borderRadius="lg"
									borderWidth="1px"
									borderColor="gray.200"
								>
									<Flex justify="space-between" align="center" gap={2}>
										<Text fontWeight="bold" fontSize="sm">
											{item.displayName}
										</Text>
										{item.phone && (
											<Text
												fontWeight="bold"
												fontSize="xs"
												color="green.700"
												dir="ltr"
											>
												{item.phone}
											</Text>
										)}
									</Flex>
									{item.shortDescription && (
										<Text fontSize="xs" color="gray.600" mt={0.5}>
											{item.shortDescription}
										</Text>
									)}
									{item.url && (
										<Text fontSize="2xs" color="brand.600" mt={1} dir="ltr">
											{item.url}
										</Text>
									)}
								</Box>
							))}
						</SimpleGrid>
					</Box>
				)}

				<Flex
					pt={3}
					borderTopWidth="1px"
					borderColor="gray.200"
					justify="space-between"
					align="center"
					wrap="wrap"
					gap={2}
					fontSize="xs"
					color="gray.500"
				>
					<Text>{cfg.footer}</Text>
					<Text dir="ltr" fontWeight="bold" color="brand.700">
						www.linksforisrael.com
					</Text>
				</Flex>
			</Container>
		</Box>
	);
}
