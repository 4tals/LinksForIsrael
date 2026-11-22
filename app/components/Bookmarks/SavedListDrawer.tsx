"use client";

import NextLink from "next/link";
import React from "react";
import {
	FaBookmark,
	FaCopy,
	FaExternalLinkAlt,
	FaLink,
	FaPhoneAlt,
	FaPrint,
	FaTrash,
	FaWhatsapp,
} from "react-icons/fa";

import {
	Badge,
	Box,
	Button,
	Divider,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	IconButton,
	Link,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";

import { SavedInitiative, useBookmarks } from "./BookmarksContext";

function formatShareMessage(items: SavedInitiative[]): string {
	const lines = ["רשימת יוזמות ומשאבים מפורטל לינק לישראל:"];
	items.forEach((item, idx) => {
		lines.push("");
		lines.push(`${idx + 1}. *${item.displayName}*`);
		if (item.shortDescription) {
			lines.push(item.shortDescription);
		}
		if (item.phone) {
			lines.push(`טלפון: ${item.phone}`);
		}
		if (item.url) {
			lines.push(item.url);
		}
	});
	lines.push("");
	lines.push("לעוד יוזמות ומוקדי סיוע: https://www.linksforisrael.com");
	return lines.join("\n");
}

export function SavedListDrawer() {
	const {
		savedItems,
		removeSaved,
		clearSaved,
		isDrawerOpen,
		openDrawer,
		closeDrawer,
	} = useBookmarks();
	const toast = useToast();

	const handleCopyList = async () => {
		if (savedItems.length === 0) return;
		try {
			await navigator.clipboard.writeText(formatShareMessage(savedItems));
			toast({
				title: "הרשימה הועתקה ללוח",
				description: "אפשר להדביק ולשלוח בכל אפליקציה",
				status: "success",
				duration: 2200,
				isClosable: true,
			});
		} catch {
			toast({
				title: "לא ניתן להעתיק את הרשימה",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
		}
	};

	const listParam = savedItems.map((i) => i.name).join(",");
	const shareListUrl =
		typeof window !== "undefined"
			? `${window.location.origin}/?list=${encodeURIComponent(listParam)}`
			: `https://www.linksforisrael.com/?list=${encodeURIComponent(listParam)}`;

	const handleCopyShareUrl = async () => {
		if (savedItems.length === 0) return;
		try {
			await navigator.clipboard.writeText(shareListUrl);
			toast({
				title: "קישור חי לרשימה הועתק!",
				description: "כל מי שיפתח את הקישור יראה בדיוק את הרשימה שיצרת",
				status: "success",
				duration: 2400,
				isClosable: true,
			});
		} catch {
			// Ignore
		}
	};

	const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
		`${formatShareMessage(savedItems)}\n\nקישור חי לרשימה זו:\n${shareListUrl}`,
	)}`;

	return (
		<>
			{/* Floating quick-access pill when user has saved items */}
			{savedItems.length > 0 && !isDrawerOpen && (
				<Button
					position="fixed"
					bottom={{ base: 5, md: 6 }}
					left={{ base: 4, md: 6 }}
					zIndex={900}
					colorScheme="blue"
					bg="brand.600"
					_hover={{ bg: "brand.700", transform: "translateY(-2px)" }}
					borderRadius="full"
					boxShadow="xl"
					px={5}
					size="md"
					leftIcon={<FaBookmark />}
					onClick={openDrawer}
					transition="all 0.2s ease"
				>
					הרשימה שלי ({savedItems.length})
				</Button>
			)}

			<Drawer
				isOpen={isDrawerOpen}
				placement="left"
				onClose={closeDrawer}
				size={{ base: "full", sm: "md" }}
			>
				<DrawerOverlay bg="blackAlpha.400" backdropFilter="blur(2px)" />
				<DrawerContent dir="rtl">
					<DrawerCloseButton left={3} right="unset" top={3.5} color="white" />
					<DrawerHeader bg="brand.600" color="white" py={4} px={5}>
						<Flex align="center" gap={2}>
							<FaBookmark size={16} />
							<span>הרשימה שלי</span>
							<Badge
								bg="whiteAlpha.200"
								color="white"
								borderRadius="full"
								px={2}
							>
								{savedItems.length}
							</Badge>
						</Flex>
						<Text fontSize="xs" fontWeight="normal" color="blue.100" mt={1}>
							שמרו יוזמות ושתפו אותן בלחיצה אחת בוואטסאפ או בהעתקה
						</Text>
					</DrawerHeader>

					<DrawerBody py={4} px={4} bg="gray.50">
						{savedItems.length === 0 ? (
							<VStack spacing={3} py={12} textAlign="center" color="gray.500">
								<FaBookmark size={28} opacity={0.3} />
								<Text fontWeight="semibold" color="gray.700">
									עדיין לא שמרתם יוזמות
								</Text>
								<Text fontSize="sm">
									לחצו על סמל הסימנייה בכרטיס כל יוזמה כדי להוסיף אותה לרשימה
									לשיתוף מהיר.
								</Text>
							</VStack>
						) : (
							<VStack spacing={3} align="stretch">
								{savedItems.map((item) => (
									<Box
										key={item.name}
										bg="white"
										p={3.5}
										borderRadius="xl"
										borderWidth="1px"
										borderColor="gray.200"
										boxShadow="xs"
									>
										<Flex justify="space-between" align="flex-start" gap={2}>
											<Box flex="1" minW={0}>
												<Text
													fontWeight="bold"
													fontSize="sm"
													color="gray.900"
													noOfLines={2}
												>
													{item.displayName}
												</Text>
												{item.shortDescription && (
													<Text
														fontSize="xs"
														color="gray.600"
														mt={1}
														noOfLines={2}
													>
														{item.shortDescription}
													</Text>
												)}
											</Box>
											<IconButton
												aria-label={`הסר את ${item.displayName}`}
												icon={<FaTrash size={12} />}
												size="xs"
												variant="ghost"
												color="gray.400"
												_hover={{ color: "red.500", bg: "red.50" }}
												onClick={() => removeSaved(item.name)}
											/>
										</Flex>

										<Flex gap={3} mt={2.5} align="center" wrap="wrap">
											{item.url && (
												<Link
													href={item.url}
													isExternal
													fontSize="xs"
													fontWeight="semibold"
													color="brand.600"
													display="inline-flex"
													alignItems="center"
													gap={1}
												>
													פתיחה
													<FaExternalLinkAlt size={10} />
												</Link>
											)}
											{item.phone && (
												<Link
													href={`tel:${item.phone.replace(/[^\d+*#]/g, "")}`}
													fontSize="xs"
													fontWeight="semibold"
													color="green.700"
													display="inline-flex"
													alignItems="center"
													gap={1}
												>
													<FaPhoneAlt size={10} />
													<span dir="ltr">{item.phone}</span>
												</Link>
											)}
										</Flex>
									</Box>
								))}
							</VStack>
						)}
					</DrawerBody>

					{savedItems.length > 0 && (
						<DrawerFooter
							borderTopWidth="1px"
							borderColor="gray.200"
							bg="white"
							p={4}
						>
							<VStack spacing={2.5} w="100%" align="stretch">
								<Button
									as={Link}
									href={whatsappHref}
									isExternal
									bg="#25D366"
									color="white"
									_hover={{ bg: "#1ebe5d", textDecoration: "none" }}
									size="md"
									borderRadius="xl"
									leftIcon={<FaWhatsapp size={18} />}
								>
									שתף רשימה בוואטסאפ
								</Button>

								<Flex gap={2} wrap="wrap">
									<Button
										flex="1"
										variant="outline"
										colorScheme="blue"
										size="sm"
										borderRadius="lg"
										leftIcon={<FaLink />}
										onClick={handleCopyShareUrl}
									>
										העתק קישור
									</Button>
									<Button
										as={NextLink}
										href={`/print?list=${encodeURIComponent(listParam)}`}
										onClick={closeDrawer}
										flex="1"
										variant="outline"
										colorScheme="teal"
										size="sm"
										borderRadius="lg"
										leftIcon={<FaPrint />}
									>
										הדפס לממ״ד
									</Button>
								</Flex>

								<Flex gap={2}>
									<Button
										flex="1"
										variant="ghost"
										colorScheme="gray"
										size="xs"
										borderRadius="lg"
										leftIcon={<FaCopy />}
										onClick={handleCopyList}
									>
										העתק טקסט
									</Button>
									<Button
										variant="ghost"
										colorScheme="red"
										size="xs"
										borderRadius="lg"
										onClick={clearSaved}
									>
										נקה רשימה
									</Button>
								</Flex>
							</VStack>
						</DrawerFooter>
					)}
				</DrawerContent>
			</Drawer>
		</>
	);
}
