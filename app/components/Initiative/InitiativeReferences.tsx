"use client";

import React from "react";
import {
	FaGlobe,
	FaLinkedin,
	FaNewspaper,
	FaPlus,
	FaShareAlt,
	FaShieldAlt,
	FaTwitter,
} from "react-icons/fa";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Badge, Box, Flex, Icon, Link, Text, VStack } from "@chakra-ui/react";

import { InitiativeLink, ReferenceType } from "../../utils/categories";

const REF_TYPE_META: Record<
	ReferenceType,
	{ icon: React.ElementType; labelHe: string; labelEn: string; color: string }
> = {
	official: {
		icon: FaShieldAlt,
		labelHe: "מקור רשמי",
		labelEn: "Official",
		color: "green.600",
	},
	registry: {
		icon: FaShieldAlt,
		labelHe: "רישום / אימות",
		labelEn: "Registry",
		color: "green.600",
	},
	article: {
		icon: FaNewspaper,
		labelHe: "כתבה",
		labelEn: "Article",
		color: "brand.600",
	},
	x_post: {
		icon: FaTwitter,
		labelHe: "פוסט ב-X",
		labelEn: "X Post",
		color: "gray.800",
	},
	linkedin: {
		icon: FaLinkedin,
		labelHe: "לינקדאין",
		labelEn: "LinkedIn",
		color: "blue.700",
	},
	social: {
		icon: FaShareAlt,
		labelHe: "פוסט ברשת",
		labelEn: "Social Post",
		color: "purple.600",
	},
	other: {
		icon: FaGlobe,
		labelHe: "סימוכין",
		labelEn: "Reference",
		color: "gray.600",
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
					{isRtl ? "כתבות, פוסטים וסימוכין" : "Articles, Posts & References"}
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
					{isRtl ? "הוסף אזכור / כתבה" : "Add reference"}
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
									align="center"
									justify="space-between"
									gap={3}
									px={3}
									py={2}
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
									<Flex align="center" gap={2.5} minW={0} flex="1">
										<Icon
											as={meta.icon}
											color={meta.color}
											boxSize={3.5}
											flexShrink={0}
										/>
										<Box minW={0} flex="1">
											<Text
												fontSize="xs"
												fontWeight="semibold"
												color="gray.800"
												noOfLines={1}
											>
												{ref.title || ref.source || ref.url}
											</Text>
											<Flex align="center" gap={1.5} mt={0.5}>
												<Badge
													fontSize="2xs"
													colorScheme="gray"
													variant="subtle"
													borderRadius="full"
													px={1.5}
													textTransform="none"
												>
													{isRtl ? meta.labelHe : meta.labelEn}
												</Badge>
												{ref.source && ref.title && (
													<Text fontSize="2xs" color="gray.500" noOfLines={1}>
														{ref.source}
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
						? "טרם נוספו כתבות או אזכורים. מכירים כתבה או פוסט רלוונטי? הוסיפו דרך GitHub."
						: "No references yet. Know an article or post about this initiative? Add it via GitHub."}
				</Text>
			)}
		</Box>
	);
};
