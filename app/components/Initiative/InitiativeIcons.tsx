"use client";

import React from "react";
import {
	FaDiscord,
	FaEnvelope,
	FaFacebook,
	FaFileAlt,
	FaGlobe,
	FaGoogleDrive,
	FaHandHoldingHeart,
	FaInstagram,
	FaLinkedin,
	FaPhone,
	FaTelegram,
	FaTiktok,
	FaTwitter,
	FaWhatsapp,
	FaWpforms,
	FaYoutube,
} from "react-icons/fa";

import { Tooltip } from "@/app/components/LazyTooltip";
import {
	Flex,
	Icon,
	Link as ChakraLink,
	Tag,
	TagLabel,
	TagLeftIcon,
	Text,
} from "@chakra-ui/react";

import {
	analyticsService,
	buildAttributedUrl,
} from "../../utils/analytica/analytics";
import { InitiativeLink } from "../../utils/categories";
import { ICONS } from "../../utils/consts";

type IconKey = keyof typeof ICONS;

const ICON_COMPONENTS: Record<
	IconKey,
	{ icon: React.ElementType; color: string }
> = {
	website: { icon: FaGlobe, color: "#1d5cd6" },
	whatsapp: { icon: FaWhatsapp, color: "#16a34a" },
	telegram: { icon: FaTelegram, color: "#0284c7" },
	facebook: { icon: FaFacebook, color: "#1877f2" },
	instagram: { icon: FaInstagram, color: "#e11d48" },
	form: { icon: FaWpforms, color: "#7c3aed" },
	forms: { icon: FaWpforms, color: "#7c3aed" },
	docs: { icon: FaFileAlt, color: "#2563eb" },
	doc: { icon: FaFileAlt, color: "#2563eb" },
	drive: { icon: FaGoogleDrive, color: "#0f766e" },
	donation: { icon: FaHandHoldingHeart, color: "#9333ea" },
	youtube: { icon: FaYoutube, color: "#dc2626" },
	twitter: { icon: FaTwitter, color: "#0f172a" },
	linkedin: { icon: FaLinkedin, color: "#0a66c2" },
	tiktok: { icon: FaTiktok, color: "#111827" },
	discord: { icon: FaDiscord, color: "#4f46e5" },
	portal: { icon: FaGlobe, color: "#0038b8" },
};

interface InitiativeIconsProps {
	link: InitiativeLink;
	limit?: number;
	showContactDetails?: boolean;
}

export const InitiativeIcons: React.FC<InitiativeIconsProps> = ({
	link,
	limit,
	showContactDetails = false,
}) => {
	const seenUrls = new Set<string>();
	const iconEntries: { key: IconKey; href: string }[] = [];

	for (const key of Object.keys(ICONS) as IconKey[]) {
		const rawVal = link[key];
		if (typeof rawVal !== "string") continue;
		const trimmed = rawVal.trim();
		if (!trimmed || seenUrls.has(trimmed)) continue;
		seenUrls.add(trimmed);
		iconEntries.push({ key, href: trimmed });
	}

	const showIcons =
		limit && limit < iconEntries.length
			? iconEntries.slice(0, limit)
			: iconEntries;
	const overLimit =
		limit && limit < iconEntries.length ? iconEntries.length - limit : 0;

	const email = (link.email || link.contactEmail || "").trim();
	const phone = (link.phone || "").trim();

	if (showIcons.length === 0 && (!showContactDetails || (!email && !phone))) {
		return null;
	}

	return (
		<Flex direction="column" gap={2} mt={showContactDetails ? 2 : 0}>
			{showIcons.length > 0 && (
				<Flex direction="row" wrap="wrap" align="center" gap={1.5}>
					{showIcons.map(({ key, href }) => (
						<IconLink
							href={href}
							iconKey={key}
							alt={ICONS[key].alt}
							orgName={link.displayName || link.name}
							listingId={link.name}
							organizationType={link.organizationType}
							key={key}
						/>
					))}

					{overLimit > 0 && (
						<Text
							fontSize="xs"
							fontWeight="bold"
							color="gray.700"
							bg="gray.100"
							px={2}
							py={0.5}
							borderRadius="full"
						>
							+{overLimit}
						</Text>
					)}
				</Flex>
			)}

			{showContactDetails && (phone || email) && (
				<Flex wrap="wrap" gap={2} mt={1}>
					{phone && (
						<ChakraLink
							href={`tel:${phone.replace(/[^\d+*#]/g, "")}`}
							aria-label={`טלפון ${link.displayName}: ${phone}`}
							onClick={(e) => {
								e.stopPropagation();
								analyticsService.trackContactChannel({
									listingId: link.name,
									channel: "phone",
									url: `tel:${phone}`,
									organizationType: link.organizationType,
								});
							}}
							_hover={{ textDecoration: "none" }}
						>
							<Tag
								size="md"
								colorScheme="blue"
								variant="subtle"
								borderRadius="full"
								px={3}
								py={1.5}
							>
								<TagLeftIcon as={FaPhone} boxSize={3} />
								<TagLabel dir="ltr">{phone}</TagLabel>
							</Tag>
						</ChakraLink>
					)}
					{email && (
						<ChakraLink
							href={`mailto:${email}`}
							aria-label={`דוא״ל ${link.displayName}: ${email}`}
							onClick={(e) => {
								e.stopPropagation();
								analyticsService.trackContactChannel({
									listingId: link.name,
									channel: "email",
									url: `mailto:${email}`,
									organizationType: link.organizationType,
								});
							}}
							_hover={{ textDecoration: "none" }}
						>
							<Tag
								size="md"
								colorScheme="teal"
								variant="subtle"
								borderRadius="full"
								px={3}
								py={1.5}
							>
								<TagLeftIcon as={FaEnvelope} boxSize={3} />
								<TagLabel dir="ltr">{email}</TagLabel>
							</Tag>
						</ChakraLink>
					)}
				</Flex>
			)}
		</Flex>
	);
};

interface IconLinkProps {
	href: string;
	iconKey: IconKey;
	alt: string;
	orgName: string;
	listingId: string;
	organizationType?: InitiativeLink["organizationType"];
}

const IconLink: React.FC<IconLinkProps> = ({
	href,
	iconKey,
	alt,
	orgName,
	listingId,
	organizationType,
}) => {
	const meta = ICON_COMPONENTS[iconKey] || {
		icon: FaGlobe,
		color: "#1d5cd6",
	};

	return (
		<Tooltip label={alt} placement="top" hasArrow openDelay={200}>
			<ChakraLink
				href={buildAttributedUrl(href)}
				target="_blank"
				rel="noopener"
				aria-label={`${alt} — ${orgName}`}
				onClick={(e) => {
					e.stopPropagation();
					analyticsService.trackContactChannel({
						listingId,
						channel: iconKey,
						url: href,
						organizationType,
					});
				}}
				display="inline-flex"
				alignItems="center"
				justifyContent="center"
				boxSize="30px"
				borderRadius="md"
				bg="gray.50"
				borderWidth="1px"
				borderColor="gray.200"
				color={meta.color}
				transition="all 0.15s ease"
				_hover={{
					bg: "blue.50",
					borderColor: "blue.300",
					transform: "translateY(-1px)",
				}}
			>
				<Icon as={meta.icon} boxSize="15px" />
			</ChakraLink>
		</Tooltip>
	);
};
