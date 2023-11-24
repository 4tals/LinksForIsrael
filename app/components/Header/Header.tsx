import React from "react";

import {
	Flex,
	Box,
	Link,
	Heading,
	useColorModeValue,
	useMediaQuery,
} from "@chakra-ui/react";

import { AddSite } from "../AddSite";
import { SearchButtonMobile } from "../Search/SearchButtonMobile";
import { SearchInput } from "../Search/SearchInput";

export function Header() {
	const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
	const bgColor = useColorModeValue("blue.500", "blue.800"); // Adjust for light/dark mode if applicable
	const textColor = useColorModeValue("white", "gray.200");

	return (
		<Box
			as="header"
			display="flex"
			justifyContent="space-between"
			paddingY="2"
			paddingX="4"
			backgroundColor={bgColor}
			color={textColor}
			boxShadow="md"
		>
			<Flex align="center" flex={1}>
				<Link href="/" _hover={{ textDecoration: "none" }}>
					<Heading as="h1" size="lg">
						פורטל לינק לישראל
					</Heading>
				</Link>
			</Flex>
			{isLargerThan768 && (
				<Flex align="center" flex={1} justifyContent="center">
					<SearchInput />
				</Flex>
			)}
			<Flex align="center" flex={1} justifyContent="flex-end">
				<AddSite />
				{!isLargerThan768 && <SearchButtonMobile />}
			</Flex>
		</Box>
	);
}
