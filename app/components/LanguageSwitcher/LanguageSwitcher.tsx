"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { analyticsService } from "@/app/utils/analytica/analytics";
import { Box, Flex } from "@chakra-ui/react";

/**
 * Elegant segmented pill language toggle (עב | EN).
 * Preserves a calm, modern header aesthetic while smoothly switching between Hebrew (/) and English (/en).
 */
export function LanguageSwitcher() {
	const pathname = usePathname();
	const isEnglish = pathname === "/en" || pathname?.startsWith("/en/");

	return (
		<Flex
			as="nav"
			aria-label="Language switcher"
			dir="ltr"
			align="center"
			bg="whiteAlpha.200"
			borderWidth="1px"
			borderColor="whiteAlpha.300"
			borderRadius="full"
			p="3px"
			gap="2px"
			flexShrink={0}
		>
			<Box
				as={NextLink}
				href="/"
				onClick={() => {
					if (isEnglish) analyticsService.trackLanguageSwitch("en", "he");
				}}
				aria-current={!isEnglish ? "page" : undefined}
				aria-label="עברית"
				px={2.5}
				py={1}
				borderRadius="full"
				fontSize="xs"
				fontWeight="bold"
				lineHeight="1"
				bg={!isEnglish ? "white" : "transparent"}
				color={!isEnglish ? "brand.700" : "white"}
				boxShadow={!isEnglish ? "xs" : "none"}
				transition="all 0.18s ease"
				_hover={{
					textDecoration: "none",
					bg: !isEnglish ? "white" : "whiteAlpha.200",
				}}
			>
				עב
			</Box>
			<Box
				as={NextLink}
				href="/en"
				onClick={() => {
					if (!isEnglish) analyticsService.trackLanguageSwitch("he", "en");
				}}
				aria-current={isEnglish ? "page" : undefined}
				aria-label="English"
				px={2.5}
				py={1}
				borderRadius="full"
				fontSize="xs"
				fontWeight="bold"
				lineHeight="1"
				bg={isEnglish ? "white" : "transparent"}
				color={isEnglish ? "brand.700" : "white"}
				boxShadow={isEnglish ? "xs" : "none"}
				transition="all 0.18s ease"
				_hover={{
					textDecoration: "none",
					bg: isEnglish ? "white" : "whiteAlpha.200",
				}}
			>
				EN
			</Box>
		</Flex>
	);
}
