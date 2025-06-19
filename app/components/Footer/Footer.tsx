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
	Tooltip,
} from "@chakra-ui/react";

import { HelpUsButton } from "./HelpUsButton";

// Constants for better maintainability
const FOOTER_CONFIG = {
	hebrewText: "הופכים עליהם, טובים אותם",
	reverseImageUrl:
		"https://twitter.com/kann/status/1712897481837539810?t=kxXrXgX59tp1yPnrYiS4Iw&s=19",
	reverseImageAlt: "Reverse Initiative",
	reverseImageSrc: "/images/reverse.png",
} as const;

const FOOTER_STYLES = {
	container: {
		borderTopWidth: "1px",
		borderColor: "gray.200",
		backgroundColor: "white",
		position: "sticky" as const,
		bottom: 0,
		zIndex: 999,
		boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
	},
	content: {
		fontFamily: "Roboto, sans-serif",
		py: { base: 3, md: 4 },
		px: { base: 4, md: 6 },
	},
	hebrewText: {
		textAlign: "center" as const,
		fontSize: { base: "12px", md: "14px" },
		color: "gray.600",
		fontWeight: "medium",
	},
	imageBox: {
		boxSize: { base: "28px", md: "36px" },
		borderRadius: "md",
		overflow: "hidden",
		transition: "transform 0.2s ease",
		_hover: {
			transform: "scale(1.05)",
		},
	},
	socialButton: {
		size: { base: "sm", md: "md" },
		variant: "ghost",
		borderRadius: "full",
		transition: "all 0.2s ease",
		_hover: {
			transform: "translateY(-2px)",
			boxShadow: "md",
		},
		_focus: {
			boxShadow: "outline",
		},
	},
} as const;

export function Footer() {
	// Responsive values
	const isMobile = useBreakpointValue({ base: true, md: false });
	const socialIconSize = useBreakpointValue({ base: "20px", md: "24px" });
	const showHelpButton = useBreakpointValue({ base: false, md: true });

	// Mobile layout - stack vertically
	if (isMobile) {
		return (
			<Box as="footer" {...FOOTER_STYLES.container}>
				<Container maxW="container.xl" {...FOOTER_STYLES.content}>
					<VStack spacing={3} align="center">
						{/* Hebrew text and reverse image */}
						<VStack spacing={2} align="center">
							<Text {...FOOTER_STYLES.hebrewText}>
								{FOOTER_CONFIG.hebrewText}
							</Text>
							<Tooltip label="לפוסט המקורי בטוויטר" placement="top">
								<Link
									href={FOOTER_CONFIG.reverseImageUrl}
									isExternal
									aria-label="קישור לפוסט המקורי בטוויטר"
								>
									<Box {...FOOTER_STYLES.imageBox}>
										<Image
											src={FOOTER_CONFIG.reverseImageSrc}
											alt={FOOTER_CONFIG.reverseImageAlt}
											width={FOOTER_STYLES.imageBox.boxSize}
											height={FOOTER_STYLES.imageBox.boxSize}
											loading="lazy"
										/>
									</Box>
								</Link>
							</Tooltip>
						</VStack>

						{/* Social media links */}
						<HStack spacing={1} justify="center" wrap="wrap">
							{socialLinks.map((link, index) => (
								<Tooltip key={link.href} label={link.alt} placement="top">
									<IconButton
										as={Link}
										href={link.href}
										isExternal
										aria-label={`עבור ל${link.alt}`}
										icon={
											<Image
												src={link.imgSrc}
												alt={link.alt}
												boxSize={socialIconSize}
												loading="lazy"
											/>
										}
										{...FOOTER_STYLES.socialButton}
									/>
								</Tooltip>
							))}
						</HStack>

						{/* Help button for mobile */}
						<Box mt={2}>
							<HelpUsButton />
						</Box>
					</VStack>
				</Container>
			</Box>
		);
	}

	// Desktop layout - horizontal
	return (
		<Box as="footer" {...FOOTER_STYLES.container}>
			<Container maxW="container.xl" {...FOOTER_STYLES.content}>
				<Flex
					justify="space-between"
					align="center"
					direction="row"
					wrap="nowrap"
				>
					{/* Left section: Hebrew text and reverse image */}
					<VStack spacing={2} align="center" flex="0 0 auto">
						<Text {...FOOTER_STYLES.hebrewText}>
							{FOOTER_CONFIG.hebrewText}
						</Text>
						<Tooltip label="לפוסט המקורי בטוויטר" placement="top">
							<Link
								href={FOOTER_CONFIG.reverseImageUrl}
								isExternal
								aria-label="קישור לפוסט המקורי בטוויטר"
							>
								<Box {...FOOTER_STYLES.imageBox}>
									<Image
										src={FOOTER_CONFIG.reverseImageSrc}
										alt={FOOTER_CONFIG.reverseImageAlt}
										width={FOOTER_STYLES.imageBox.boxSize}
										height={FOOTER_STYLES.imageBox.boxSize}
										loading="lazy"
									/>
								</Box>
							</Link>
						</Tooltip>
					</VStack>

					{/* Center section: Help button */}
					{showHelpButton && (
						<Box flex="0 0 auto">
							<HelpUsButton />
						</Box>
					)}

					{/* Right section: Social media links */}
					<HStack spacing={2} align="center" flex="0 0 auto">
						{socialLinks.map((link, index) => (
							<Tooltip key={link.href} label={link.alt} placement="top">
								<IconButton
									as={Link}
									href={link.href}
									isExternal
									aria-label={`עבור ל${link.alt}`}
									icon={
										<Image
											src={link.imgSrc}
											alt={link.alt}
											boxSize={socialIconSize}
											loading="lazy"
										/>
									}
									{...FOOTER_STYLES.socialButton}
								/>
							</Tooltip>
						))}
					</HStack>
				</Flex>
			</Container>
		</Box>
	);
}
