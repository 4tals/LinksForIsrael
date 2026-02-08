import React from "react";

import { socialLinks } from "@/app/utils/consts";
import {
	Box,
	Link,
	Image,
	Text,
	IconButton,
	HStack,
	VStack,
	useBreakpointValue,
	Container,
	Flex,
	Divider,
} from "@chakra-ui/react";

import { HelpUsButton } from "./HelpUsButton";

const FOOTER_CONFIG = {
	hebrewText: "הופכים עליהם, טובים אותם",
	reverseImageUrl:
		"https://twitter.com/kann/status/1712897481837539810?t=kxXrXgX59tp1yPnrYiS4Iw&s=19",
	reverseImageAlt: "Reverse Initiative",
	reverseImageSrc: "/images/reverse.png",
	copyrightText: "Links For Israel",
} as const;

export function Footer() {
	const isMobile = useBreakpointValue({ base: true, md: false });
	const socialIconSize = useBreakpointValue({ base: "18px", md: "20px" });

	return (
		<Box
			as="footer"
			position="sticky"
			bottom={0}
			zIndex={999}
			bg="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
			borderTop="1px solid"
			borderColor="whiteAlpha.100"
			backdropFilter="blur(10px)"
		>
			<Container
				maxW="container.xl"
				py={{ base: 4, md: 5 }}
				px={{ base: 4, md: 8 }}
			>
				{isMobile ? (
					// Mobile Layout
					<VStack spacing={4}>
						{/* Hebrew motto with subtle styling */}
						<HStack spacing={3} align="center">
							<Link
								href={FOOTER_CONFIG.reverseImageUrl}
								isExternal
								aria-label="קישור לפוסט המקורי"
								_hover={{ transform: "scale(1.1)" }}
								transition="transform 0.2s ease"
							>
								<Image
									src={FOOTER_CONFIG.reverseImageSrc}
									alt={FOOTER_CONFIG.reverseImageAlt}
									boxSize="28px"
									borderRadius="md"
								/>
							</Link>
							<Text
								fontSize="sm"
								fontWeight="500"
								color="whiteAlpha.900"
								letterSpacing="wide"
							>
								{FOOTER_CONFIG.hebrewText}
							</Text>
						</HStack>

						{/* Social links */}
						<HStack spacing={1}>
							{socialLinks.map((link) => (
								<IconButton
									key={link.href}
									as={Link}
									href={link.href}
									isExternal
									aria-label={link.alt}
									icon={
										<Image
											src={link.imgSrc}
											alt={link.alt}
											boxSize={socialIconSize}
											filter="brightness(0) invert(1)"
											opacity={0.8}
										/>
									}
									variant="ghost"
									size="sm"
									borderRadius="full"
									color="whiteAlpha.800"
									_hover={{
										bg: "whiteAlpha.200",
										transform: "translateY(-2px)",
									}}
									transition="all 0.2s ease"
								/>
							))}
						</HStack>

						{/* Dev button */}
						<HelpUsButton />
					</VStack>
				) : (
					// Desktop Layout
					<Flex justify="space-between" align="center">
						{/* Left: Motto and reverse image */}
						<HStack spacing={4}>
							<Link
								href={FOOTER_CONFIG.reverseImageUrl}
								isExternal
								aria-label="קישור לפוסט המקורי"
								_hover={{ transform: "scale(1.1)" }}
								transition="transform 0.2s ease"
							>
								<Image
									src={FOOTER_CONFIG.reverseImageSrc}
									alt={FOOTER_CONFIG.reverseImageAlt}
									boxSize="32px"
									borderRadius="md"
								/>
							</Link>
							<Divider
								orientation="vertical"
								h="24px"
								borderColor="whiteAlpha.300"
							/>
							<Text
								fontSize="sm"
								fontWeight="500"
								color="whiteAlpha.900"
								letterSpacing="wide"
							>
								{FOOTER_CONFIG.hebrewText}
							</Text>
						</HStack>

						{/* Center: Dev button */}
						<HelpUsButton />

						{/* Right: Social links */}
						<HStack spacing={1}>
							{socialLinks.map((link) => (
								<IconButton
									key={link.href}
									as={Link}
									href={link.href}
									isExternal
									aria-label={link.alt}
									icon={
										<Image
											src={link.imgSrc}
											alt={link.alt}
											boxSize={socialIconSize}
											filter="brightness(0) invert(1)"
											opacity={0.85}
										/>
									}
									variant="ghost"
									size="md"
									borderRadius="full"
									color="whiteAlpha.800"
									_hover={{
										bg: "whiteAlpha.200",
										transform: "translateY(-2px)",
									}}
									transition="all 0.2s ease"
								/>
							))}
						</HStack>
					</Flex>
				)}
			</Container>
		</Box>
	);
}
