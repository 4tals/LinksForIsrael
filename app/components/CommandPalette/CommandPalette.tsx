"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	FaCheckCircle,
	FaCompass,
	FaExclamationTriangle,
	FaGlobe,
	FaMagic,
	FaPhoneAlt,
	FaPrint,
	FaSearch,
} from "react-icons/fa";

import {
	Category,
	computeInitiativeRankScore,
	InitiativeLink,
} from "@/app/utils/categories";
import { expandSearchSynonyms } from "@/app/utils/searchSynonyms";
import {
	Badge,
	Box,
	Flex,
	HStack,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Kbd,
	Link,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Text,
	VStack,
} from "@chakra-ui/react";

interface QuickHotline {
	id: string;
	name: string;
	subtitle: string;
	number: string;
	href: string;
	keywords: string[];
}

const PALETTE_HOTLINES: QuickHotline[] = [
	{
		id: "h-1201",
		name: "ער״ן — עזרה ראשונה נפשית 24/7",
		subtitle: "שיחה אנונימית חינם בכל שעה",
		number: "1201",
		href: "tel:1201",
		keywords: [
			"1201",
			"ערן",
			"חרדה",
			"דיכאון",
			"נפשי",
			"מצוקה",
			"eran",
			"mental",
		],
	},
	{
		id: "h-natal",
		name: "נט״ל — קו הסיוע לטראומה וחרדה",
		subtitle: "סיוע נפשי לנפגעי טראומה ולוחמים",
		number: "1-800-363-363",
		href: "tel:1800363363",
		keywords: ["נטל", "טראומה", "פוסט טראומה", "ptsd", "חרדה", "natal"],
	},
	{
		id: "h-1202",
		name: "מרכזי הסיוע לנפגעות ולנפגעי תקיפה מינית",
		subtitle: "מענה 24/7 לנשים (1202) ולגברים (1203)",
		number: "1202",
		href: "tel:1202",
		keywords: ["1202", "1203", "תקיפה", "אלימות", "מינית", "נשים"],
	},
	{
		id: "h-1221",
		name: "איחוד הצלה — חירום רפואי מתנדבים",
		subtitle: "מענה רפואי מהיר 24/7",
		number: "1221",
		href: "tel:1221",
		keywords: ["1221", "איחוד", "הצלה", "רפואי", "אמבולנס", "hatzalah"],
	},
	{
		id: "h-1230",
		name: "ידידים — סיוע בדרכים ובבית",
		subtitle: "פנצ׳ר, מצבר, פתיחת רכב — חינם",
		number: "1230",
		href: "tel:1230",
		keywords: ["1230", "ידידים", "דרכים", "רכב", "פנצר", "מצבר", "yedidim"],
	},
	{
		id: "h-104",
		name: "פיקוד העורף — מוקד מידע וחירום",
		subtitle: "הנחיות התגוננות ומרחבים מוגנים",
		number: "104",
		href: "tel:104",
		keywords: ["104", "פיקוד העורף", "אזעקה", "מקלט", "ממד", "חירום", "oref"],
	},
	{
		id: "h-101",
		name: "מד״א — מגן דוד אדום",
		subtitle: "אמבולנס וחירום רפואי",
		number: "101",
		href: "tel:101",
		keywords: ["101", "מדא", "אמבולנס", "רפואי", "mda"],
	},
	{
		id: "h-100",
		name: "משטרת ישראל",
		subtitle: "מוקד חירום ארצי",
		number: "100",
		href: "tel:100",
		keywords: ["100", "משטרה", "חירום", "police"],
	},
];

interface FlatInitiative {
	link: InitiativeLink;
	categoryId: string;
	categoryName: string;
	subCategoryName: string;
	rankScore: number;
	searchBlob: string;
}

interface PaletteItem {
	id: string;
	kind: "hotline" | "initiative" | "category" | "action";
	title: string;
	subtitle?: string;
	badge?: string;
	badgeColor?: string;
	href?: string;
	tel?: string;
	onRun?: () => void;
}

export function CommandPalette({
	isOpen,
	onClose,
	categories,
	onOpenHelper,
	onOpenEmergency,
}: {
	isOpen: boolean;
	onClose: () => void;
	categories: Category[];
	onOpenHelper: () => void;
	onOpenEmergency: () => void;
}) {
	const [query, setQuery] = useState("");
	const [selectedIdx, setSelectedIdx] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const allInitiatives = useMemo<FlatInitiative[]>(() => {
		const list: FlatInitiative[] = [];
		for (const cat of categories) {
			for (const sub of cat.subCategories) {
				for (const link of sub.links) {
					const blob = [
						link.displayName,
						link.name,
						link.shortDescription,
						link.description,
						link.url,
						link.website,
						link.phone,
						cat.displayName,
						sub.displayName,
						...(link.tags || []),
						...(link.references || []).map((r) => r.source || ""),
					]
						.filter(Boolean)
						.join(" ")
						.toLowerCase();

					list.push({
						link,
						categoryId: cat.id,
						categoryName: cat.displayName,
						subCategoryName: sub.name,
						rankScore: computeInitiativeRankScore(link),
						searchBlob: blob,
					});
				}
			}
		}
		return list.sort((a, b) => b.rankScore - a.rankScore);
	}, [categories]);

	useEffect(() => {
		if (isOpen) {
			setQuery("");
			setSelectedIdx(0);
			setTimeout(() => inputRef.current?.focus(), 30);
		}
	}, [isOpen]);

	const results = useMemo<PaletteItem[]>(() => {
		const q = query.trim().toLowerCase();

		if (!q) {
			const actions: PaletteItem[] = [
				{
					id: "act-helper",
					kind: "action",
					title: "עזרו לי למצוא ב-10 שניות (אשף מותאם)",
					subtitle: "2 שאלות קצרות → 4 המקומות הכי מדויקים עבורך",
					badge: "מומלץ",
					badgeColor: "blue",
					onRun: () => {
						onClose();
						onOpenHelper();
					},
				},
				{
					id: "act-emergency",
					kind: "action",
					title: "מצב חירום שקט — מוקדי הצלה וסיוע 24/7",
					subtitle: "תצוגה נקייה ומוגדלת לרגעי חירום ואזעקה",
					badge: "חירום",
					badgeColor: "red",
					onRun: () => {
						onClose();
						onOpenEmergency();
					},
				},
				{
					id: "act-print",
					kind: "action",
					title: "הדפסת דף חירום למקרר / לממ״ד",
					subtitle: "עמוד A4 מוכן להדפסה עם כל מוקדי החירום וקוד QR",
					badge: "הדפסה",
					badgeColor: "teal",
					href: "/print",
				},
				{
					id: "act-en",
					kind: "action",
					title: "English / العربية / Русский Portals",
					subtitle: "Switch to English Diaspora portal (/en)",
					badge: "4 שפות",
					badgeColor: "purple",
					href: "/en",
				},
			];

			const topCategories: PaletteItem[] = categories.slice(0, 4).map((c) => ({
				id: `cat-${c.id}`,
				kind: "category",
				title: c.displayName,
				subtitle: c.description,
				href: `/${encodeURIComponent(c.id)}`,
			}));

			return [...actions, ...topCategories];
		}

		const synonyms = expandSearchSynonyms(q);
		const items: PaletteItem[] = [];

		// 1. Direct hotlines first if matched
		for (const h of PALETTE_HOTLINES) {
			const hay =
				`${h.name} ${h.subtitle} ${h.number} ${h.keywords.join(" ")}`.toLowerCase();
			if (hay.includes(q) || synonyms.some((s) => hay.includes(s))) {
				items.push({
					id: h.id,
					kind: "hotline",
					title: `${h.name} (${h.number})`,
					subtitle: h.subtitle,
					badge: h.number,
					badgeColor: "green",
					tel: h.href,
				});
			}
		}

		// 2. Initiatives (direct matches first, then synonym matches)
		const directMatches: FlatInitiative[] = [];
		const synonymMatches: FlatInitiative[] = [];
		for (const entry of allInitiatives) {
			if (entry.searchBlob.includes(q)) {
				directMatches.push(entry);
			} else if (synonyms.some((s) => entry.searchBlob.includes(s))) {
				synonymMatches.push(entry);
			}
		}

		for (const entry of [...directMatches, ...synonymMatches].slice(0, 8)) {
			items.push({
				id: `init-${entry.categoryId}-${entry.link.name}`,
				kind: "initiative",
				title: entry.link.displayName,
				subtitle: `${entry.categoryName} · ${entry.link.shortDescription || ""}`,
				badge: entry.link.properManagement
					? "ניהול תקין"
					: entry.link.verified
						? "מאומת"
						: undefined,
				badgeColor: entry.link.properManagement ? "teal" : "green",
				href: `/${encodeURIComponent(entry.categoryId)}?card=${encodeURIComponent(
					entry.link.name,
				)}`,
			});
		}

		// 3. Matching categories
		for (const cat of categories) {
			const blob =
				`${cat.displayName} ${cat.description} ${cat.id}`.toLowerCase();
			if (blob.includes(q)) {
				items.push({
					id: `cat-${cat.id}`,
					kind: "category",
					title: `קטגוריה: ${cat.displayName}`,
					subtitle: cat.description,
					href: `/${encodeURIComponent(cat.id)}`,
				});
			}
		}

		return items.slice(0, 12);
	}, [
		query,
		categories,
		allInitiatives,
		onClose,
		onOpenHelper,
		onOpenEmergency,
	]);

	useEffect(() => {
		setSelectedIdx(0);
	}, [query]);

	const runItem = (item: PaletteItem) => {
		if (item.onRun) {
			item.onRun();
			return;
		}
		if (item.tel) {
			window.location.href = item.tel;
			onClose();
			return;
		}
		if (item.href) {
			router.push(item.href);
			onClose();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIdx((i) => Math.min(results.length - 1, i + 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIdx((i) => Math.max(0, i - 1));
		} else if (e.key === "Enter" && results[selectedIdx]) {
			e.preventDefault();
			runItem(results[selectedIdx]);
		}
	};

	const renderIcon = (item: PaletteItem) => {
		if (item.kind === "hotline")
			return <Icon as={FaPhoneAlt} color="green.600" boxSize={3.5} />;
		if (item.id === "act-helper")
			return <Icon as={FaMagic} color="brand.600" boxSize={3.5} />;
		if (item.id === "act-emergency")
			return <Icon as={FaExclamationTriangle} color="red.500" boxSize={3.5} />;
		if (item.id === "act-print")
			return <Icon as={FaPrint} color="teal.600" boxSize={3.5} />;
		if (item.id === "act-en")
			return <Icon as={FaGlobe} color="purple.600" boxSize={3.5} />;
		if (item.kind === "category")
			return <Icon as={FaCompass} color="brand.500" boxSize={3.5} />;
		return <Icon as={FaCheckCircle} color="green.500" boxSize={3.5} />;
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl" motionPreset="scale">
			<ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
			<ModalContent
				dir="rtl"
				mx={3}
				mt={{ base: "6vh", md: "10vh" }}
				borderRadius="2xl"
				overflow="hidden"
				boxShadow="2xl"
				borderWidth="1px"
				borderColor="gray.200"
			>
				<Box borderBottomWidth="1px" borderColor="gray.200" p={3}>
					<InputGroup size="lg">
						<InputLeftElement pointerEvents="none" color="gray.400">
							<Icon as={FaSearch} boxSize={4} />
						</InputLeftElement>
						<Input
							ref={inputRef}
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="חפשו עמותה, מוקד (1201), מצב (חרדה, אוכל, מילואים, זכויות)..."
							variant="unstyled"
							ps={10}
							pe={3}
							py={2}
							fontSize="md"
							aria-label="חיפוש מהיר בכל הפורטל"
						/>
					</InputGroup>
				</Box>

				<ModalBody p={2} maxH="60vh" overflowY="auto">
					{results.length === 0 ? (
						<Box py={10} textAlign="center" color="gray.500">
							<Text fontSize="sm" fontWeight="semibold" mb={1}>
								לא נמצאו תוצאות עבור &quot;{query}&quot;
							</Text>
							<Text fontSize="xs">
								נסו מילים כמו: סיוע נפשי, 1201, אוכל, מילואים, סעיף 46, זכויות
								או התנדבות
							</Text>
						</Box>
					) : (
						<VStack spacing={1} align="stretch">
							{results.map((item, idx) => {
								const active = idx === selectedIdx;
								const content = (
									<Flex
										align="center"
										justify="space-between"
										gap={3}
										px={3.5}
										py={2.5}
										borderRadius="xl"
										bg={active ? "brand.50" : "transparent"}
										borderWidth="1px"
										borderColor={active ? "brand.200" : "transparent"}
										cursor="pointer"
										onMouseEnter={() => setSelectedIdx(idx)}
										onClick={() => runItem(item)}
										transition="background 0.12s ease"
									>
										<Flex align="center" gap={3} minW={0} flex="1">
											<Flex
												boxSize="32px"
												minW="32px"
												borderRadius="lg"
												bg={active ? "white" : "gray.100"}
												align="center"
												justify="center"
											>
												{renderIcon(item)}
											</Flex>
											<Box minW={0} flex="1">
												<Text
													fontSize="sm"
													fontWeight="bold"
													color="gray.900"
													noOfLines={1}
												>
													{item.title}
												</Text>
												{item.subtitle && (
													<Text fontSize="xs" color="gray.500" noOfLines={1}>
														{item.subtitle}
													</Text>
												)}
											</Box>
										</Flex>

										{item.badge && (
											<Badge
												colorScheme={item.badgeColor || "blue"}
												variant="subtle"
												borderRadius="full"
												px={2.5}
												py={0.5}
												fontSize="2xs"
												flexShrink={0}
											>
												{item.badge}
											</Badge>
										)}
									</Flex>
								);

								return item.tel ? (
									<Link
										key={item.id}
										href={item.tel}
										_hover={{ textDecoration: "none" }}
										onClick={() => onClose()}
									>
										{content}
									</Link>
								) : (
									<Box key={item.id}>{content}</Box>
								);
							})}
						</VStack>
					)}
				</ModalBody>

				<Flex
					bg="gray.50"
					borderTopWidth="1px"
					borderColor="gray.200"
					px={4}
					py={2}
					align="center"
					justify="space-between"
					fontSize="2xs"
					color="gray.500"
				>
					<HStack spacing={2}>
						<span>ניווט:</span>
						<Kbd>↑</Kbd>
						<Kbd>↓</Kbd>
						<Kbd>Enter</Kbd>
						<span>לסגירה:</span>
						<Kbd>Esc</Kbd>
					</HStack>
					<Text fontWeight="medium">
						{allInitiatives.length} יוזמות · 8 מוקדי 24/7
					</Text>
				</Flex>
			</ModalContent>
		</Modal>
	);
}
