"use client";

import React from "react";
import { FaArrowLeft, FaArrowRight, FaLink, FaPhoneAlt } from "react-icons/fa";

import { analyticsService } from "@/app/utils/analytica/analytics";
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
	{ label: string; bg: string; color: string }
> = {
	"get-help": { label: "סיוע", bg: "blue.50", color: "blue.700" },
	volunteer: { label: "התנדבות", bg: "teal.50", color: "teal.700" },
	donate: { label: "תרומה", bg: "purple.50", color: "purple.700" },
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
	setDescription: (description: {
		body: React.ReactNode;
		link: LinkType;
	}) => void;
	setOpenDialog: (open: boolean) => void;
}

export const InitiativeItem: React.FC<InitiativeItemProps> = ({
	link,
	categoryId,
	subCategoryName,
	setDescription,
	setOpenDialog,
}) => {
	const toast = useToast();
	const isRtl = containsHebrewLetters(
		`${link.displayName || ""}${link.shortDescription || ""}`,
	);

	const primaryUrl = getPrimaryInitiativeUrl(link);
	const displayDomain = formatDisplayDomain(primaryUrl);
	const intents = getInitiativeIntents(link, categoryId).slice(0, 2);

	const sharePath =
		categoryId && subCategoryName
			? `/${encodeURIComponent(categoryId)}/${encodeURIComponent(
					subCategoryName,
				)}/${encodeURIComponent(link.name)}`
			: undefined;

	const openDetailsModal = () => {
		setDescription({
			link,
			body: (
				<ShowMoreModal
					link={link}
					setOpenDialog={setOpenDialog}
					sharePath={sharePath}
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
			typeof window !== "undefined" && sharePath
				? `${window.location.origin}${sharePath}`
				: primaryUrl || "";
		if (!target) return;
		try {
			await navigator.clipboard.writeText(target);
			toast({
				title: isRtl ? "הקישור הועתק ללוח" : "Link copied",
				status: "success",
				duration: 1800,
				isClosable: true,
			});
		} catch {
			// Clipboard unavailable
		}
	};

	return (
		<Flex
			as="article"
			role="group"
			tabIndex={0}
			aria-label={`פרטים נוספים על ${link.displayName}`}
			direction="column"
			position="relative"
			bg="white"
			borderRadius="16px"
			borderWidth="1px"
			borderColor="gray.200"
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
				opacity={0}
				transition="opacity 0.22s ease"
				_groupHover={{ opacity: 1 }}
			/>

			{/* Header Row: 48px Brand Squircle + Title/Domain + Zero-Click Micro-Actions */}
			<Flex align="flex-start" justify="space-between" gap={3} mb={3}>
				<Flex align="center" gap={3} minW={0} flex="1">
					<OrgAvatar
						name={link.displayName || link.name}
						imageUrl={link.initiativeImage}
						primaryUrl={primaryUrl}
					/>
					<Box minW={0} flex="1">
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
						{displayDomain && (
							<Text
								fontSize="xs"
								color="gray.400"
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
				<HStack spacing={1} flexShrink={0}>
					<Tooltip
						label={isRtl ? "העתק קישור" : "Copy link"}
						placement="top"
						hasArrow
					>
						<IconButton
							aria-label={isRtl ? "העתק קישור" : "Copy link"}
							icon={<FaLink size={12} />}
							size="xs"
							variant="ghost"
							color="gray.400"
							borderRadius="lg"
							opacity={{ base: 1, md: 0 }}
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
								href={primaryUrl}
								isExternal
								aria-label={
									isRtl
										? `פתח ${link.displayName} בלשונית חדשה`
										: `Open ${link.displayName} in new tab`
								}
								icon={<ExternalLinkIcon boxSize={3.5} />}
								size="xs"
								variant="ghost"
								color="gray.400"
								borderRadius="lg"
								_hover={{
									bg: "brand.50",
									color: "brand.600",
									textDecoration: "none",
								}}
								_groupHover={{ color: "brand.500" }}
								onClick={(e) => {
									e.stopPropagation();
									analyticsService.trackInitiativeClick(link.name, primaryUrl);
								}}
							/>
						</Tooltip>
					)}
				</HStack>
			</Flex>

			{/* Intent Badges + Optional Hotline Pill */}
			<Flex wrap="wrap" gap={1.5} mb={2.5} align="center">
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
						{INTENT_STYLES[intent].label}
					</Badge>
				))}
				{link.phone && (
					<Link
						href={`tel:${link.phone.replace(/[^\d+*#]/g, "")}`}
						onClick={(e) => e.stopPropagation()}
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
			</Flex>
		</Flex>
	);
};
