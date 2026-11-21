"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";

import { Logo } from "@/app/components/Logo";
import { SearchContext } from "@/app/components/RootApp";
import { Box, Button, Container, Flex, HStack, Text } from "@chakra-ui/react";

import { AddSite } from "../AddSite";
import { SearchButtonMobile } from "../Search/SearchButtonMobile";
import { SearchInput } from "../Search/SearchInput";

export function Header() {
	const { onSearch, setActiveIntent } = useContext(SearchContext);
	const pathname = usePathname();
	const isEnglish = pathname === "/en" || pathname?.startsWith("/en/");

	return (
		<Box
			as="header"
			position="sticky"
			top={0}
			zIndex={1000}
			bg="brand.600"
			bgGradient="linear(to-l, brand.600, brand.500)"
			color="white"
			boxShadow="sm"
		>
			<Container maxW="1440px" py={3} px={{ base: 3, md: 6 }}>
				<Flex align="center" justify="space-between" gap={4}>
					<Flex align="center" flex={{ base: "1", md: "0 0 auto" }}>
						<NextLink
							href="/"
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
								לינק לישראל
							</Text>
						</NextLink>
					</Flex>

					{!isEnglish && (
						<Flex
							display={{ base: "none", md: "flex" }}
							flex="1"
							justify="center"
							maxW="540px"
							mx="auto"
						>
							<SearchInput />
						</Flex>
					)}

					<HStack spacing={2} flex="0 0 auto">
						<Button
							as={NextLink}
							href={isEnglish ? "/" : "/en"}
							size={{ base: "sm", md: "md" }}
							variant="ghost"
							color="white"
							borderRadius="full"
							borderWidth="1px"
							borderColor="whiteAlpha.400"
							fontWeight="semibold"
							px={3}
							_hover={{ bg: "whiteAlpha.200", textDecoration: "none" }}
							aria-label={isEnglish ? "עבור לעברית" : "Switch to English"}
						>
							{isEnglish ? "עברית" : "EN"}
						</Button>
						<AddSite />
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
