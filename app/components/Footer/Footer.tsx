"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
	FaFacebook,
	FaGithub,
	FaInstagram,
	FaLinkedin,
	FaTwitter,
} from "react-icons/fa";

import { socialLinks } from "@/app/utils/consts";
import {
	Box,
	Container,
	Flex,
	HStack,
	Icon,
	IconButton,
	Image,
	Link,
	Text,
	Tooltip,
} from "@chakra-ui/react";

const FOOTER_CONFIG = {
	hebrewText: "לינק לישראל — השער הפתוח לישראל ולעולם היהודי",
	englishText: "Open-source portal for Israel, Aliyah & Jewish life",
	reverseImageUrl:
		"https://twitter.com/kann/status/1712897481837539810?t=kxXrXgX59tp1yPnrYiS4Iw&s=19",
	reverseImageAlt: "Reverse Initiative",
	reverseImageSrc: "/images/reverse.webp",
} as const;

const SOCIAL_ICON_MAP: Record<
	string,
	{ icon: React.ElementType; color: string }
> = {
	Instagram: { icon: FaInstagram, color: "#E4405F" },
	Facebook: { icon: FaFacebook, color: "#1877F2" },
	GitHub: { icon: FaGithub, color: "#1F2937" },
	"X (Twitter)": { icon: FaTwitter, color: "#111827" },
	LinkedIn: { icon: FaLinkedin, color: "#0A66C2" },
};

export function Footer() {
	const pathname = usePathname();
	const isEnglish = pathname === "/en" || pathname?.startsWith("/en/");

	return (
		<Box
			as="footer"
			dir={isEnglish ? "ltr" : "rtl"}
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
						<Tooltip
							label={
								isEnglish ? "Original community post" : "לפוסט המקורי בטוויטר"
							}
							placement="top"
						>
							<Link
								href={FOOTER_CONFIG.reverseImageUrl}
								isExternal
								aria-label={
									isEnglish
										? "Link to original community post"
										: "קישור לפוסט המקורי בטוויטר"
								}
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
						<Text fontSize="sm" color="gray.700" fontWeight="medium">
							{isEnglish ? FOOTER_CONFIG.englishText : FOOTER_CONFIG.hebrewText}
						</Text>
					</HStack>

					<HStack spacing={4} wrap="wrap" justify="center" align="center">
						<Link
							as={NextLink}
							href={
								isEnglish ? "/docs/methodology?lang=en" : "/docs/methodology"
							}
							fontSize="xs"
							fontWeight="medium"
							color="gray.700"
							_hover={{ color: "brand.600", textDecoration: "underline" }}
						>
							{isEnglish ? "Verification & Ranking" : "אימות ודירוג יוזמות"}
						</Link>
						<Text fontSize="xs" color="gray.400" aria-hidden="true">
							•
						</Text>
						<Link
							as={NextLink}
							href="/docs/accessibility"
							fontSize="xs"
							fontWeight="medium"
							color="gray.700"
							_hover={{ color: "brand.600", textDecoration: "underline" }}
						>
							{isEnglish ? "Accessibility (IS 5568)" : "הצהרת נגישות"}
						</Link>
						<Text fontSize="xs" color="gray.400" aria-hidden="true">
							•
						</Text>
						<Link
							as={NextLink}
							href={isEnglish ? "/embed/hotlines?lang=en" : "/embed/hotlines"}
							fontSize="xs"
							fontWeight="medium"
							color="gray.700"
							_hover={{ color: "brand.600", textDecoration: "underline" }}
						>
							{isEnglish ? "Embed Hotlines" : "הטמעת מוקדי חירום"}
						</Link>
						<Text fontSize="xs" color="gray.400" aria-hidden="true">
							•
						</Text>
						<Link
							as={NextLink}
							href={isEnglish ? "/print?lang=en" : "/print"}
							fontSize="xs"
							fontWeight="medium"
							color="gray.700"
							_hover={{ color: "brand.600", textDecoration: "underline" }}
						>
							{isEnglish ? "Printable Sheet" : "דף חירום להדפסה"}
						</Link>
						<Text fontSize="xs" color="gray.400" aria-hidden="true">
							•
						</Text>
						<Link
							as={NextLink}
							href="/docs/agents"
							fontSize="xs"
							fontWeight="medium"
							color="gray.700"
							_hover={{ color: "brand.600", textDecoration: "underline" }}
						>
							{isEnglish ? "AI Agents & Open Data" : "סוכני AI ו-API פתוח"}
						</Link>
					</HStack>

					<HStack spacing={1.5} align="center" wrap="wrap" justify="center">
						{socialLinks.map((link) => {
							const meta = SOCIAL_ICON_MAP[link.alt] || {
								icon: FaGithub,
								color: "#374151",
							};
							return (
								<Tooltip key={link.href} label={link.alt} placement="top">
									<IconButton
										as={Link}
										href={link.href}
										isExternal
										aria-label={
											isEnglish ? `Visit ${link.alt}` : `עבור ל-${link.alt}`
										}
										size="sm"
										variant="ghost"
										borderRadius="full"
										color={meta.color}
										_hover={{
											bg: "gray.100",
											transform: "translateY(-1px)",
										}}
										icon={<Icon as={meta.icon} boxSize={4} />}
									/>
								</Tooltip>
							);
						})}
					</HStack>
				</Flex>
			</Container>
		</Box>
	);
}
