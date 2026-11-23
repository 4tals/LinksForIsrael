"use client";

import NextLink from "next/link";
import React, { useMemo, useState } from "react";
import {
	FaArrowRight,
	FaBookmark,
	FaCheckCircle,
	FaExternalLinkAlt,
	FaHandHoldingHeart,
	FaHandsHelping,
	FaHeart,
	FaLifeRing,
	FaMagic,
	FaPhoneAlt,
	FaShareAlt,
	FaShieldAlt,
} from "react-icons/fa";

import { useBookmarks } from "@/app/components/Bookmarks/BookmarksContext";
import {
	Category,
	computeInitiativeRankScore,
	getInitiativeIntents,
	getPrimaryInitiativeUrl,
	InitiativeLink,
} from "@/app/utils/categories";
import { portalPath } from "@/app/utils/portalPath";
import { updateUrlParams } from "@/app/utils/urlState";
import {
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Icon,
	Link,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	SimpleGrid,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";

type NeedId =
	| "mental"
	| "defense"
	| "economic"
	| "rights"
	| "volunteer"
	| "donate";

type PrefId = "any" | "phone" | "verified46" | "whatsapp";

const NEEDS: Array<{
	id: NeedId;
	label: string;
	sub: string;
	icon: React.ElementType;
	color: string;
}> = [
	{
		id: "mental",
		label: "סיוע נפשי / מצוקה",
		sub: "חרדה, טראומה, תמיכה 24/7",
		icon: FaHeart,
		color: "red",
	},
	{
		id: "defense",
		label: "מילואים, פצועים וחירום",
		sub: "מענקים, זכויות, שיקום וציוד",
		icon: FaShieldAlt,
		color: "blue",
	},
	{
		id: "economic",
		label: "סיוע במזון וכלכלה",
		sub: "סלי מזון, הלוואות ללא ריבית, תקציב",
		icon: FaLifeRing,
		color: "green",
	},
	{
		id: "rights",
		label: "זכויות, עבודה וקהילה",
		sub: "ביטוח לאומי, זכויות עובדים, מוגבלויות",
		icon: FaCheckCircle,
		color: "orange",
	},
	{
		id: "volunteer",
		label: "רוצה להתנדב",
		sub: "עמותות, חקלאות, קהילה והצלה",
		icon: FaHandsHelping,
		color: "teal",
	},
	{
		id: "donate",
		label: "רוצה לתרום במקום אמין",
		sub: "ניהול תקין, סעיף 46 ושקיפות מלאה",
		icon: FaHandHoldingHeart,
		color: "purple",
	},
];

const PREFS: Array<{ id: PrefId; label: string; sub: string }> = [
	{ id: "any", label: "הכי רלוונטי ומומלץ", sub: "דירוג אימות וכיסוי מירבי" },
	{ id: "phone", label: "מוקד טלפוני מיידי", sub: "אפשר לחייג ולדבר עכשיו" },
	{
		id: "whatsapp",
		label: "וואטסאפ / אונליין",
		sub: "פנייה דיגיטלית מהירה ושקטה",
	},
	{
		id: "verified46",
		label: "עמותה מאומתת + סעיף 46",
		sub: "ניהול תקין וזיכוי מס",
	},
];

export function HelperWizardModal({
	isOpen,
	onClose,
	categories,
}: {
	isOpen: boolean;
	onClose: () => void;
	categories: Category[];
}) {
	const [need, setNeed] = useState<NeedId | null>(null);
	const [pref, setPref] = useState<PrefId | null>(null);
	const { toggleSave, isSaved } = useBookmarks();
	const toast = useToast();

	const matches = useMemo(() => {
		if (!need || !pref) return [];
		const all: Array<{
			link: InitiativeLink;
			categoryId: string;
			categoryName: string;
			score: number;
		}> = [];

		for (const cat of categories) {
			for (const sub of cat.subCategories) {
				for (const link of sub.links) {
					const intents = getInitiativeIntents(link, cat.id);
					let relevant = false;
					if (need === "mental" && cat.id === "Medical") relevant = true;
					if (need === "defense" && cat.id === "Defense") relevant = true;
					if (need === "economic" && cat.id === "Economic") relevant = true;
					if (
						need === "rights" &&
						(cat.id === "GeneralAssistance" || cat.id === "FamilyAndPets")
					) {
						relevant = true;
					}
					if (need === "volunteer" && intents.includes("volunteer")) {
						relevant = true;
					}
					if (need === "donate" && intents.includes("donate")) {
						relevant = true;
					}
					if (!relevant) continue;

					let bonus = 0;
					if (pref === "phone" && link.phone) bonus += 30;
					if (pref === "whatsapp" && (link.whatsapp || link.telegram))
						bonus += 25;
					if (pref === "verified46" && link.taxDeductible46 && link.verified)
						bonus += 35;
					if (need === "mental" && sub.name === "MentalSupport") bonus += 20;
					if (link.properManagement) bonus += 8;

					all.push({
						link,
						categoryId: cat.id,
						categoryName: cat.displayName,
						score: computeInitiativeRankScore(link) + bonus,
					});
				}
			}
		}

		return all.sort((a, b) => b.score - a.score).slice(0, 5);
	}, [need, pref, categories]);

	const handleClose = () => {
		updateUrlParams({ helper: null });
		onClose();
	};

	const handleReset = () => {
		setNeed(null);
		setPref(null);
	};

	const handleShareMatches = async () => {
		if (matches.length === 0 || typeof window === "undefined") return;
		const ids = matches.map((m) => m.link.name).join(",");
		const url = `${window.location.origin}/?list=${encodeURIComponent(ids)}`;
		try {
			await navigator.clipboard.writeText(url);
			toast({
				title: "קישור לתוצאות הועתק!",
				description: "אפשר לשלוח לחבר או לבן משפחה בוואטסאפ",
				status: "success",
				duration: 2400,
				isClosable: true,
			});
		} catch {
			// Ignore
		}
	};

	const handleSaveAll = () => {
		let added = 0;
		for (const m of matches) {
			if (!isSaved(m.link.name)) {
				toggleSave({
					name: m.link.name,
					displayName: m.link.displayName,
					shortDescription: m.link.shortDescription,
					url: getPrimaryInitiativeUrl(m.link),
					phone: m.link.phone,
					categoryId: m.categoryId,
				});
				added++;
			}
		}
		toast({
			title:
				added > 0 ? `נשמרו ${added} יוזמות לרשימה שלך` : "כולן כבר שמורות אצלך",
			status: "success",
			duration: 2000,
			isClosable: true,
		});
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="xl"
			isCentered
			scrollBehavior="inside"
		>
			<ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
			<ModalContent dir="rtl" mx={3} borderRadius="2xl" overflow="hidden">
				<ModalCloseButton left={3} right="unset" top={3.5} color="white" />
				<ModalHeader bg="brand.600" color="white" py={4} px={6}>
					<Flex align="center" gap={2}>
						<Icon as={FaMagic} />
						<span>עזרו לי למצוא ב-10 שניות</span>
					</Flex>
					<Text fontSize="xs" fontWeight="normal" color="blue.100" mt={1}>
						{!need
							? "שלב 1 מתוך 2 — מה הכי רלוונטי עבורך כרגע?"
							: !pref
								? "שלב 2 מתוך 2 — איך הכי נוח לפנות?"
								: "הנה 5 המקומות הכי מדויקים ומאומתים עבורך עכשיו:"}
					</Text>
				</ModalHeader>

				<ModalBody p={{ base: 4, md: 6 }}>
					{!need && (
						<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
							{NEEDS.map((n) => (
								<Flex
									key={n.id}
									as="button"
									type="button"
									onClick={() => setNeed(n.id)}
									align="flex-start"
									gap={3}
									p={4}
									borderRadius="xl"
									borderWidth="1px"
									borderColor="gray.200"
									bg="white"
									textAlign="right"
									cursor="pointer"
									transition="all 0.15s ease"
									_hover={{
										borderColor: `${n.color}.400`,
										bg: `${n.color}.50`,
										transform: "translateY(-1px)",
									}}
								>
									<Flex
										boxSize="36px"
										minW="36px"
										borderRadius="lg"
										bg={`${n.color}.50`}
										color={`${n.color}.600`}
										align="center"
										justify="center"
									>
										<Icon as={n.icon} boxSize={4} />
									</Flex>
									<Box>
										<Text fontWeight="bold" fontSize="sm" color="gray.900">
											{n.label}
										</Text>
										<Text fontSize="xs" color="gray.600">
											{n.sub}
										</Text>
									</Box>
								</Flex>
							))}
						</SimpleGrid>
					)}

					{need && !pref && (
						<VStack spacing={3} align="stretch">
							<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
								{PREFS.map((p) => (
									<Box
										key={p.id}
										as="button"
										type="button"
										onClick={() => setPref(p.id)}
										p={4}
										borderRadius="xl"
										borderWidth="1px"
										borderColor="gray.200"
										bg="white"
										textAlign="right"
										cursor="pointer"
										transition="all 0.15s ease"
										_hover={{
											borderColor: "brand.400",
											bg: "brand.50",
										}}
									>
										<Text fontWeight="bold" fontSize="sm" color="gray.900">
											{p.label}
										</Text>
										<Text fontSize="xs" color="gray.600" mt={0.5}>
											{p.sub}
										</Text>
									</Box>
								))}
							</SimpleGrid>
							<Button
								size="xs"
								variant="ghost"
								alignSelf="flex-start"
								leftIcon={<Icon as={FaArrowRight} />}
								onClick={() => setNeed(null)}
							>
								חזרה לשלב 1
							</Button>
						</VStack>
					)}

					{need && pref && (
						<VStack spacing={3} align="stretch">
							{matches.map(({ link, categoryId, categoryName }) => {
								const primary = getPrimaryInitiativeUrl(link);
								return (
									<Box
										key={link.name}
										p={4}
										borderRadius="xl"
										borderWidth="1px"
										borderColor="gray.200"
										bg="gray.50"
									>
										<Flex
											justify="space-between"
											align="flex-start"
											gap={2}
											mb={1.5}
										>
											<Box>
												<Flex align="center" gap={1.5} wrap="wrap">
													<Heading as="h4" size="sm" color="gray.900">
														{link.displayName}
													</Heading>
													{link.properManagement && (
														<Badge
															colorScheme="teal"
															borderRadius="full"
															fontSize="2xs"
														>
															ניהול תקין
														</Badge>
													)}
													{link.taxDeductible46 && (
														<Badge
															colorScheme="green"
															borderRadius="full"
															fontSize="2xs"
														>
															סעיף 46
														</Badge>
													)}
												</Flex>
												<Text fontSize="xs" color="gray.500">
													{categoryName}
												</Text>
											</Box>
											{link.phone && (
												<Button
													as={Link}
													href={`tel:${link.phone.replace(/[^\d+*#]/g, "")}`}
													size="xs"
													colorScheme="green"
													borderRadius="full"
													leftIcon={<FaPhoneAlt />}
													_hover={{ textDecoration: "none" }}
												>
													<span dir="ltr">{link.phone}</span>
												</Button>
											)}
										</Flex>

										{link.shortDescription && (
											<Text fontSize="xs" color="gray.700" mb={2.5}>
												{link.shortDescription}
											</Text>
										)}

										<HStack spacing={2} wrap="wrap">
											{primary && (
												<Button
													as={Link}
													href={primary}
													isExternal
													size="xs"
													colorScheme="blue"
													borderRadius="full"
													rightIcon={<FaExternalLinkAlt size={10} />}
													_hover={{ textDecoration: "none" }}
												>
													מעבר ישיר
												</Button>
											)}
											<Button
												as={NextLink}
												href={`${portalPath(categoryId)}?card=${encodeURIComponent(
													link.name,
												)}`}
												onClick={handleClose}
												size="xs"
												variant="outline"
												colorScheme="blue"
												borderRadius="full"
											>
												פרטים ומקורות
											</Button>
										</HStack>
									</Box>
								);
							})}

							<Flex
								justify="space-between"
								align="center"
								wrap="wrap"
								gap={2}
								pt={2}
							>
								<HStack spacing={2}>
									<Button
										size="sm"
										colorScheme="blue"
										borderRadius="full"
										leftIcon={<Icon as={FaShareAlt} />}
										onClick={handleShareMatches}
									>
										שתף קישור לתוצאות
									</Button>
									<Button
										size="sm"
										variant="outline"
										colorScheme="blue"
										borderRadius="full"
										leftIcon={<Icon as={FaBookmark} />}
										onClick={handleSaveAll}
									>
										שמור הכל לרשימה
									</Button>
								</HStack>
								<Button size="sm" variant="ghost" onClick={handleReset}>
									התחל מחדש
								</Button>
							</Flex>
						</VStack>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
