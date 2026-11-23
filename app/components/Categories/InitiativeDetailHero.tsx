"use client";

import NextLink from "next/link";
import React from "react";
import {
	FaArrowRight,
	FaCheckCircle,
	FaExternalLinkAlt,
	FaPhoneAlt,
} from "react-icons/fa";

import { InitiativeIcons } from "@/app/components/Initiative/InitiativeIcons";
import { InitiativeReferences } from "@/app/components/Initiative/InitiativeReferences";
import { OrgAvatar } from "@/app/components/Initiative/OrgAvatar";
import { TrustScoreMeter } from "@/app/components/Initiative/TrustScoreMeter";
import {
	analyticsService,
	buildAttributedUrl,
} from "@/app/utils/analytica/analytics";
import {
	Category,
	getPrimaryInitiativeUrl,
	InitiativeLink,
	SubCategoryData,
} from "@/app/utils/categories";
import { portalPath } from "@/app/utils/portalPath";
import {
	Badge,
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	HStack,
	Icon,
	Link,
	Text,
	VStack,
} from "@chakra-ui/react";

import { CategoryBreadcrumbs } from "./CategoryBreadcrumbs";

/**
 * Server-rendered dedicated detail card shown on `/[category]/[subCategory]/[linkName]`.
 * Gives every single one of our 130+ initiative URLs a unique SSR `<h1>`, full description,
 * verified Ministry of Justice registry details, contact points, and third-party references
 * so Googlebot indexes each initiative page as a rich, authoritative standalone resource.
 */
export function InitiativeDetailHero({
	category,
	subCategory,
	link,
}: {
	category: Category;
	subCategory: SubCategoryData;
	link: InitiativeLink;
}) {
	const primaryUrl = getPrimaryInitiativeUrl(link);
	const guidestarUrl = link.registrationNumber
		? `https://www.guidestar.org.il/organization/${encodeURIComponent(
				link.registrationNumber,
			)}`
		: null;

	return (
		<Box className="desktop-content" pt={4} pb={2}>
			<CategoryBreadcrumbs
				items={[
					{ label: "דף הבית", href: "/" },
					{ label: category.displayName, href: `/${category.id}` },
					...(category.subCategories.length > 1
						? [
								{
									label: subCategory.displayName,
									href: `/${category.id}/${subCategory.name}`,
								},
							]
						: []),
					{ label: link.displayName },
				]}
			/>

			<Box
				as="article"
				bg="white"
				borderRadius="2xl"
				borderWidth="1px"
				borderColor="gray.200"
				boxShadow="sm"
				p={{ base: 5, md: 8 }}
				mb={6}
			>
				<Flex
					direction={{ base: "column", md: "row" }}
					justify="space-between"
					align={{ base: "flex-start", md: "center" }}
					gap={4}
					mb={5}
				>
					<Flex align="center" gap={4} minW={0} flex="1">
						<OrgAvatar
							name={link.displayName || link.name}
							imageUrl={link.initiativeImage}
							primaryUrl={primaryUrl}
							size="60px"
						/>
						<Box minW={0}>
							<Flex align="center" gap={2} wrap="wrap">
								<Heading
									as="h1"
									fontSize={{ base: "xl", md: "3xl" }}
									color="gray.900"
									lineHeight="1.25"
								>
									{link.displayName}
								</Heading>
								{link.verified && link.organizationType !== "licensed" && (
									<Icon as={FaCheckCircle} color="green.500" boxSize={5} />
								)}
							</Flex>

							<HStack spacing={2} wrap="wrap" mt={2}>
								<Badge colorScheme="blue" borderRadius="full" px={2.5} py={0.5}>
									{category.displayName}
								</Badge>
								{link.organizationType === "licensed" && (
									<Badge
										bg="gray.100"
										color="gray.800"
										borderWidth="1px"
										borderColor="gray.300"
										borderRadius="full"
										px={2.5}
										py={0.5}
									>
										{link.regulator
											? `שירות מפוקח · ${link.regulator}`
											: "שירות מסחרי מפוקח"}
									</Badge>
								)}
								{link.properManagement && (
									<Badge
										colorScheme="teal"
										borderRadius="full"
										px={2.5}
										py={0.5}
									>
										ניהול תקין מאומת (רשם העמותות)
									</Badge>
								)}
								{link.taxDeductible46 && (
									<Badge
										colorScheme="green"
										borderRadius="full"
										px={2.5}
										py={0.5}
									>
										מוכר לתרומות — סעיף 46
									</Badge>
								)}
								{link.registrationNumber && (
									<Badge
										colorScheme="gray"
										borderRadius="full"
										px={2.5}
										py={0.5}
									>
										מספר ארגון: {link.registrationNumber}
									</Badge>
								)}
							</HStack>
						</Box>
					</Flex>

					<HStack spacing={2} flexShrink={0} wrap="wrap">
						{link.phone && (
							<Button
								as={Link}
								href={`tel:${link.phone.replace(/[^\d+*#]/g, "")}`}
								colorScheme="green"
								size="md"
								borderRadius="full"
								leftIcon={<FaPhoneAlt />}
								onClick={() =>
									analyticsService.trackHotlineTap(
										link.name,
										link.phone || "",
										"detail_hero",
										"he",
									)
								}
								_hover={{ textDecoration: "none" }}
							>
								<span dir="ltr">{link.phone}</span>
							</Button>
						)}
						{primaryUrl && (
							<Button
								as={Link}
								href={buildAttributedUrl(primaryUrl)}
								target="_blank"
								rel="noopener"
								colorScheme="blue"
								bg="brand.600"
								_hover={{ bg: "brand.700", textDecoration: "none" }}
								size="md"
								borderRadius="full"
								leftIcon={<FaExternalLinkAlt size={12} />}
								onClick={() =>
									analyticsService.trackInitiativeClick(link.name, primaryUrl, {
										categoryId: category.id,
										organizationType: link.organizationType,
										locale: "he",
										clickSource: "detail_hero",
									})
								}
							>
								מעבר לאתר הרשמי
							</Button>
						)}
					</HStack>
				</Flex>

				<VStack spacing={4} align="stretch">
					<TrustScoreMeter link={link} isRtl />

					{link.shortDescription && (
						<Text
							fontSize={{ base: "md", md: "lg" }}
							fontWeight="semibold"
							color="gray.800"
						>
							{link.shortDescription}
						</Text>
					)}

					{link.description && (
						<Text
							fontSize="md"
							color="gray.700"
							lineHeight="1.8"
							whiteSpace="pre-wrap"
						>
							{link.description}
						</Text>
					)}

					<Box>
						<Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1.5}>
							ערוצי קשר וקישורים רשמיים
						</Text>
						<Flex align="center" gap={3} wrap="wrap">
							<InitiativeIcons link={link} showContactDetails />
							{guidestarUrl && (
								<Link
									href={guidestarUrl}
									isExternal
									fontSize="xs"
									fontWeight="semibold"
									color="green.700"
									_hover={{ textDecoration: "underline" }}
								>
									תיק הארגון בגיידסטאר ישראל ({link.registrationNumber})
								</Link>
							)}
						</Flex>
					</Box>

					{link.references && link.references.length > 0 && (
						<>
							<Divider />
							<InitiativeReferences link={link} isRtl />
						</>
					)}

					{link.tags && link.tags.length > 0 && (
						<Flex wrap="wrap" gap={1.5} pt={1}>
							{link.tags.map((tag, i) => (
								<Badge
									key={`${tag}-${i}`}
									colorScheme="blue"
									variant="subtle"
									borderRadius="full"
									px={2.5}
									py={0.5}
									fontSize="xs"
								>
									{tag}
								</Badge>
							))}
						</Flex>
					)}

					<Divider />

					<Flex justify="space-between" align="center" wrap="wrap" gap={2}>
						<Button
							as={NextLink}
							href={portalPath(category.id)}
							size="sm"
							variant="ghost"
							colorScheme="blue"
							leftIcon={<Icon as={FaArrowRight} />}
						>
							לכל הקישורים בתחום {category.displayName}
						</Button>
						{link.registryCheckedAt && (
							<Text fontSize="xs" color="gray.500">
								אימות אחרון מול מאגר רשם העמותות (data.gov.il):{" "}
								{link.registryCheckedAt}
							</Text>
						)}
					</Flex>
				</VStack>
			</Box>
		</Box>
	);
}
