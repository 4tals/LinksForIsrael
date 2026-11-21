"use client";

import React, { useState } from "react";
import { FaLink } from "react-icons/fa";

import { analyticsService } from "@/app/utils/analytica/analytics";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Button,
	Divider,
	Flex,
	Image,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";

import {
	getPrimaryInitiativeUrl,
	InitiativeLink as LinkType,
} from "../../utils/categories";
import { InitiativeIcons } from "./InitiativeIcons";

const containsHebrewLetters = (str: string): boolean =>
	/[\u0590-\u05EA]/.test(str);

interface ShowMoreModalProps {
	link: LinkType;
	setOpenDialog: (open: boolean) => void;
	sharePath?: string;
}

export const ShowMoreModal: React.FC<ShowMoreModalProps> = ({
	link,
	setOpenDialog,
	sharePath,
}) => {
	const [imageError, setImageError] = useState(false);
	const toast = useToast();

	const isRtl = containsHebrewLetters(
		`${link.displayName || ""}${link.description || ""}${
			link.shortDescription || ""
		}`,
	);

	const primaryUrl = getPrimaryInitiativeUrl(link);

	const handleLinkClick = () => {
		if (!primaryUrl) {
			toast({
				title: "אין קישור זמין",
				description: "לא נמצא קישור ראשי ליוזמה זו.",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}
		try {
			analyticsService.trackInitiativeClick(link.name, primaryUrl);
			window.open(primaryUrl, "_blank", "noopener,noreferrer");
		} catch {
			toast({
				title: "שגיאה בפתיחת הקישור",
				description: "לא ניתן לפתוח את הקישור כרגע",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const handleCopyShareLink = async () => {
		const urlToCopy =
			typeof window !== "undefined" && sharePath
				? `${window.location.origin}${sharePath}`
				: primaryUrl ||
					(typeof window !== "undefined" ? window.location.href : "");

		try {
			await navigator.clipboard.writeText(urlToCopy);
			toast({
				title: isRtl ? "הקישור הועתק ללוח" : "Link copied",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		} catch {
			toast({
				title: isRtl ? "לא ניתן להעתיק את הקישור" : "Could not copy link",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
		}
	};

	return (
		<Box style={{ direction: isRtl ? "rtl" : "ltr" }}>
			{link.initiativeImage && !imageError && (
				<Box
					w="100%"
					h={{ base: "150px", md: "190px" }}
					bg="gray.50"
					borderBottomWidth="1px"
					borderColor="gray.100"
					overflow="hidden"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Image
						src={link.initiativeImage}
						alt={link.displayName}
						w="100%"
						h="100%"
						objectFit="cover"
						onError={() => setImageError(true)}
					/>
				</Box>
			)}

			<VStack spacing={4} align="stretch" p={{ base: 5, md: 6 }}>
				{link.shortDescription && (
					<Text
						fontSize={{ base: "md", md: "lg" }}
						color="gray.800"
						fontWeight="semibold"
						lineHeight="1.6"
					>
						{link.shortDescription}
					</Text>
				)}

				{link.description && (
					<Text
						id="modal-description"
						fontSize={{ base: "sm", md: "md" }}
						color="gray.700"
						lineHeight="1.75"
						whiteSpace="pre-wrap"
					>
						{link.description}
					</Text>
				)}

				<Box>
					<Text
						fontSize="xs"
						fontWeight="bold"
						color="gray.500"
						textTransform="uppercase"
						mb={1}
					>
						{isRtl ? "קישורים ודרכי יצירת קשר" : "Links & Contact"}
					</Text>
					<InitiativeIcons link={link} showContactDetails />
				</Box>

				{link.tags && link.tags.length > 0 && (
					<>
						<Divider />
						<Box>
							<Text fontSize="xs" color="gray.500" fontWeight="semibold" mb={2}>
								{isRtl ? "תגיות" : "Tags"}
							</Text>
							<Flex wrap="wrap" gap={1.5}>
								{link.tags.slice(0, 8).map((tag, index) => (
									<Badge
										key={`${tag}-${index}`}
										px={2.5}
										py={1}
										borderRadius="full"
										colorScheme="blue"
										variant="subtle"
										fontWeight="medium"
										fontSize="xs"
									>
										{tag}
									</Badge>
								))}
							</Flex>
						</Box>
					</>
				)}

				<Divider />

				<Flex
					direction={{ base: "column", sm: "row" }}
					gap={2.5}
					justify="space-between"
					align={{ base: "stretch", sm: "center" }}
				>
					<Flex gap={2.5} direction={{ base: "column", sm: "row" }} flex="1">
						{primaryUrl && (
							<Button
								colorScheme="blue"
								bg="brand.600"
								_hover={{ bg: "brand.700", transform: "translateY(-1px)" }}
								_active={{ transform: "translateY(0)" }}
								size="md"
								borderRadius="lg"
								onClick={handleLinkClick}
								rightIcon={!isRtl ? <ExternalLinkIcon /> : undefined}
								leftIcon={isRtl ? <ExternalLinkIcon /> : undefined}
								aria-label={`פתח יוזמה: ${link.displayName}`}
							>
								{isRtl ? "מעבר ליוזמה" : "Open Initiative"}
							</Button>
						)}

						<Button
							variant="outline"
							colorScheme="blue"
							size="md"
							borderRadius="lg"
							leftIcon={<FaLink />}
							onClick={handleCopyShareLink}
						>
							{isRtl ? "העתק קישור" : "Copy Link"}
						</Button>
					</Flex>

					<Button
						variant="ghost"
						size="md"
						borderRadius="lg"
						onClick={() => setOpenDialog(false)}
						colorScheme="gray"
					>
						{isRtl ? "סגור" : "Close"}
					</Button>
				</Flex>
			</VStack>
		</Box>
	);
};
