import React, { useEffect, useRef } from "react";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
	Box,
	Text,
	Button,
	VStack,
	useColorModeValue,
	Flex,
	Skeleton,
	useToast,
	Image,
} from "@chakra-ui/react";

import { InitiativeLink as LinkType } from "../../utils/categories";
import { InitiativeIcons } from "./InitiativeIcons";

// Hebrew detection utility
const containsHebrewLetters = (str: string): boolean =>
	/[\u0590-\u05EA]/.test(str);

interface ShowMoreModalProps {
	link: LinkType;
	setOpenDialog: (open: boolean) => void;
}

export const ShowMoreModal: React.FC<ShowMoreModalProps> = ({
	link,
	setOpenDialog,
}) => {
	// All color mode values at top level
	const bgColor = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.700", "gray.200");
	const subtleTextColor = useColorModeValue("gray.500", "gray.400");
	const accentColor = useColorModeValue("blue.500", "blue.400");
	const accentHoverColor = useColorModeValue("blue.600", "blue.300");
	const tagBgColor = useColorModeValue("gray.50", "gray.700");
	const tagBorderColor = useColorModeValue("gray.200", "gray.600");
	const dividerColor = useColorModeValue("gray.100", "gray.700");
	const imageOverlayGradient = useColorModeValue(
		"linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 30%, transparent 100%)",
		"linear-gradient(to top, rgba(26,32,44,1) 0%, rgba(26,32,44,0.8) 30%, transparent 100%)",
	);

	const toast = useToast();
	const buttonRef = useRef<HTMLButtonElement>(null);

	// Detect RTL text for proper text direction
	const isRtl = containsHebrewLetters(
		`${link.displayName}${link.description}${link.shortDescription}`,
	);

	// Focus management for accessibility
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpenDialog(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [setOpenDialog]);

	// Handle link click with error handling
	const handleLinkClick = () => {
		try {
			window.open(link.url, "_blank", "noopener,noreferrer");
		} catch (error) {
			toast({
				title: "שגיאה בפתיחת הקישור",
				description: "לא ניתן לפתוח את הקישור כרגע",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	// Handle close with callback
	const handleClose = () => {
		setOpenDialog(false);
	};

	return (
		<Box
			bg={bgColor}
			overflow="hidden"
			role="dialog"
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
			style={{ direction: isRtl ? "rtl" : "ltr" }}
		>
			{/* Hero image section */}
			{link.initiativeImage && (
				<Box
					position="relative"
					h={{ base: "140px", md: "180px" }}
					overflow="hidden"
				>
					<Image
						src={link.initiativeImage}
						alt={link.displayName}
						w="100%"
						h="100%"
						objectFit="cover"
						fallback={<Skeleton h="100%" />}
					/>
					<Box
						position="absolute"
						bottom={0}
						left={0}
						right={0}
						h="100%"
						bg={imageOverlayGradient}
					/>
					<Box position="absolute" bottom={0} left={0} right={0} p={6} pb={4}>
						<Text
							id="modal-title"
							color={textColor}
							fontSize={{ base: "xl", md: "2xl" }}
							fontWeight="bold"
							letterSpacing="tight"
							lineHeight="1.2"
						>
							{link.displayName}
						</Text>
					</Box>
				</Box>
			)}

			<VStack
				spacing={5}
				align="stretch"
				p={6}
				pt={link.initiativeImage ? 2 : 6}
			>
				{/* Title for cases without image */}
				{!link.initiativeImage && (
					<Text
						id="modal-title"
						fontSize={{ base: "xl", md: "2xl" }}
						fontWeight="bold"
						color={textColor}
						letterSpacing="tight"
					>
						{link.displayName}
					</Text>
				)}

				{/* Short description - highlighted */}
				{link.shortDescription && (
					<Text
						fontSize={{ base: "md", md: "lg" }}
						color={textColor}
						fontWeight="medium"
						lineHeight="1.7"
					>
						{link.shortDescription}
					</Text>
				)}

				{/* Main description */}
				{link.description && (
					<Text
						id="modal-description"
						fontSize={{ base: "sm", md: "md" }}
						color={subtleTextColor}
						lineHeight="1.8"
						whiteSpace="pre-wrap"
					>
						{link.description}
					</Text>
				)}

				{/* Initiative icons/links */}
				<Box pt={2} borderTop="1px solid" borderColor={dividerColor}>
					<Text
						fontSize="xs"
						fontWeight="semibold"
						color={subtleTextColor}
						mb={3}
						textTransform="uppercase"
						letterSpacing="wide"
					>
						{isRtl ? "קישורים נוספים" : "Additional Links"}
					</Text>
					<InitiativeIcons link={link} />
				</Box>

				{/* Action buttons */}
				<Flex
					direction={{ base: "column", sm: "row" }}
					gap={3}
					pt={4}
					justify={{ base: "stretch", sm: "flex-start" }}
					align={{ base: "stretch", sm: "center" }}
				>
					<Button
						ref={buttonRef}
						size="lg"
						onClick={handleLinkClick}
						rightIcon={!isRtl ? <ExternalLinkIcon /> : undefined}
						leftIcon={isRtl ? <ExternalLinkIcon /> : undefined}
						bg={accentColor}
						color="white"
						_hover={{
							bg: accentHoverColor,
							transform: "translateY(-2px)",
							boxShadow: "lg",
						}}
						_active={{
							transform: "translateY(0)",
							boxShadow: "md",
						}}
						transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
						borderRadius="xl"
						px={8}
						fontWeight="semibold"
						boxShadow="md"
						aria-label={`פתח יוזמה: ${link.displayName}`}
					>
						{isRtl ? "פתח יוזמה" : "Open Initiative"}
					</Button>

					<Button
						variant="ghost"
						size="lg"
						onClick={handleClose}
						color={subtleTextColor}
						_hover={{
							bg: dividerColor,
							color: textColor,
						}}
						transition="all 0.2s"
						borderRadius="xl"
						px={6}
						fontWeight="medium"
						aria-label="סגור"
					>
						{isRtl ? "סגור" : "Close"}
					</Button>
				</Flex>

				{/* Tags section */}
				{link.tags && link.tags.length > 0 && (
					<Box pt={4} borderTop="1px solid" borderColor={dividerColor}>
						<Flex wrap="wrap" gap={2}>
							{link.tags.slice(0, 6).map((tag, index) => (
								<Text
									key={index}
									fontSize="xs"
									bg={tagBgColor}
									color={subtleTextColor}
									px={3}
									py={1.5}
									borderRadius="full"
									border="1px solid"
									borderColor={tagBorderColor}
									fontWeight="medium"
								>
									{tag}
								</Text>
							))}
							{link.tags.length > 6 && (
								<Text
									fontSize="xs"
									color={subtleTextColor}
									px={3}
									py={1.5}
									fontWeight="medium"
								>
									+{link.tags.length - 6}
								</Text>
							)}
						</Flex>
					</Box>
				)}
			</VStack>
		</Box>
	);
};
