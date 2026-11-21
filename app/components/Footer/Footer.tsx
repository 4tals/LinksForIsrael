"use client";

import React from "react";

import { socialLinks } from "@/app/utils/consts";
import {
	Box,
	Container,
	Flex,
	HStack,
	IconButton,
	Image,
	Link,
	Text,
	Tooltip,
} from "@chakra-ui/react";

import { HelpUsButton } from "./HelpUsButton";

const FOOTER_CONFIG = {
	hebrewText: "הופכים עליהם, טובים אותם",
	reverseImageUrl:
		"https://twitter.com/kann/status/1712897481837539810?t=kxXrXgX59tp1yPnrYiS4Iw&s=19",
	reverseImageAlt: "Reverse Initiative",
	reverseImageSrc: "/images/reverse.png",
} as const;

export function Footer() {
	return (
		<Box
			as="footer"
			mt="auto"
			borderTopWidth="1px"
			borderColor="gray.200"
			bg="white"
		>
			<Container maxW="1440px" py={{ base: 5, md: 6 }} px={{ base: 4, md: 6 }}>
				<Flex
					direction={{ base: "column", md: "row" }}
					justify="space-between"
					align="center"
					gap={4}
				>
					<HStack spacing={3} align="center">
						<Tooltip label="לפוסט המקורי בטוויטר" placement="top">
							<Link
								href={FOOTER_CONFIG.reverseImageUrl}
								isExternal
								aria-label="קישור לפוסט המקורי בטוויטר"
							>
								<Box
									boxSize="32px"
									borderRadius="md"
									overflow="hidden"
									transition="transform 0.2s ease"
									_hover={{ transform: "scale(1.08)" }}
								>
									<Image
										src={FOOTER_CONFIG.reverseImageSrc}
										alt={FOOTER_CONFIG.reverseImageAlt}
										boxSize="32px"
										objectFit="cover"
										loading="lazy"
									/>
								</Box>
							</Link>
						</Tooltip>
						<Text fontSize="sm" color="gray.600" fontWeight="medium">
							{FOOTER_CONFIG.hebrewText}
						</Text>
					</HStack>

					<HStack spacing={3} wrap="wrap" justify="center">
						<HelpUsButton />
						<Link
							href="/api/v1/initiatives.json"
							isExternal
							fontSize="xs"
							fontWeight="semibold"
							color="gray.500"
							_hover={{ color: "brand.600", textDecoration: "underline" }}
						>
							Open Data API (JSON)
						</Link>
						<Link
							href="/llms.txt"
							isExternal
							fontSize="xs"
							fontWeight="semibold"
							color="gray.500"
							_hover={{ color: "brand.600", textDecoration: "underline" }}
						>
							llms.txt
						</Link>
					</HStack>

					<HStack spacing={1.5} align="center" wrap="wrap" justify="center">
						{socialLinks.map((link) => (
							<Tooltip key={link.href} label={link.alt} placement="top">
								<IconButton
									as={Link}
									href={link.href}
									isExternal
									aria-label={`עבור ל-${link.alt}`}
									size="sm"
									variant="ghost"
									borderRadius="full"
									_hover={{
										bg: "gray.100",
										transform: "translateY(-1px)",
									}}
									icon={
										<Image
											src={link.imgSrc}
											alt={link.alt}
											boxSize="20px"
											objectFit="contain"
											loading="lazy"
										/>
									}
								/>
							</Tooltip>
						))}
					</HStack>
				</Flex>
			</Container>
		</Box>
	);
}
