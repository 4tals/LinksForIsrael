"use client";

import NextLink from "next/link";
import React, { useContext } from "react";

import { Logo } from "@/app/components/Logo";
import { SearchContext } from "@/app/components/RootApp";
import { Box, Container, Flex, Heading, HStack } from "@chakra-ui/react";

import { AddSite } from "../AddSite";
import { SearchButtonMobile } from "../Search/SearchButtonMobile";
import { SearchInput } from "../Search/SearchInput";

export function Header() {
	const { onSearch } = useContext(SearchContext);

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
							onClick={() => onSearch("")}
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
							<Heading
								as="h1"
								fontSize={{ base: "lg", md: "xl" }}
								fontWeight="bold"
								letterSpacing="-0.01em"
								color="white"
								whiteSpace="nowrap"
							>
								לינק לישראל
							</Heading>
						</NextLink>
					</Flex>

					<Flex
						display={{ base: "none", md: "flex" }}
						flex="1"
						justify="center"
						maxW="540px"
						mx="auto"
					>
						<SearchInput />
					</Flex>

					<HStack spacing={2} flex="0 0 auto">
						<AddSite />
						<Box display={{ base: "block", md: "none" }}>
							<SearchButtonMobile />
						</Box>
					</HStack>
				</Flex>
			</Container>
		</Box>
	);
}
