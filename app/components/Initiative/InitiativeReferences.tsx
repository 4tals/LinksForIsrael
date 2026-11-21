"use client";

import React from "react";
import {
	FaGlobe,
	FaLinkedin,
	FaNewspaper,
	FaPenNib,
	FaPlus,
	FaPodcast,
	FaQuoteRight,
	FaShareAlt,
	FaShieldAlt,
	FaTwitter,
	FaVideo,
} from "react-icons/fa";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Badge, Box, Flex, Icon, Link, Text, VStack } from "@chakra-ui/react";

import { InitiativeLink, ReferenceType } from "../../utils/categories";

const REF_TYPE_META: Record<
	ReferenceType,
	{
		icon: React.ElementType;
		labelHe: string;
		labelEn: string;
		color: string;
		badgeScheme: string;
	}
> = {
	official: {
		icon: FaShieldAlt,
		labelHe: "מקור רשמי",
		labelEn: "Official",
		color: "green.600",
		badgeScheme: "green",
	},
	registry: {
		icon: FaShieldAlt,
		labelHe: "רישום / ויקיפדיה",
		labelEn: "Registry / Wiki",
		color: "teal.600",
		badgeScheme: "teal",
	},
	article: {
		icon: FaNewspaper,
		labelHe: "כתבה בתקשורת",
		labelEn: "Press Article",
		color: "brand.600",
		badgeScheme: "blue",
	},
	video: {
		icon: FaVideo,
		labelHe: "וידאו / טלוויזיה",
		labelEn: "Video / TV",
		color: "red.600",
		badgeScheme: "red",
	},
	podcast: {
		icon: FaPodcast,
		labelHe: "פודקאסט / ראיון",
		labelEn: "Podcast",
		color: "purple.600",
		badgeScheme: "purple",
	},
	blog: {
		icon: FaPenNib,
		labelHe: "בלוג / בדיקת עובדות",
		labelEn: "Blog / Fact-check",
		color: "orange.600",
		badgeScheme: "orange",
	},
	endorsement: {
		icon: FaQuoteRight,
		labelHe: "המלצה חיצונית",
		labelEn: "Endorsement",
		color: "cyan.700",
		badgeScheme: "cyan",
	},
	x_post: {
		icon: FaTwitter,
		labelHe: "אזכור ב-X",
		labelEn: "X Mention",
		color: "gray.800",
		badgeScheme: "gray",
	},
	linkedin: {
		icon: FaLinkedin,
		labelHe: "פוסט בלינקדאין",
		labelEn: "LinkedIn Post",
		color: "blue.700",
		badgeScheme: "linkedin",
	},
	social: {
		icon: FaShareAlt,
		labelHe: "אזכור ברשת",
		labelEn: "Community Mention",
		color: "purple.600",
		badgeScheme: "purple",
	},
	other: {
		icon: FaGlobe,
		labelHe: "מקור חיצוני",
		labelEn: "External Source",
		color: "gray.600",
		badgeScheme: "gray",
	},
};

interface InitiativeReferencesProps {
	link: InitiativeLink;
	isRtl: boolean;
}

export const InitiativeReferences: React.FC<InitiativeReferencesProps> = ({
	link,
	isRtl,
}) => {
	const references = link.references || [];

	const addReferenceIssueUrl = `https://github.com/4tals/LinksForIsrael/issues/new?template=add_reference.yml&title=${encodeURIComponent(
		`[REFERENCE]: ${link.displayName || link.name}`,
	)}&initiative=${encodeURIComponent(
		`${link.displayName || link.name} (${link.name})`,
	)}`;

	return (
		<Box>
			<Flex align="center" justify="space-between" mb={2} gap={2}>
				<Text
					fontSize="xs"
					fontWeight="bold"
					color="gray.500"
					textTransform="uppercase"
				>
					{isRtl
						? "אזכורים ממקורות חיצוניים"
						: "Third-Party Mentions & Coverage"}
				</Text>
				<Link
					href={addReferenceIssueUrl}
					isExternal
					fontSize="xs"
					fontWeight="semibold"
					color="brand.600"
					display="inline-flex"
					alignItems="center"
					gap={1}
					_hover={{ textDecoration: "underline" }}
				>
					<Icon as={FaPlus} boxSize={2.5} />
					{isRtl ? "הוסף אזכור / כתבה" : "Add mention"}
				</Link>
			</Flex>

			{references.length > 0 ? (
				<VStack spacing={2} align="stretch">
					{references.map((ref, idx) => {
						const meta = REF_TYPE_META[ref.type] || REF_TYPE_META.other;
						return (
							<Link
								key={`${ref.url}-${idx}`}
								href={ref.url}
								isExternal
								_hover={{ textDecoration: "none" }}
							>
								<Flex
									align="flex-start"
									justify="space-between"
									gap={3}
									px={3}
									py={2.5}
									borderRadius="lg"
									bg="gray.50"
									borderWidth="1px"
									borderColor="gray.200"
									transition="all 0.15s ease"
									_hover={{
										bg: "blue.50",
										borderColor: "blue.200",
									}}
								>
									<Flex align="flex-start" gap={2.5} minW={0} flex="1">
										<Icon
											as={meta.icon}
											color={meta.color}
											boxSize={3.5}
											mt={0.5}
											flexShrink={0}
										/>
										<Box minW={0} flex="1">
											<Text
												fontSize="xs"
												fontWeight="semibold"
												color="gray.800"
												noOfLines={2}
											>
												{ref.title || ref.source || ref.url}
											</Text>
											{ref.quote && (
												<Text
													fontSize="2xs"
													color="gray.600"
													fontStyle="italic"
													mt={1}
													ps={2}
													borderInlineStartWidth="2px"
													borderColor="brand.200"
													noOfLines={2}
												>
													&ldquo;{ref.quote}&rdquo;
												</Text>
											)}
											<Flex align="center" wrap="wrap" gap={1.5} mt={1}>
												<Badge
													fontSize="2xs"
													colorScheme={meta.badgeScheme}
													variant="subtle"
													borderRadius="full"
													px={1.5}
													textTransform="none"
												>
													{isRtl ? meta.labelHe : meta.labelEn}
												</Badge>
												{ref.source && ref.title && (
													<Text
														fontSize="2xs"
														fontWeight="medium"
														color="gray.600"
														noOfLines={1}
													>
														{ref.source}
													</Text>
												)}
												{ref.author && (
													<Text fontSize="2xs" color="gray.500" noOfLines={1}>
														{isRtl ? `· ${ref.author}` : `· by ${ref.author}`}
													</Text>
												)}
												{ref.date && (
													<Text fontSize="2xs" color="gray.400" dir="ltr">
														{ref.date}
													</Text>
												)}
											</Flex>
										</Box>
									</Flex>
									<ExternalLinkIcon
										color="gray.400"
										boxSize={3}
										mt={0.5}
										flexShrink={0}
									/>
								</Flex>
							</Link>
						);
					})}
				</VStack>
			) : (
				<Text fontSize="xs" color="gray.400">
					{isRtl
						? "טרם נוספו כתבות או אזכורים ממקורות חיצוניים. מכירים כתבה, ראיון, ערך ויקיפדיה או המלצה של גורם אחר? הוסיפו דרך GitHub."
						: "No third-party mentions yet. Know an article, interview, Wikipedia entry, or independent recommendation? Add it via GitHub."}
				</Text>
			)}
		</Box>
	);
};
