"use client";

import NextLink from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import {
	FaBookmark,
	FaCheckCircle,
	FaExternalLinkAlt,
	FaPhoneAlt,
	FaPrint,
	FaShareAlt,
	FaTimes,
} from "react-icons/fa";

import { useBookmarks } from "@/app/components/Bookmarks/BookmarksContext";
import {
	Category,
	getPrimaryInitiativeUrl,
	InitiativeLink,
} from "@/app/utils/categories";
import { portalPath } from "@/app/utils/portalPath";
import {
	getUrlParams,
	updateUrlParams,
	URL_CHANGE_EVENT,
} from "@/app/utils/urlState";
import {
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Icon,
	Link,
	SimpleGrid,
	Text,
	useToast,
} from "@chakra-ui/react";

export function SharedListBanner({ categories }: { categories: Category[] }) {
	const [listIds, setListIds] = useState<string[]>([]);
	const [listTitle, setListTitle] = useState<string>("");
	const { toggleSave, isSaved } = useBookmarks();
	const toast = useToast();

	useEffect(() => {
		const sync = () => {
			const params = getUrlParams();
			const raw = params.get("list") || "";
			const parsed = raw
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
			setListIds(parsed);
			setListTitle(params.get("title") || "");
		};
		sync();
		window.addEventListener("popstate", sync);
		window.addEventListener(URL_CHANGE_EVENT, sync);
		return () => {
			window.removeEventListener("popstate", sync);
			window.removeEventListener(URL_CHANGE_EVENT, sync);
		};
	}, []);

	const matchedItems = useMemo(() => {
		if (listIds.length === 0) return [];
		const byName = new Map<
			string,
			{ link: InitiativeLink; categoryId: string; categoryName: string }
		>();
		for (const cat of categories) {
			for (const sub of cat.subCategories) {
				for (const link of sub.links) {
					byName.set(link.name.toLowerCase(), {
						link,
						categoryId: cat.id,
						categoryName: cat.displayName,
					});
				}
			}
		}

		const ordered: Array<{
			link: InitiativeLink;
			categoryId: string;
			categoryName: string;
		}> = [];
		for (const id of listIds) {
			const hit = byName.get(id.toLowerCase());
			if (hit) ordered.push(hit);
		}
		return ordered;
	}, [listIds, categories]);

	if (matchedItems.length === 0) return null;

	const handleSaveAll = () => {
		let count = 0;
		for (const m of matchedItems) {
			if (!isSaved(m.link.name)) {
				toggleSave({
					name: m.link.name,
					displayName: m.link.displayName,
					shortDescription: m.link.shortDescription,
					url: getPrimaryInitiativeUrl(m.link),
					phone: m.link.phone,
					categoryId: m.categoryId,
				});
				count++;
			}
		}
		toast({
			title:
				count > 0
					? `נשמרו ${count} יוזמות לרשימה שלך`
					: "הרשימה כבר שמורה אצלך",
			status: "success",
			duration: 2000,
			isClosable: true,
		});
	};

	const handleCopyLink = async () => {
		if (typeof window === "undefined") return;
		try {
			await navigator.clipboard.writeText(window.location.href);
			toast({
				title: "קישור הרשימה הועתק",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		} catch {
			// Ignore
		}
	};

	const dismiss = () => {
		updateUrlParams({ list: null, title: null });
	};

	const printHref = `/print?list=${encodeURIComponent(listIds.join(","))}`;

	return (
		<Box
			mx={{ base: 3, md: 6 }}
			mt={5}
			p={{ base: 5, md: 6 }}
			bg="brand.50"
			borderRadius="2xl"
			borderWidth="2px"
			borderColor="brand.300"
			boxShadow="md"
		>
			<Flex
				justify="space-between"
				align="flex-start"
				wrap="wrap"
				gap={3}
				mb={4}
			>
				<Box>
					<Badge
						colorScheme="blue"
						variant="solid"
						borderRadius="full"
						px={3}
						py={0.5}
						mb={1.5}
					>
						חבילת משאבים משותפת · {matchedItems.length} יוזמות
					</Badge>
					<Heading as="h2" size="md" color="brand.700">
						{listTitle || "רשימת יוזמות ומוקדי סיוע ששותפה איתך"}
					</Heading>
				</Box>

				<HStack spacing={2} wrap="wrap">
					<Button
						size="xs"
						colorScheme="blue"
						borderRadius="full"
						leftIcon={<Icon as={FaBookmark} />}
						onClick={handleSaveAll}
					>
						שמור לרשימה שלי
					</Button>
					<Button
						size="xs"
						variant="outline"
						colorScheme="blue"
						bg="white"
						borderRadius="full"
						leftIcon={<Icon as={FaShareAlt} />}
						onClick={handleCopyLink}
					>
						העתק קישור
					</Button>
					<Button
						as={NextLink}
						href={printHref}
						size="xs"
						variant="outline"
						colorScheme="teal"
						bg="white"
						borderRadius="full"
						leftIcon={<Icon as={FaPrint} />}
					>
						הדפס דף
					</Button>
					<Button
						size="xs"
						variant="ghost"
						colorScheme="gray"
						borderRadius="full"
						leftIcon={<Icon as={FaTimes} />}
						onClick={dismiss}
					>
						סגור
					</Button>
				</HStack>
			</Flex>

			<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
				{matchedItems.map(({ link, categoryId, categoryName }) => {
					const primary = getPrimaryInitiativeUrl(link);
					return (
						<Flex
							key={link.name}
							direction="column"
							justify="space-between"
							bg="white"
							p={4}
							borderRadius="xl"
							borderWidth="1px"
							borderColor="gray.200"
							gap={2.5}
						>
							<Box>
								<Flex align="center" gap={1.5} mb={1}>
									<Text
										fontWeight="bold"
										fontSize="sm"
										color="gray.900"
										noOfLines={2}
									>
										{link.displayName}
									</Text>
									{link.verified && (
										<Icon as={FaCheckCircle} color="green.500" boxSize={3.5} />
									)}
								</Flex>
								<Text fontSize="2xs" color="gray.500" mb={1.5}>
									{categoryName}
								</Text>
								{link.shortDescription && (
									<Text fontSize="xs" color="gray.600" noOfLines={2}>
										{link.shortDescription}
									</Text>
								)}
							</Box>

							<Flex align="center" gap={2} wrap="wrap">
								{link.phone && (
									<Button
										as={Link}
										href={`tel:${link.phone.replace(/[^\d+*#]/g, "")}`}
										size="xs"
										colorScheme="green"
										borderRadius="full"
										leftIcon={<FaPhoneAlt size={10} />}
										_hover={{ textDecoration: "none" }}
									>
										<span dir="ltr">{link.phone}</span>
									</Button>
								)}
								{primary && (
									<Button
										as={Link}
										href={primary}
										isExternal
										size="xs"
										colorScheme="blue"
										variant="outline"
										borderRadius="full"
										rightIcon={<FaExternalLinkAlt size={9} />}
										_hover={{ textDecoration: "none" }}
									>
										פתיחה
									</Button>
								)}
								<Link
									as={NextLink}
									href={`${portalPath(categoryId)}?card=${encodeURIComponent(
										link.name,
									)}`}
									fontSize="xs"
									color="brand.600"
									fontWeight="semibold"
								>
									פרטים
								</Link>
							</Flex>
						</Flex>
					);
				})}
			</SimpleGrid>
		</Box>
	);
}
