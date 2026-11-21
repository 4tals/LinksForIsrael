"use client";

import NextLink from "next/link";
import React, { useState } from "react";
import {
	FaBookmark,
	FaCheckCircle,
	FaEdit,
	FaFlag,
	FaLink,
	FaRegBookmark,
} from "react-icons/fa";

import { useBookmarks } from "@/app/components/Bookmarks/BookmarksContext";
import { analyticsService } from "@/app/utils/analytica/analytics";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Button,
	Divider,
	Flex,
	Icon,
	Image,
	Link,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";

import {
	getPrimaryInitiativeUrl,
	InitiativeLink as LinkType,
} from "../../utils/categories";
import { InitiativeIcons } from "./InitiativeIcons";
import { InitiativeReferences } from "./InitiativeReferences";

const containsHebrewLetters = (str: string): boolean =>
	/[\u0590-\u05EA]/.test(str);

interface ShowMoreModalProps {
	link: LinkType;
	setOpenDialog: (open: boolean) => void;
	sharePath?: string;
	locale?: "he" | "en";
}

export const ShowMoreModal: React.FC<ShowMoreModalProps> = ({
	link,
	setOpenDialog,
	sharePath,
	locale,
}) => {
	const [imageError, setImageError] = useState(false);
	const toast = useToast();
	const { isSaved, toggleSave } = useBookmarks();
	const saved = isSaved(link.name);

	const isRtl =
		locale !== undefined
			? locale === "he"
			: containsHebrewLetters(
					`${link.displayName || ""}${link.description || ""}${
						link.shortDescription || ""
					}`,
				);

	const primaryUrl = getPrimaryInitiativeUrl(link);

	const reportIssueUrl = `https://github.com/4tals/LinksForIsrael/issues/new?template=broken_link.yml&title=${encodeURIComponent(
		`[BROKEN-LINK]: ${link.displayName || link.name}`,
	)}&initiative=${encodeURIComponent(
		`${link.displayName || link.name} (${link.name})`,
	)}&url=${encodeURIComponent(primaryUrl || "")}`;

	const claimUpdateUrl = `https://github.com/4tals/LinksForIsrael/issues/new?title=${encodeURIComponent(
		`[UPDATE-LISTING]: ${link.displayName || link.name}`,
	)}&body=${encodeURIComponent(
		`Initiative: ${link.displayName || link.name} (${link.name})\nCurrent URL: ${
			primaryUrl || ""
		}\n\nRequested updates (description, hotline, Section 46, registration number, or third-party references):\n`,
	)}`;

	const guidestarSearchUrl = link.registrationNumber
		? `https://www.guidestar.org.il/organization/${encodeURIComponent(
				link.registrationNumber,
			)}`
		: `https://www.guidestar.org.il/search?q=${encodeURIComponent(
				link.displayName || link.name,
			)}`;

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
			typeof window !== "undefined"
				? window.location.href
				: primaryUrl || sharePath || "";

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

	const handleToggleSave = () => {
		const added = toggleSave({
			name: link.name,
			displayName: link.displayName,
			shortDescription: link.shortDescription,
			url: primaryUrl,
			phone: link.phone,
		});
		toast({
			title: isRtl
				? added
					? "נשמר לרשימה שלך"
					: "הוסר מהרשימה"
				: added
					? "Saved to your list"
					: "Removed from list",
			status: added ? "success" : "info",
			duration: 1800,
			isClosable: true,
		});
	};

	return (
		<Flex
			direction="column"
			flex="1"
			minH="100%"
			style={{ direction: isRtl ? "rtl" : "ltr" }}
		>
			{link.initiativeImage && !imageError && (
				<Box
					w="100%"
					h={{ base: "130px", md: "155px" }}
					bg="gray.50"
					borderBottomWidth="1px"
					borderColor="gray.100"
					overflow="hidden"
					display="flex"
					alignItems="center"
					justifyContent="center"
					p={3}
					flexShrink={0}
				>
					<Image
						src={link.initiativeImage}
						alt={link.displayName}
						maxW="100%"
						maxH="100%"
						objectFit="contain"
						onError={() => setImageError(true)}
					/>
				</Box>
			)}

			<VStack spacing={4} align="stretch" p={{ base: 5, md: 6 }} flex="1">
				{/* Verification Trust Strip */}
				{link.verified && (
					<Flex
						align="center"
						justify="space-between"
						wrap="wrap"
						gap={2}
						bg="green.50"
						borderWidth="1px"
						borderColor="green.200"
						borderRadius="lg"
						px={3.5}
						py={2.5}
					>
						<Flex align="center" gap={2} wrap="wrap">
							<Icon as={FaCheckCircle} color="green.600" boxSize={4} />
							<Text fontSize="xs" fontWeight="bold" color="green.800">
								{isRtl
									? link.organizationType === "official"
										? "גוף רשמי / לאומי מאומת"
										: "עמותה / ארגון מאומת"
									: link.organizationType === "official"
										? "Verified Official Institution"
										: "Verified Nonprofit Organization"}
							</Text>
							{link.properManagement && (
								<Badge
									colorScheme="teal"
									variant="solid"
									fontSize="2xs"
									borderRadius="full"
									px={2}
								>
									{isRtl ? "ניהול תקין (רשם העמותות)" : "Good Standing (MOJ)"}
								</Badge>
							)}
							{link.taxDeductible46 && (
								<Badge
									colorScheme="green"
									variant="solid"
									fontSize="2xs"
									borderRadius="full"
									px={2}
								>
									{isRtl ? "מוכר לסעיף 46" : "Tax-Deductible (§46)"}
								</Badge>
							)}
							{link.us501c3 && (
								<Badge
									colorScheme="purple"
									variant="solid"
									fontSize="2xs"
									borderRadius="full"
									px={2}
								>
									501(c)(3) US
								</Badge>
							)}
						</Flex>

						<Flex align="center" gap={3} wrap="wrap">
							{link.registryCheckedAt && (
								<Text fontSize="2xs" color="green.700">
									{isRtl
										? `נבדק ב-data.gov.il: ${link.registryCheckedAt}`
										: `MOJ checked: ${link.registryCheckedAt}`}
								</Text>
							)}
							{(link.organizationType === "ngo" || link.registrationNumber) && (
								<Link
									href={guidestarSearchUrl}
									isExternal
									fontSize="xs"
									fontWeight="semibold"
									color="green.700"
									display="inline-flex"
									alignItems="center"
									gap={1}
									_hover={{ textDecoration: "underline" }}
								>
									{isRtl
										? link.registrationNumber
											? `גיידסטאר (${link.registrationNumber})`
											: "בדיקה בגיידסטאר"
										: link.registrationNumber
											? `GuideStar (${link.registrationNumber})`
											: "GuideStar"}
									<ExternalLinkIcon boxSize={3} />
								</Link>
							)}
							<Link
								as={NextLink}
								href="/docs/methodology"
								fontSize="xs"
								color="green.700"
								opacity={0.85}
								_hover={{ textDecoration: "underline", opacity: 1 }}
								onClick={() => setOpenDialog(false)}
							>
								{isRtl ? "איך מאמתים?" : "How we verify"}
							</Link>
						</Flex>
					</Flex>
				)}

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

				<Divider />

				<InitiativeReferences link={link} isRtl={isRtl} />

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

				<Flex justify="space-between" align="center" wrap="wrap" gap={3} pt={1}>
					<Link
						href={claimUpdateUrl}
						isExternal
						fontSize="xs"
						color="brand.600"
						display="inline-flex"
						alignItems="center"
						gap={1.5}
						_hover={{ color: "brand.700", textDecoration: "underline" }}
					>
						<FaEdit size={11} />
						{isRtl
							? "נציגי העמותה? עדכנו פרטים"
							: "Represent this org? Update listing"}
					</Link>
					<Link
						href={reportIssueUrl}
						isExternal
						fontSize="xs"
						color="gray.500"
						display="inline-flex"
						alignItems="center"
						gap={1.5}
						_hover={{ color: "red.600", textDecoration: "underline" }}
					>
						<FaFlag size={11} />
						{isRtl ? "דווח על קישור שבור או לא עדכני" : "Report broken link"}
					</Link>
				</Flex>
			</VStack>

			{/* Sticky side-card action footer */}
			<Box
				position="sticky"
				bottom={0}
				bg="white"
				borderTopWidth="1px"
				borderColor="gray.200"
				px={{ base: 5, md: 6 }}
				py={3.5}
				zIndex={2}
			>
				<Flex gap={2} wrap="wrap" align="center" justify="space-between">
					<Flex gap={2} flex="1" wrap="wrap">
						{primaryUrl && (
							<Button
								colorScheme="blue"
								bg="brand.600"
								_hover={{ bg: "brand.700", transform: "translateY(-1px)" }}
								_active={{ transform: "translateY(0)" }}
								size="sm"
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
							variant={saved ? "solid" : "outline"}
							colorScheme="blue"
							size="sm"
							borderRadius="lg"
							leftIcon={saved ? <FaBookmark /> : <FaRegBookmark />}
							onClick={handleToggleSave}
						>
							{isRtl ? (saved ? "נשמר" : "שמור") : saved ? "Saved" : "Save"}
						</Button>

						<Button
							variant="outline"
							colorScheme="gray"
							size="sm"
							borderRadius="lg"
							leftIcon={<FaLink />}
							onClick={handleCopyShareLink}
						>
							{isRtl ? "העתק" : "Copy"}
						</Button>
					</Flex>

					<Button
						variant="ghost"
						size="sm"
						borderRadius="lg"
						onClick={() => setOpenDialog(false)}
						colorScheme="gray"
					>
						{isRtl ? "סגור" : "Close"}
					</Button>
				</Flex>
			</Box>
		</Flex>
	);
};
