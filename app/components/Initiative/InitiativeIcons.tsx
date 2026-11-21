"use client";

import React from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";

import {
	Flex,
	Icon,
	Image,
	Link as ChakraLink,
	Tag,
	TagLabel,
	TagLeftIcon,
	Text,
	Tooltip,
} from "@chakra-ui/react";

import { InitiativeLink } from "../../utils/categories";
import { ICONS } from "../../utils/consts";

type IconKey = keyof typeof ICONS;

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
							iconUrl={ICONS[key].src}
							alt={ICONS[key].alt}
							key={key}
						/>
					))}

					{overLimit > 0 && (
						<Text
							fontSize="xs"
							fontWeight="bold"
							color="gray.500"
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
							onClick={(e) => e.stopPropagation()}
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
							onClick={(e) => e.stopPropagation()}
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
	iconUrl: string;
	alt: string;
}

const IconLink: React.FC<IconLinkProps> = ({ href, iconUrl, alt }) => {
	return (
		<Tooltip label={alt} placement="top" hasArrow openDelay={200}>
			<ChakraLink
				href={href}
				isExternal
				aria-label={alt}
				onClick={(e) => e.stopPropagation()}
				display="inline-flex"
				alignItems="center"
				justifyContent="center"
				p={1}
				borderRadius="md"
				bg="gray.50"
				borderWidth="1px"
				borderColor="gray.100"
				transition="all 0.15s ease"
				_hover={{
					bg: "blue.50",
					borderColor: "blue.200",
					transform: "translateY(-1px)",
				}}
			>
				<Image
					src={iconUrl}
					alt={alt}
					boxSize="22px"
					objectFit="contain"
					loading="lazy"
					fallback={<Icon boxSize="22px" color="gray.400" />}
				/>
			</ChakraLink>
		</Tooltip>
	);
};
