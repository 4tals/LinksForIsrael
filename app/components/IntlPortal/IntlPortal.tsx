"use client";

import NextLink from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	FaArrowLeft,
	FaArrowRight,
	FaCheckCircle,
	FaGlobe,
	FaLink,
	FaNewspaper,
	FaPhoneAlt,
	FaSearch,
	FaShareAlt,
} from "react-icons/fa";

import { DialogModal } from "@/app/components/DialogModal/DialogModal";
import {
	filterInitiativesByTrust,
	hasActiveTrustFilters,
	INITIAL_TRUST_FILTER,
	TrustFilterBar,
	TrustFilterState,
} from "@/app/components/Filters/TrustFilterBar";
import { ShowMoreModal } from "@/app/components/Initiative/InitiativeShowMoreModal";
import { OrgAvatar } from "@/app/components/Initiative/OrgAvatar";
import { Logo } from "@/app/components/Logo";
import { getReferenceSummary } from "@/app/utils/categories";
import {
	buildUrlWithCard,
	getUrlParams,
	parseTrustFiltersFromParams,
	trustFiltersToUrlPatch,
	updateUrlParams,
} from "@/app/utils/urlState";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Button,
	Container,
	Flex,
	Heading,
	HStack,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Link,
	SimpleGrid,
	Text,
	Tooltip,
	useToast,
	VStack,
} from "@chakra-ui/react";

import {
	EnrichedIntlInitiative,
	IntlPortalConfig,
	PortalLocale,
} from "./intlCatalog";

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
	donate: { bg: "purple.50", color: "purple.700" },
	rehab: { bg: "blue.50", color: "blue.700" },
	volunteer: { bg: "teal.50", color: "teal.700" },
	advocacy: { bg: "orange.50", color: "orange.700" },
};

const LANG_LINKS: Array<{
	code: PortalLocale | "he";
	label: string;
	href: string;
}> = [
	{ code: "he", label: "עברית", href: "/" },
	{ code: "en", label: "English", href: "/en" },
	{ code: "ar", label: "العربية", href: "/ar" },
	{ code: "ru", label: "Русский", href: "/ru" },
];

function getDisplayDomain(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return "";
	}
}

export function IntlPortal({
	config,
	items,
}: {
	config: IntlPortalConfig;
	items: EnrichedIntlInitiative[];
}) {
	const isRtl = config.dir === "rtl";
	const [selectedCategory, setSelectedCategoryState] = useState<string>("all");
	const [query, setQueryState] = useState("");
	const [trustFilters, setTrustFiltersState] =
		useState<TrustFilterState>(INITIAL_TRUST_FILTER);
	const [activeItem, setActiveItem] = useState<EnrichedIntlInitiative | null>(
		null,
	);
	const [isDrawerOpen, setIsDrawerOpenState] = useState(false);
	const toast = useToast();

	useEffect(() => {
		const validCats = new Set<string>(config.categories.map((c) => c.id));
		const syncFromUrl = () => {
			const params = getUrlParams();
			const urlCat = params.get("cat") || "all";
			setSelectedCategoryState(validCats.has(urlCat) ? urlCat : "all");
			setQueryState(params.get("q") || "");
			setTrustFiltersState(parseTrustFiltersFromParams(params));

			const urlCard = params.get("card");
			if (urlCard) {
				const matched = items.find(
					(i) =>
						i.id.toLowerCase() === urlCard.toLowerCase() ||
						i.link.name.toLowerCase() === urlCard.toLowerCase(),
				);
				if (matched) {
					setActiveItem(matched);
					setIsDrawerOpenState(true);
				}
			} else {
				setIsDrawerOpenState(false);
			}
		};

		syncFromUrl();
		window.addEventListener("popstate", syncFromUrl);
		return () => window.removeEventListener("popstate", syncFromUrl);
	}, [items, config.categories]);

	const setSelectedCategory = useCallback((cat: string) => {
		setSelectedCategoryState(cat);
		updateUrlParams({ cat: cat === "all" ? null : cat });
	}, []);

	const setQuery = useCallback((nextQuery: string) => {
		setQueryState(nextQuery);
		updateUrlParams({ q: nextQuery.trim() ? nextQuery : null });
	}, []);

	const setTrustFilters = useCallback((next: TrustFilterState) => {
		setTrustFiltersState(next);
		updateUrlParams(trustFiltersToUrlPatch(next, { includeIntent: false }));
	}, []);

	const setIsDrawerOpen = useCallback((open: boolean) => {
		setIsDrawerOpenState(open);
		if (!open) {
			updateUrlParams({ card: null });
		}
	}, []);

	const openSideCard = useCallback((item: EnrichedIntlInitiative) => {
		setActiveItem(item);
		setIsDrawerOpenState(true);
		updateUrlParams({ card: item.id });
	}, []);

	const handleCopyViewUrl = async () => {
		if (typeof window === "undefined") return;
		try {
			await navigator.clipboard.writeText(window.location.href);
			toast({
				title: config.viewCopiedTitle,
				description: config.viewCopiedDesc,
				status: "success",
				duration: 2200,
				isClosable: true,
			});
		} catch {
			// Ignore
		}
	};

	const categoryMatchedItems = useMemo(() => {
		const q = query.trim().toLowerCase();
		return items.filter((item) => {
			if (selectedCategory !== "all" && item.category !== selectedCategory) {
				return false;
			}
			if (!q) return true;
			return (
				item.name.toLowerCase().includes(q) ||
				item.summary.toLowerCase().includes(q) ||
				item.categoryLabel.toLowerCase().includes(q) ||
				item.url.toLowerCase().includes(q) ||
				item.tags.some((t) => t.toLowerCase().includes(q))
			);
		});
	}, [items, selectedCategory, query]);

	const filtered = useMemo(() => {
		if (!hasActiveTrustFilters(trustFilters)) return categoryMatchedItems;
		const allowedLinks = new Set(
			filterInitiativesByTrust(
				categoryMatchedItems.map((i) => i.link),
				trustFilters,
			),
		);
		return categoryMatchedItems.filter((item) => allowedLinks.has(item.link));
	}, [categoryMatchedItems, trustFilters]);

	const handleCopy = async (e: React.MouseEvent, cardId: string) => {
		e.stopPropagation();
		try {
			await navigator.clipboard.writeText(buildUrlWithCard(cardId));
			toast({
				title: config.cardCopiedTitle,
				status: "success",
				duration: 1800,
				isClosable: true,
			});
		} catch {
			// Ignore
		}
	};

	return (
		<Box
			dir={config.dir}
			textAlign={isRtl ? "right" : "left"}
			py={{ base: 6, md: 10 }}
		>
			{/* Shared Floating Side Card Drawer */}
			<DialogModal
				title={activeItem?.name || ""}
				body={
					activeItem ? (
						<ShowMoreModal
							link={activeItem.link}
							setOpenDialog={setIsDrawerOpen}
							sharePath={activeItem.sharePath}
							locale={isRtl ? "he" : "en"}
						/>
					) : null
				}
				open={Boolean(isDrawerOpen && activeItem)}
				toggleModal={setIsDrawerOpen}
				isRtl={isRtl}
			/>

			<Container maxW="1280px" px={{ base: 4, md: 6 }}>
				{/* Hero */}
				<Box
					bg="white"
					borderRadius="2xl"
					borderWidth="1px"
					borderColor="gray.200"
					boxShadow="sm"
					p={{ base: 6, md: 10 }}
					mb={6}
					position="relative"
					overflow="hidden"
				>
					<Box
						position="absolute"
						right={isRtl ? undefined : "24px"}
						left={isRtl ? "24px" : undefined}
						top="50%"
						transform="translateY(-50%)"
						opacity={0.06}
						pointerEvents="none"
						display={{ base: "none", md: "block" }}
					>
						<Logo width={240} height={270} />
					</Box>

					<VStack
						spacing={4}
						align={{ base: "center", md: "flex-start" }}
						textAlign={{ base: "center", md: isRtl ? "right" : "left" }}
						maxW="760px"
						position="relative"
						zIndex={1}
					>
						<HStack spacing={2} wrap="wrap" justify="center">
							<Badge
								colorScheme="blue"
								variant="subtle"
								px={3}
								py={1}
								borderRadius="full"
								fontSize="xs"
							>
								{config.badgeOpenSource}
							</Badge>
							<Badge
								colorScheme="green"
								variant="subtle"
								px={3}
								py={1}
								borderRadius="full"
								fontSize="xs"
							>
								{config.badgeCountTemplate.replace(
									"{count}",
									String(items.length),
								)}
							</Badge>
						</HStack>

						<Heading
							as="h1"
							fontSize={{ base: "2xl", md: "4xl" }}
							fontWeight="bold"
							color="brand.700"
							lineHeight="1.2"
						>
							{config.heading}
						</Heading>

						<Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
							{config.subtitle}
						</Text>

						<Flex
							wrap="wrap"
							gap={3}
							pt={1}
							justify={{ base: "center", md: "flex-start" }}
							w="100%"
						>
							<InputGroup maxW="420px" size="md">
								<InputLeftElement pointerEvents="none" color="gray.400">
									<Icon as={FaSearch} boxSize={3.5} />
								</InputLeftElement>
								<Input
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									placeholder={config.searchPlaceholder}
									bg="gray.50"
									borderRadius="full"
									aria-label={config.searchPlaceholder}
								/>
							</InputGroup>

							<Button
								as={NextLink}
								href="/"
								variant="outline"
								colorScheme="blue"
								borderRadius="full"
								leftIcon={<Icon as={FaGlobe} />}
							>
								{config.hebrewButtonLabel}
							</Button>
						</Flex>

						{/* Multilingual Portal Switcher */}
						<HStack spacing={1.5} wrap="wrap" pt={1}>
							{LANG_LINKS.map((l) => {
								const active = l.code === config.locale;
								return (
									<Button
										key={l.code}
										as={NextLink}
										href={l.href}
										size="xs"
										borderRadius="full"
										variant={active ? "solid" : "ghost"}
										colorScheme="blue"
										bg={active ? "brand.600" : "gray.100"}
										color={active ? "white" : "gray.700"}
										_hover={{
											bg: active ? "brand.700" : "gray.200",
											textDecoration: "none",
										}}
									>
										{l.label}
									</Button>
								);
							})}
						</HStack>
					</VStack>
				</Box>

				{/* Localized 24/7 Hotlines Strip */}
				<Box
					bg="white"
					borderRadius="xl"
					borderWidth="1px"
					borderColor="gray.200"
					boxShadow="xs"
					p={{ base: 3.5, md: 4 }}
					mb={5}
				>
					<Flex
						direction={{ base: "column", lg: "row" }}
						align={{ base: "flex-start", lg: "center" }}
						justify="space-between"
						gap={3}
					>
						<Flex align="center" gap={2} flexShrink={0}>
							<Flex
								align="center"
								justify="center"
								boxSize="28px"
								borderRadius="full"
								bg="red.50"
								color="red.600"
							>
								<Icon as={FaPhoneAlt} boxSize={3} />
							</Flex>
							<Text fontSize="sm" fontWeight="bold" color="gray.800">
								{config.hotlinesHeading}
							</Text>
						</Flex>

						<Flex
							wrap="wrap"
							gap={2}
							flex="1"
							justify={{ base: "flex-start", lg: "flex-end" }}
						>
							{config.hotlines.map((hotline) => (
								<Link
									key={hotline.number}
									href={hotline.href}
									_hover={{ textDecoration: "none" }}
								>
									<Flex
										align="center"
										gap={2}
										px={3}
										py={1.5}
										borderRadius="full"
										bg="gray.50"
										borderWidth="1px"
										borderColor="gray.200"
										transition="all 0.15s ease"
										_hover={{
											bg: "brand.50",
											borderColor: "brand.300",
											transform: "translateY(-1px)",
										}}
									>
										<Text fontSize="xs" fontWeight="bold" color="gray.800">
											{hotline.name}
										</Text>
										<Text
											fontSize="xs"
											color="gray.500"
											display={{ base: "none", sm: "inline" }}
										>
											{hotline.subtitle}
										</Text>
										<Text
											fontSize="xs"
											fontWeight="bold"
											color="brand.600"
											dir="ltr"
										>
											{hotline.number}
										</Text>
									</Flex>
								</Link>
							))}
						</Flex>
					</Flex>
				</Box>

				{/* Category Filter Pills + Share Current View */}
				<Flex align="center" justify="space-between" wrap="wrap" gap={2} mb={3}>
					<Flex wrap="wrap" gap={2}>
						{config.categories.map((cat) => {
							const active = selectedCategory === cat.id;
							return (
								<Button
									key={cat.id}
									size="sm"
									borderRadius="full"
									colorScheme="blue"
									variant={active ? "solid" : "outline"}
									bg={active ? "brand.600" : "white"}
									onClick={() => setSelectedCategory(cat.id)}
								>
									{cat.label}
								</Button>
							);
						})}
					</Flex>
					<Button
						size="xs"
						variant="outline"
						colorScheme="gray"
						bg="white"
						borderRadius="full"
						leftIcon={<Icon as={FaShareAlt} boxSize={2.5} />}
						onClick={handleCopyViewUrl}
					>
						{config.shareViewLabel}
					</Button>
				</Flex>

				{/* Shared Reusable Trust Filter Bar */}
				<TrustFilterBar
					links={categoryMatchedItems.map((i) => i.link)}
					value={trustFilters}
					onChange={setTrustFilters}
					totalFilteredCount={filtered.length}
					locale={config.locale}
					showIntentFilters={false}
				/>

				{/* Cards Grid */}
				{filtered.length === 0 ? (
					<Box
						bg="white"
						borderRadius="xl"
						borderWidth="1px"
						borderColor="gray.200"
						p={10}
						textAlign="center"
					>
						<Text color="gray.600" mb={4}>
							{config.noResultsText}
						</Text>
						<Button
							size="sm"
							colorScheme="blue"
							borderRadius="full"
							onClick={() => {
								setQuery("");
								setSelectedCategory("all");
								setTrustFilters(INITIAL_TRUST_FILTER);
							}}
						>
							{config.resetFiltersLabel}
						</Button>
					</Box>
				) : (
					<SimpleGrid
						columns={{ base: 1, md: 2, xl: 3 }}
						spacing={{ base: 4, md: 5 }}
					>
						{filtered.map((item) => {
							const badgeStyle =
								CATEGORY_COLORS[item.category] || CATEGORY_COLORS.rehab;
							const refSummary = getReferenceSummary(item.link, 2);

							return (
								<Flex
									key={item.id}
									as="article"
									role="group"
									tabIndex={0}
									direction="column"
									position="relative"
									bg="white"
									borderRadius="16px"
									borderWidth="1px"
									borderColor="gray.200"
									p={5}
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
									onClick={() => openSideCard(item)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											openSideCard(item);
										}
									}}
									justify="space-between"
									gap={3}
								>
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

									<Box>
										<Flex
											align="flex-start"
											justify="space-between"
											gap={3}
											mb={3}
										>
											<Flex align="center" gap={3} minW={0} flex="1">
												<OrgAvatar name={item.name} primaryUrl={item.url} />
												<Box minW={0} flex="1">
													<Flex align="center" gap={1.5}>
														<Heading
															as="h2"
															fontSize="md"
															fontWeight="bold"
															color="gray.900"
															lineHeight="1.35"
															noOfLines={2}
															_groupHover={{ color: "brand.600" }}
															transition="color 0.15s ease"
														>
															{item.name}
														</Heading>
														{item.link.verified && (
															<Box
																as="span"
																color="green.500"
																display="inline-flex"
																flexShrink={0}
															>
																<Icon as={FaCheckCircle} boxSize={3.5} />
															</Box>
														)}
													</Flex>
													<Text
														fontSize="xs"
														color="gray.400"
														noOfLines={1}
														dir="ltr"
														textAlign={isRtl ? "right" : "left"}
													>
														{getDisplayDomain(item.url)}
													</Text>
												</Box>
											</Flex>

											<HStack spacing={0.5} flexShrink={0}>
												<IconButton
													aria-label={`Copy link for ${item.name}`}
													icon={<FaLink size={12} />}
													size="xs"
													variant="ghost"
													color="gray.400"
													borderRadius="lg"
													opacity={{ base: 1, md: 0 }}
													_groupHover={{ opacity: 1 }}
													_hover={{ bg: "gray.100", color: "brand.600" }}
													onClick={(e) => handleCopy(e, item.id)}
												/>
												<IconButton
													as={Link}
													href={item.url}
													isExternal
													aria-label={`Open ${item.name} directly`}
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
													onClick={(e) => e.stopPropagation()}
												/>
											</HStack>
										</Flex>

										{/* Badges */}
										<Flex wrap="wrap" gap={1.5} mb={2.5} align="center">
											<Badge
												bg={badgeStyle.bg}
												color={badgeStyle.color}
												borderRadius="full"
												px={2.5}
												py={0.5}
												fontSize="2xs"
												fontWeight="semibold"
												textTransform="none"
											>
												{item.categoryLabel}
											</Badge>
											{item.link.properManagement && (
												<Badge
													bg="teal.50"
													color="teal.700"
													borderRadius="full"
													px={2}
													py={0.5}
													fontSize="2xs"
													fontWeight="semibold"
													textTransform="none"
												>
													MOJ Verified
												</Badge>
											)}
											{item.link.us501c3 && (
												<Badge
													bg="purple.50"
													color="purple.700"
													borderRadius="full"
													px={2}
													py={0.5}
													fontSize="2xs"
													fontWeight="semibold"
													textTransform="none"
												>
													501(c)(3)
												</Badge>
											)}
											{item.link.taxDeductible46 && (
												<Badge
													backgroundColor="#ecfdf5"
													color="#047857"
													borderRadius="full"
													px={2}
													py={0.5}
													fontSize="2xs"
													fontWeight="semibold"
													textTransform="none"
												>
													§46
												</Badge>
											)}
											{refSummary && (
												<Tooltip
													label={refSummary.tooltip}
													placement="top"
													hasArrow
												>
													<Badge
														bg="gray.100"
														color="gray.700"
														borderRadius="full"
														px={2}
														py={0.5}
														fontSize="2xs"
														fontWeight="medium"
														textTransform="none"
														display="inline-flex"
														alignItems="center"
														gap={1}
														maxW="180px"
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
											{item.link.phone && (
												<Link
													href={`tel:${item.link.phone.replace(/[^\d+*#]/g, "")}`}
													onClick={(e) => e.stopPropagation()}
													_hover={{ textDecoration: "none" }}
												>
													<Badge
														bg="green.50"
														color="green.700"
														borderRadius="full"
														px={2}
														py={0.5}
														fontSize="2xs"
														fontWeight="bold"
														display="inline-flex"
														alignItems="center"
														gap={1}
														_hover={{ bg: "green.100" }}
													>
														<Icon as={FaPhoneAlt} boxSize={2} />
														<span dir="ltr">{item.link.phone}</span>
													</Badge>
												</Link>
											)}
										</Flex>

										<Text
											fontSize="sm"
											color="gray.600"
											lineHeight="1.55"
											noOfLines={3}
										>
											{item.summary}
										</Text>
									</Box>

									<Box
										pt={3}
										mt="auto"
										borderTopWidth="1px"
										borderColor="gray.100"
									>
										<Flex align="center" justify="space-between" gap={2}>
											<Link
												href={item.url}
												isExternal
												onClick={(e) => e.stopPropagation()}
												fontSize="xs"
												fontWeight="semibold"
												color="gray.600"
												display="inline-flex"
												alignItems="center"
												gap={1}
												_hover={{ color: "brand.600", textDecoration: "none" }}
											>
												<span>{config.visitWebsiteLabel}</span>
												<ExternalLinkIcon boxSize={3} opacity={0.75} />
											</Link>

											<Flex
												align="center"
												gap={1.5}
												fontSize="xs"
												fontWeight="semibold"
												color="brand.600"
											>
												<span>{config.detailsSourcesLabel}</span>
												<Icon
													as={isRtl ? FaArrowLeft : FaArrowRight}
													boxSize={2.5}
													transition="transform 0.2s ease"
													_groupHover={{
														transform: isRtl
															? "translateX(-3px)"
															: "translateX(3px)",
													}}
												/>
											</Flex>
										</Flex>
									</Box>
								</Flex>
							);
						})}
					</SimpleGrid>
				)}

				{/* Contribute CTA */}
				<Box
					mt={10}
					bg="brand.50"
					borderRadius="2xl"
					borderWidth="1px"
					borderColor="brand.200"
					p={{ base: 6, md: 8 }}
					textAlign="center"
				>
					<Heading as="h2" size="md" color="brand.700" mb={2}>
						{config.ctaHeading}
					</Heading>
					<Text fontSize="sm" color="gray.600" mb={4}>
						{config.ctaBody}{" "}
						<Link
							as={NextLink}
							href={
								config.locale === "en"
									? "/docs/methodology?lang=en"
									: "/docs/methodology"
							}
							color="brand.600"
							fontWeight="semibold"
							_hover={{ textDecoration: "underline" }}
						>
							{config.ctaMethodologyLabel}
						</Link>
					</Text>
					<Button
						as={Link}
						href="https://github.com/4tals/LinksForIsrael/issues/new?template=new_initiative.yml"
						isExternal
						colorScheme="blue"
						bg="brand.600"
						_hover={{ bg: "brand.700", textDecoration: "none" }}
						borderRadius="full"
						px={6}
					>
						{config.ctaButtonLabel}
					</Button>
				</Box>
			</Container>
		</Box>
	);
}
