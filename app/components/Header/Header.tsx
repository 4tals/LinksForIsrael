"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import { FaBookmark, FaSearch } from "react-icons/fa";

import { useBookmarks } from "@/app/components/Bookmarks/BookmarksContext";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher/LanguageSwitcher";
import { Logo } from "@/app/components/Logo";
import { AppToolsContext, SearchContext } from "@/app/components/RootApp";
import { ThemeModeToggle } from "@/app/components/Theme/ThemeModeToggle";
import {
	Badge,
	Box,
	Container,
	Flex,
	HStack,
	IconButton,
	Text,
	Tooltip,
} from "@chakra-ui/react";

import { AddSite } from "../AddSite";
import { SearchButtonMobile } from "../Search/SearchButtonMobile";
import { SearchInput } from "../Search/SearchInput";

export function Header() {
	const { onSearch, setActiveIntent } = useContext(SearchContext);
	const { openCommandPalette } = useContext(AppToolsContext);
	const { savedItems, openDrawer } = useBookmarks();
	const pathname = usePathname();
	const isEnglish = pathname === "/en" || pathname?.startsWith("/en/");

	return (
		<Box
			as="header"
			dir={isEnglish ? "ltr" : "rtl"}
			position="sticky"
			top={0}
			zIndex={1000}
			bg="brand.600"
			bgGradient="linear(to-l, brand.600, brand.500)"
			color="white"
			boxShadow="sm"
		>
			<Container maxW="1440px" py={3} px={{ base: 3, md: 6 }}>
				<Flex align="center" justify="space-between" gap={3}>
					<Flex align="center" flex={{ base: "1", md: "0 0 auto" }}>
						<NextLink
							href={isEnglish ? "/en" : "/"}
							onClick={() => {
								onSearch("");
								setActiveIntent(null);
							}}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "10px",
								textDecoration: "none",
							}}
						>
							<Box
								bg="white"
								borderRadius="lg"
								p={1.5}
								display="flex"
								alignItems="center"
								justifyContent="center"
								boxShadow="sm"
							>
								<Logo width={26} height={29} />
							</Box>
							<Text
								as="span"
								fontSize={{ base: "lg", md: "xl" }}
								fontWeight="bold"
								letterSpacing="-0.01em"
								color="white"
								whiteSpace="nowrap"
							>
								{isEnglish ? "Links For Israel" : "לינק לישראל"}
							</Text>
						</NextLink>
					</Flex>

					{!isEnglish && (
						<Flex
							display={{ base: "none", md: "flex" }}
							flex="1"
							justify="center"
							maxW="520px"
							mx="auto"
						>
							<SearchInput enableShortcut />
						</Flex>
					)}

					<HStack spacing={1.5} flex="0 0 auto">
						<Tooltip
							label={
								isEnglish
									? "Quick search everywhere (⌘K or /)"
									: "חיפוש מהיר בכל הפורטל (⌘K או /)"
							}
							hasArrow
						>
							<IconButton
								aria-label={isEnglish ? "Open quick search" : "פתח חיפוש מהיר"}
								icon={<FaSearch size={13} />}
								size={{ base: "sm", md: "md" }}
								variant="ghost"
								color="white"
								borderRadius="full"
								display={{ base: "none", lg: "inline-flex" }}
								_hover={{ bg: "whiteAlpha.200" }}
								onClick={openCommandPalette}
							/>
						</Tooltip>

						<ThemeModeToggle />

						<Tooltip
							label={isEnglish ? "My saved list" : "הרשימה השמורה שלי"}
							hasArrow
						>
							<Box position="relative">
								<IconButton
									aria-label={isEnglish ? "Open saved list" : "פתח רשימה שמורה"}
									icon={<FaBookmark size={14} />}
									size={{ base: "sm", md: "md" }}
									variant="ghost"
									color="white"
									borderRadius="full"
									_hover={{ bg: "whiteAlpha.200" }}
									onClick={openDrawer}
								/>
								{savedItems.length > 0 && (
									<Badge
										position="absolute"
										top="-2px"
										right="-2px"
										bg="yellow.400"
										color="gray.900"
										borderRadius="full"
										fontSize="2xs"
										px={1.5}
										pointerEvents="none"
									>
										{savedItems.length}
									</Badge>
								)}
							</Box>
						</Tooltip>

						<LanguageSwitcher />

						<AddSite locale={isEnglish ? "en" : "he"} />

						{!isEnglish && (
							<Box display={{ base: "block", md: "none" }}>
								<SearchButtonMobile />
							</Box>
						)}
					</HStack>
				</Flex>
			</Container>
		</Box>
	);
}
