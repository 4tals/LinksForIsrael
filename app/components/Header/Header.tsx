import React from "react";

import {
	Flex,
	Box,
	Link,
	Heading,
	useMediaQuery,
	Container,
} from "@chakra-ui/react";

import { AddSite } from "../AddSite";
import { SearchButtonMobile } from "../Search/SearchButtonMobile";
import { SearchInput } from "../Search/SearchInput";

export function Header() {
	const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

	return (
		<Box
			as="header"
			position="sticky"
			top={0}
			zIndex={1000}
			bg="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
			borderBottom="1px solid"
			borderColor="whiteAlpha.100"
			backdropFilter="blur(10px)"
			boxShadow="0 4px 20px rgba(0, 0, 0, 0.15)"
		>
			<Container maxW="container.xl" py={3} px={{ base: 4, md: 6 }}>
				<Flex align="center" justify="space-between" gap={4}>
					{/* Logo / Title */}
					<Link
						href="/"
						_hover={{ textDecoration: "none", opacity: 0.9 }}
						transition="opacity 0.2s ease"
						flex={{ base: "1", md: "0 0 auto" }}
					>
						<Heading
							as="h1"
							fontSize={{ base: "lg", md: "xl" }}
							fontWeight="600"
							color="white"
							letterSpacing="tight"
							whiteSpace="nowrap"
						>
							🔗 פורטל לינק לישראל
						</Heading>
					</Link>

					{/* Search - Desktop */}
					{isLargerThan768 && (
						<Flex flex="1" justify="center" maxW="400px" mx={4}>
							<SearchInput />
						</Flex>
					)}

					{/* Actions */}
					<Flex
						align="center"
						gap={2}
						flex={{ base: "0 0 auto", md: "0 0 auto" }}
					>
						<AddSite />
						{!isLargerThan768 && <SearchButtonMobile />}
					</Flex>
				</Flex>
			</Container>
		</Box>
	);
}
