import React, { useEffect, useRef } from "react";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
	Box,
	Text,
	Button,
	VStack,
	useColorModeValue,
	Flex,
	Divider,
	Skeleton,
	useToast,
	Image,
	Fade,
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
	const bgColor = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.700", "gray.200");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const buttonBgColor = useColorModeValue("blue.500", "blue.300");
	const buttonHoverColor = useColorModeValue("blue.600", "blue.400");
	const linkHoverBg = useColorModeValue("blue.50", "blue.900");
	const tagBgColor = useColorModeValue("gray.100", "gray.700");

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
			// Analytics or tracking could be added here
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
		<Fade in>
			<Box
				bg={bgColor}
				borderRadius="lg"
				border="1px solid"
				borderColor={borderColor}
				boxShadow="lg"
				overflow="hidden"
				maxW={{ base: "90vw", md: "500px" }}
				role="dialog"
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
				style={{ direction: isRtl ? "rtl" : "ltr" }}
			>
				{/* Header with initiative image and title */}
				{link.initiativeImage && (
					<Box position="relative" h="120px" overflow="hidden">
						<Image
							src={link.initiativeImage}
							alt={link.displayName}
							w="100%"
							h="100%"
							objectFit="cover"
							fallback={<Skeleton h="120px" />}
						/>
						<Box
							position="absolute"
							bottom={0}
							left={0}
							right={0}
							bg="linear-gradient(transparent, rgba(0,0,0,0.7))"
							p={4}
						>
							<Text
								id="modal-title"
								color="white"
								fontSize="xl"
								fontWeight="bold"
								textShadow="0 1px 2px rgba(0,0,0,0.8)"
							>
								{link.displayName}
							</Text>
						</Box>
					</Box>
				)}

				<VStack spacing={4} align="stretch" p={6}>
					{/* Title for cases without image */}
					{!link.initiativeImage && (
						<>
							<Text
								id="modal-title"
								fontSize="xl"
								fontWeight="bold"
								color={textColor}
							>
								{link.displayName}
							</Text>
							<Divider />
						</>
					)}

					{/* Short description */}
					{link.shortDescription && (
						<Text
							fontSize="md"
							color={textColor}
							fontWeight="medium"
							lineHeight="1.6"
						>
							{link.shortDescription}
						</Text>
					)}

					{/* Main description */}
					{link.description && (
						<Text
							id="modal-description"
							fontSize={{ base: "sm", md: "md" }}
							color={textColor}
							lineHeight="1.6"
							whiteSpace="pre-wrap"
						>
							{link.description}
						</Text>
					)}

					{/* Initiative icons/links */}
					<Box>
						<Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>
							{isRtl ? "קישורים נוספים:" : "Additional Links:"}
						</Text>
						<InitiativeIcons link={link} />
					</Box>

					{/* Action buttons */}
					<Flex
						direction={{ base: "column", sm: "row" }}
						gap={3}
						pt={2}
						justify={{ base: "stretch", sm: "space-between" }}
						align={{ base: "stretch", sm: "center" }}
					>
						<Button
							ref={buttonRef}
							colorScheme="blue"
							size="lg"
							onClick={handleLinkClick}
							rightIcon={!isRtl ? <ExternalLinkIcon /> : undefined}
							leftIcon={isRtl ? <ExternalLinkIcon /> : undefined}
							bg={buttonBgColor}
							_hover={{ bg: buttonHoverColor, transform: "translateY(-1px)" }}
							_active={{ transform: "translateY(0)" }}
							transition="all 0.2s"
							flex={{ base: "1", sm: "0" }}
							minW={{ base: "auto", sm: "140px" }}
							aria-label={`פתח יוזמה: ${link.displayName}`}
						>
							{isRtl ? "פתח יוזמה" : "Open Initiative"}
						</Button>

						<Button
							variant="outline"
							size="lg"
							onClick={handleClose}
							colorScheme="gray"
							_hover={{
								bg: linkHoverBg,
								borderColor: buttonBgColor,
								transform: "translateY(-1px)",
							}}
							_active={{ transform: "translateY(0)" }}
							transition="all 0.2s"
							flex={{ base: "1", sm: "0" }}
							minW={{ base: "auto", sm: "80px" }}
							aria-label="סגור"
						>
							{isRtl ? "סגור" : "Close"}
						</Button>
					</Flex>

					{/* Additional info or tags if available */}
					{link.tags && link.tags.length > 0 && (
						<>
							<Divider />
							<Box>
								<Text fontSize="xs" color={textColor} opacity={0.8} mb={2}>
									{isRtl ? "תגיות:" : "Tags:"}
								</Text>
								<Flex wrap="wrap" gap={1}>
									{link.tags.slice(0, 5).map((tag, index) => (
										<Text
											key={index}
											fontSize="xs"
											bg={tagBgColor}
											color={textColor}
											px={2}
											py={1}
											borderRadius="full"
											opacity={0.8}
										>
											{tag}
										</Text>
									))}
									{link.tags.length > 5 && (
										<Text
											fontSize="xs"
											color={textColor}
											opacity={0.6}
											px={2}
											py={1}
										>
											+{link.tags.length - 5}
										</Text>
									)}
								</Flex>
							</Box>
						</>
					)}
				</VStack>
			</Box>
		</Fade>
	);
};
