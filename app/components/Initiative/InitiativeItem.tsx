"use client";

import NextLink from "next/link";
import React from "react";
import {
	FaArrowLeft,
	FaArrowRight,
	FaBookmark,
	FaCheckCircle,
	FaLink,
	FaNewspaper,
	FaPhoneAlt,
	FaRegBookmark,
} from "react-icons/fa";

import { useBookmarks } from "@/app/components/Bookmarks/BookmarksContext";
import {
	analyticsService,
	buildAttributedUrl,
} from "@/app/utils/analytica/analytics";
import { portalPath } from "@/app/utils/portalPath";
import { buildUrlWithCard } from "@/app/utils/urlState";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Flex,
	Heading,
	HStack,
	Icon,
	IconButton,
	Link,
	Text,
	Tooltip,
	useToast,
} from "@chakra-ui/react";

import {
	getInitiativeIntents,
	getPrimaryInitiativeUrl,
	getReferenceSummary,
	InitiativeIntent,
	InitiativeLink as LinkType,
} from "../../utils/categories";
import { InitiativeIcons } from "./InitiativeIcons";
import { ShowMoreModal } from "./InitiativeShowMoreModal";
import { OrgAvatar } from "./OrgAvatar";

const containsHebrewLetters = (str: string): boolean =>
	/[\u0590-\u05EA]/.test(str);

const INTENT_STYLES: Record<
	InitiativeIntent,
	{ labelHe: string; labelEn: string; bg: string; color: string }
> = {
	"get-help": {
		labelHe: "סיוע",
		labelEn: "Get Help",
		bg: "blue.50",
		color: "blue.700",
	},
	volunteer: {
		labelHe: "התנדבות",
		labelEn: "Volunteer",
		bg: "teal.50",
		color: "teal.700",
	},
	donate: {
		labelHe: "תרומה",
		labelEn: "Donate",
		bg: "purple.50",
		color: "purple.700",
	},
};

function formatDisplayDomain(url: string | null): string | null {
	if (!url) return null;
	if (url.startsWith("mailto:")) return url.replace(/^mailto:/i, "");
	try {
		const parsed = new URL(url);
		return parsed.hostname.replace(/^www\./, "");
	} catch {
		return null;
	}
}

interface InitiativeItemProps {
	link: LinkType;
	categoryId?: string;
	subCategoryName?: string;
	locale?: "he" | "en";
	categoryBadge?: { label: string; bg: string; color: string };
	cardIdForCopy?: string;
	onOpenCard?: () => void;
	setDescription?: (description: {
		body: React.ReactNode;
		link: LinkType;
	}) => void;
	setOpenDialog?: (open: boolean) => void;
}

export const InitiativeItem: React.FC<InitiativeItemProps> = ({
	link,
	categoryId,
	subCategoryName,
	locale,
	categoryBadge,
	cardIdForCopy,
	onOpenCard,
	setDescription,
	setOpenDialog,
}) => {
	const toast = useToast();
	const { isSaved, toggleSave } = useBookmarks();
	const saved = isSaved(link.name);

	const isRtl =
		locale !== undefined
			? locale === "he"
			: containsHebrewLetters(
					`${link.displayName || ""}${link.shortDescription || ""}`,
				);

	const primaryUrl = getPrimaryInitiativeUrl(link);
	const displayDomain = formatDisplayDomain(primaryUrl);
	const intents = categoryBadge
		? []
		: getInitiativeIntents(link, categoryId).slice(0, 2);
	const refSummary = getReferenceSummary(link, 2);

	const sharePath =
		categoryId && subCategoryName
			? portalPath(categoryId, subCategoryName, link.name)
			: undefined;

	const openDetailsModal = () => {
		analyticsService.trackListingOpen(link.name, {
			categoryId,
			organizationType: link.organizationType,
			locale: isRtl ? "he" : "en",
			clickSource: "card",
		});
		if (onOpenCard) {
			onOpenCard();
			return;
		}
		if (!setDescription || !setOpenDialog) return;
		setDescription({
			link,
			body: (
				<ShowMoreModal
					link={link}
					setOpenDialog={setOpenDialog}
					sharePath={sharePath}
					categoryId={categoryId}
					locale={locale}
				/>
			),
		});
		setOpenDialog(true);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			openDetailsModal();
		}
	};

	const handleQuickCopy = async (e: React.MouseEvent) => {
		e.stopPropagation();
		const target =
			typeof window !== "undefined"
				? buildUrlWithCard(cardIdForCopy || link.name)
				: primaryUrl || "";
		if (!target) return;
		try {
			await navigator.clipboard.writeText(target);
			analyticsService.trackToolUsed(
				"copy_link",
				link.name,
				isRtl ? "he" : "en",
			);
			toast({
				title: isRtl ? "הקישור הועתק ללוח" : "Card link copied",
				status: "success",
				duration: 1800,
				isClosable: true,
			});
		} catch {
			// Clipboard unavailable
		}
	};

	const handleToggleBookmark = (e: React.MouseEvent) => {
		e.stopPropagation();
		const added = toggleSave({
			name: link.name,
			displayName: link.displayName,
			shortDescription: link.shortDescription,
			url: primaryUrl,
			phone: link.phone,
			categoryId,
			subCategoryName,
		});
		analyticsService.trackToolUsed(
			added ? "bookmark_add" : "bookmark_remove",
			link.name,
			isRtl ? "he" : "en",
		);
		toast({
			title: isRtl
				? added
					? "נשמר לרשימה שלך"
					: "הוסר מהרשימה"
				: added
					? "Saved to your list"
					: "Removed from list",
			status: added ? "success" : "info",
			duration: 1600,
			isClosable: true,
		});
	};

	return (
		<Flex
			as="article"
			data-group=""
			tabIndex={0}
			aria-label={`פרטים נוספים על ${link.displayName}`}
			direction="column"
			position="relative"
			bg="white"
			borderRadius="16px"
			borderWidth="1px"
			borderColor={saved ? "brand.300" : "gray.200"}
			p={5}
			h="100%"
			cursor="pointer"
			overflow="hidden"
			boxShadow="0 1px 2px rgba(15, 23, 42, 0.04)"
			transition="transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s ease, border-color 0.22s ease"
			_hover={{
				borderColor: "brand.300",
				transform: "translateY(-3px)",
				boxShadow:
					"0 14px 28px -10px rgba(0, 56, 184, 0.14), 0 4px 10px -4px rgba(15, 23, 42, 0.06)",
			}}
			_active={{ transform: "translateY(-1px) scale(0.995)" }}
			_focusVisible={{
				outline: "none",
				borderColor: "brand.500",
				boxShadow: "0 0 0 3px rgba(29, 92, 214, 0.3)",
			}}
			onClick={openDetailsModal}
			onKeyDown={handleKeyDown}
			style={{ direction: isRtl ? "rtl" : "ltr" }}
		>
			{/* Top subtle brand accent bar on hover */}
			<Box
				position="absolute"
				top={0}
				left={0}
				right={0}
				h="3px"
				bgGradient="linear(to-r, brand.500, cyan.400)"
				opacity={saved ? 0.85 : 0}
				transition="opacity 0.22s ease"
				_groupHover={{ opacity: 1 }}
			/>

			{/* Header Row: 48px Brand Squircle + Title/Domain + Zero-Click Micro-Actions */}
			<Flex align="flex-start" justify="space-between" gap={2.5} mb={3}>
				<Flex align="center" gap={3} minW={0} flex="1">
					<OrgAvatar
						name={link.displayName || link.name}
						imageUrl={link.initiativeImage}
						primaryUrl={primaryUrl}
					/>
					<Box minW={0} flex="1">
						<Flex align="center" gap={1.5}>
							<Heading
								as="h3"
								fontSize="md"
								fontWeight="bold"
								color="gray.900"
								lineHeight="1.35"
								noOfLines={2}
								transition="color 0.15s ease"
								_groupHover={{ color: "brand.600" }}
							>
								{link.displayName}
							</Heading>
							{link.verified && link.organizationType !== "licensed" && (
								<Tooltip
									label={
										isRtl
											? link.organizationType === "official"
												? "גוף רשמי מאומת"
												: "עמותה / ארגון מאומת"
											: link.organizationType === "official"
												? "Verified Official Institution"
												: "Verified Organization"
									}
									placement="top"
									hasArrow
								>
									<Box
										as="span"
										color="green.500"
										display="inline-flex"
										flexShrink={0}
									>
										<Icon as={FaCheckCircle} boxSize={3.5} />
									</Box>
								</Tooltip>
							)}
						</Flex>
						{displayDomain && (
							<Text
								fontSize="xs"
								color="gray.600"
								fontWeight="medium"
								noOfLines={1}
								mt={0.5}
								dir="ltr"
								textAlign={isRtl ? "right" : "left"}
							>
								{displayDomain}
							</Text>
						)}
					</Box>
				</Flex>

				{/* Zero-click micro-actions (isolated from card click) */}
				<HStack spacing={0.5} flexShrink={0}>
					<Tooltip
						label={saved ? "הסר מהרשימה" : "שמור לרשימה לשיתוף"}
						placement="top"
						hasArrow
					>
						<IconButton
							aria-label={
								saved
									? `הסר את ${link.displayName} מהרשימה`
									: `שמור את ${link.displayName} לרשימה`
							}
							icon={
								saved ? <FaBookmark size={12} /> : <FaRegBookmark size={12} />
							}
							size="xs"
							variant="ghost"
							color={saved ? "brand.600" : "gray.600"}
							borderRadius="lg"
							opacity={saved ? 1 : { base: 1, md: 0.75 }}
							_groupHover={{ opacity: 1 }}
							_focusVisible={{ opacity: 1 }}
							_hover={{ bg: "brand.50", color: "brand.600" }}
							onClick={handleToggleBookmark}
						/>
					</Tooltip>
					<Tooltip
						label={isRtl ? "העתק קישור" : "Copy link"}
						placement="top"
						hasArrow
					>
						<IconButton
							aria-label={
								isRtl
									? `העתק קישור עבור ${link.displayName}`
									: `Copy link for ${link.displayName}`
							}
							icon={<FaLink size={12} />}
							size="xs"
							variant="ghost"
							color="gray.600"
							borderRadius="lg"
							opacity={{ base: 0.85, md: 0 }}
							_groupHover={{ opacity: 1 }}
							_focusVisible={{ opacity: 1 }}
							_hover={{ bg: "gray.100", color: "brand.600" }}
							onClick={handleQuickCopy}
						/>
					</Tooltip>
					{primaryUrl && (
						<Tooltip
							label={isRtl ? "מעבר ישיר לאתר" : "Open directly"}
							placement="top"
							hasArrow
						>
							<IconButton
								as={Link}
								href={buildAttributedUrl(primaryUrl)}
								target="_blank"
								rel="noopener"
								aria-label={
									isRtl
										? `פתח ${link.displayName} בלשונית חדשה`
										: `Open ${link.displayName} in new tab`
								}
								icon={<ExternalLinkIcon boxSize={3.5} />}
								size="xs"
								variant="ghost"
								color="gray.600"
								borderRadius="lg"
								_hover={{
									bg: "brand.50",
									color: "brand.600",
									textDecoration: "none",
								}}
								_groupHover={{ color: "brand.500" }}
								onClick={(e) => {
									e.stopPropagation();
									analyticsService.trackInitiativeClick(link.name, primaryUrl, {
										categoryId,
										organizationType: link.organizationType,
										locale: isRtl ? "he" : "en",
										clickSource: "card_direct",
									});
								}}
							/>
						</Tooltip>
					)}
				</HStack>
			</Flex>

			{/* Category / Intent Badges + Good Standing + Section 46 + 501(c)(3) + Hotline Pill */}
			<Flex wrap="wrap" gap={1.5} mb={2.5} align="center">
				{categoryBadge && (
					<Badge
						bg={categoryBadge.bg}
						color={categoryBadge.color}
						fontSize="2xs"
						fontWeight="semibold"
						px={2.5}
						py={0.5}
						borderRadius="full"
						textTransform="none"
					>
						{categoryBadge.label}
					</Badge>
				)}
				{intents.map((intent) => (
					<Badge
						key={intent}
						bg={INTENT_STYLES[intent].bg}
						color={INTENT_STYLES[intent].color}
						fontSize="2xs"
						fontWeight="semibold"
						px={2}
						py={0.5}
						borderRadius="full"
						textTransform="none"
					>
						{isRtl
							? INTENT_STYLES[intent].labelHe
							: INTENT_STYLES[intent].labelEn}
					</Badge>
				))}
				{link.organizationType === "licensed" && (
					<Tooltip
						label={
							link.regulator
								? isRtl
									? `שירות מסחרי מפוקח (${link.regulator}) — אינו עמותה`
									: `Regulated commercial service (${link.regulator}) — not a nonprofit`
								: isRtl
									? "שירות מסחרי מפוקח ברישיון — אינו עמותה"
									: "Licensed commercial service — not a nonprofit"
						}
						placement="top"
						hasArrow
					>
						<Badge
							bg="gray.100"
							color="gray.800"
							borderWidth="1px"
							borderColor="gray.300"
							fontSize="2xs"
							fontWeight="semibold"
							px={2}
							py={0.5}
							borderRadius="full"
							textTransform="none"
						>
							{isRtl ? "שירות מפוקח" : "Licensed Service"}
						</Badge>
					</Tooltip>
				)}
				{link.properManagement && (
					<Tooltip
						label={
							isRtl
								? link.registryCheckedAt
									? `אישור ניהול תקין מאומת מול רשם העמותות (data.gov.il, ${link.registryCheckedAt})`
									: "אישור ניהול תקין מאומת מול רשם העמותות"
								: link.registryCheckedAt
									? `Verified Good Standing in Israel MOJ registry (data.gov.il, ${link.registryCheckedAt})`
									: "Verified Good Standing (Israel Ministry of Justice)"
						}
						placement="top"
						hasArrow
					>
						<Badge
							bg="teal.50"
							color="teal.700"
							fontSize="2xs"
							fontWeight="semibold"
							px={2}
							py={0.5}
							borderRadius="full"
							textTransform="none"
						>
							{isRtl ? "ניהול תקין" : "MOJ Verified"}
						</Badge>
					</Tooltip>
				)}
				{link.us501c3 && !isRtl && (
					<Badge
						bg="purple.50"
						color="purple.700"
						fontSize="2xs"
						fontWeight="semibold"
						px={2}
						py={0.5}
						borderRadius="full"
						textTransform="none"
					>
						501(c)(3)
					</Badge>
				)}
				{link.taxDeductible46 && (
					<Badge
						bg="emerald.50"
						backgroundColor="#ecfdf5"
						color="#047857"
						fontSize="2xs"
						fontWeight="semibold"
						px={2}
						py={0.5}
						borderRadius="full"
						textTransform="none"
					>
						{isRtl ? "סעיף 46" : "§46"}
					</Badge>
				)}
				{refSummary && (
					<Tooltip label={refSummary.tooltip} placement="top" hasArrow>
						<Badge
							bg="gray.100"
							color="gray.700"
							fontSize="2xs"
							fontWeight="medium"
							px={2}
							py={0.5}
							borderRadius="full"
							textTransform="none"
							display="inline-flex"
							alignItems="center"
							gap={1}
							maxW="200px"
						>
							<Icon
								as={FaNewspaper}
								boxSize={2.5}
								color="brand.500"
								flexShrink={0}
							/>
							<Text as="span" noOfLines={1}>
								{refSummary.label}
							</Text>
						</Badge>
					</Tooltip>
				)}
				{link.phone && (
					<Link
						href={`tel:${link.phone.replace(/[^\d+*#]/g, "")}`}
						onClick={(e) => {
							e.stopPropagation();
							analyticsService.trackHotlineTap(
								link.name,
								link.phone || "",
								"card_phone_pill",
								isRtl ? "he" : "en",
							);
						}}
						_hover={{ textDecoration: "none" }}
					>
						<Badge
							bg="green.50"
							color="green.700"
							fontSize="2xs"
							fontWeight="bold"
							px={2}
							py={0.5}
							borderRadius="full"
							display="inline-flex"
							alignItems="center"
							gap={1}
							_hover={{ bg: "green.100" }}
						>
							<Icon as={FaPhoneAlt} boxSize={2} />
							<span dir="ltr">{link.phone}</span>
						</Badge>
					</Link>
				)}
			</Flex>

			{/* Strict 2-line description for crisp uniform grid alignment */}
			{link.shortDescription && (
				<Text
					fontSize="sm"
					color="gray.600"
					lineHeight="1.55"
					noOfLines={2}
					mb={4}
				>
					{link.shortDescription}
				</Text>
			)}

			{/* Equalized Footer Row */}
			<Flex
				mt="auto"
				pt={3}
				borderTopWidth="1px"
				borderColor="gray.100"
				align="center"
				justify="space-between"
				gap={2}
			>
				<Box flex="1" minW={0}>
					<InitiativeIcons link={link} limit={4} />
				</Box>

				{sharePath ? (
					<Link
						as={NextLink}
						href={sharePath}
						aria-label={
							isRtl
								? `לפרטים נוספים על ${link.displayName}`
								: `Details for ${link.displayName}`
						}
						onClick={(e) => {
							if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
								e.preventDefault();
								e.stopPropagation();
								openDetailsModal();
							} else {
								e.stopPropagation();
							}
						}}
						display="inline-flex"
						alignItems="center"
						gap={1.5}
						fontSize="xs"
						fontWeight="semibold"
						color="brand.600"
						whiteSpace="nowrap"
						flexShrink={0}
						_hover={{ textDecoration: "none", color: "brand.700" }}
					>
						<span>{isRtl ? "לפרטים" : "Details"}</span>
						<Icon
							as={isRtl ? FaArrowLeft : FaArrowRight}
							boxSize={2.5}
							transition="transform 0.2s ease"
							_groupHover={{
								transform: isRtl ? "translateX(-3px)" : "translateX(3px)",
							}}
						/>
					</Link>
				) : (
					<Flex
						align="center"
						gap={1.5}
						fontSize="xs"
						fontWeight="semibold"
						color="brand.600"
						whiteSpace="nowrap"
						flexShrink={0}
					>
						<span>{isRtl ? "לפרטים" : "Details"}</span>
						<Icon
							as={isRtl ? FaArrowLeft : FaArrowRight}
							boxSize={2.5}
							transition="transform 0.2s ease"
							_groupHover={{
								transform: isRtl ? "translateX(-3px)" : "translateX(3px)",
							}}
						/>
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};
