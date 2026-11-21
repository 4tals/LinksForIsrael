"use client";

import NextLink from "next/link";
import React, { useMemo, useState } from "react";
import {
	FaArrowRight,
	FaFlag,
	FaGlobe,
	FaLink,
	FaSearch,
} from "react-icons/fa";

import { OrgAvatar } from "@/app/components/Initiative/OrgAvatar";
import { Logo } from "@/app/components/Logo";
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

import { ENGLISH_INITIATIVES } from "./englishInitiatives";

const CATEGORIES = [
	{ id: "all", label: "All Resources" },
	{ id: "donate", label: "Humanitarian & Donations" },
	{ id: "rehab", label: "Veterans & Mental Health" },
	{ id: "volunteer", label: "Volunteering & Community" },
	{ id: "advocacy", label: "Advocacy & Remembrance" },
] as const;

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
	donate: { bg: "purple.50", color: "purple.700" },
	rehab: { bg: "blue.50", color: "blue.700" },
	volunteer: { bg: "teal.50", color: "teal.700" },
	advocacy: { bg: "orange.50", color: "orange.700" },
};

function getDisplayDomain(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return "";
	}
}

export function EnglishPortal() {
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [query, setQuery] = useState("");
	const toast = useToast();

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return ENGLISH_INITIATIVES.filter((item) => {
			if (selectedCategory !== "all" && item.category !== selectedCategory) {
				return false;
			}
			if (!q) return true;
			return (
				item.name.toLowerCase().includes(q) ||
				item.summary.toLowerCase().includes(q) ||
				item.categoryLabel.toLowerCase().includes(q) ||
				item.tags.some((t) => t.toLowerCase().includes(q))
			);
		});
	}, [selectedCategory, query]);

	const handleCopy = async (url: string) => {
		try {
			await navigator.clipboard.writeText(url);
			toast({
				title: "Link copied",
				status: "success",
				duration: 1800,
				isClosable: true,
			});
		} catch {
			// Ignore
		}
	};

	return (
		<Box dir="ltr" textAlign="left" py={{ base: 6, md: 10 }}>
			<Container maxW="1280px" px={{ base: 4, md: 6 }}>
				{/* Hero */}
				<Box
					bg="white"
					borderRadius="2xl"
					borderWidth="1px"
					borderColor="gray.200"
					boxShadow="sm"
					p={{ base: 6, md: 10 }}
					mb={8}
					position="relative"
					overflow="hidden"
				>
					<Box
						position="absolute"
						right="24px"
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
						textAlign={{ base: "center", md: "left" }}
						maxW="720px"
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
								Open Source · Verified Links
							</Badge>
							<Badge
								colorScheme="green"
								variant="subtle"
								px={3}
								py={1}
								borderRadius="full"
								fontSize="xs"
							>
								{ENGLISH_INITIATIVES.length} Flagship Organizations
							</Badge>
						</HStack>

						<Heading
							as="h1"
							fontSize={{ base: "2xl", md: "4xl" }}
							fontWeight="bold"
							color="brand.700"
							lineHeight="1.2"
						>
							Links For Israel — Support, Volunteer &amp; Donate
						</Heading>

						<Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
							A curated, open-source directory of verified Israeli charities,
							mental health and veteran rehabilitation centers, volunteering
							networks, and remembrance archives.
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
									placeholder="Search charities, volunteering, mental health..."
									bg="gray.50"
									borderRadius="full"
									aria-label="Search Israeli organizations"
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
								לפורטל המלא בעברית (100+ יוזמות)
							</Button>
						</Flex>
					</VStack>
				</Box>

				{/* Category Filter Pills */}
				<Flex wrap="wrap" gap={2} mb={6}>
					{CATEGORIES.map((cat) => {
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
							No organizations matched &ldquo;{query}&rdquo;.
						</Text>
						<Button
							size="sm"
							colorScheme="blue"
							borderRadius="full"
							onClick={() => {
								setQuery("");
								setSelectedCategory("all");
							}}
						>
							Reset filters
						</Button>
					</Box>
				) : (
					<SimpleGrid
						columns={{ base: 1, md: 2, xl: 3 }}
						spacing={{ base: 4, md: 5 }}
					>
						{filtered.map((item) => {
							const reportUrl = `https://github.com/4tals/LinksForIsrael/issues/new?template=broken_link.yml&title=${encodeURIComponent(
								`[BROKEN-LINK]: ${item.name}`,
							)}&initiative=${encodeURIComponent(
								item.name,
							)}&url=${encodeURIComponent(item.url)}`;
							const badgeStyle =
								CATEGORY_COLORS[item.category] || CATEGORY_COLORS.rehab;

							return (
								<Flex
									key={item.id}
									as="article"
									role="group"
									direction="column"
									position="relative"
									bg="white"
									borderRadius="16px"
									borderWidth="1px"
									borderColor="gray.200"
									p={5}
									overflow="hidden"
									boxShadow="0 1px 2px rgba(15, 23, 42, 0.04)"
									transition="transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s ease, border-color 0.22s ease"
									_hover={{
										borderColor: "brand.300",
										transform: "translateY(-3px)",
										boxShadow:
											"0 14px 28px -10px rgba(0, 56, 184, 0.14), 0 4px 10px -4px rgba(15, 23, 42, 0.06)",
									}}
									justify="space-between"
									gap={3}
								>
									{/* Top gradient accent on hover */}
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
													<Text fontSize="xs" color="gray.400" noOfLines={1}>
														{getDisplayDomain(item.url)}
													</Text>
												</Box>
											</Flex>

											<Tooltip label="Copy link" placement="top" hasArrow>
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
													onClick={() => handleCopy(item.url)}
												/>
											</Tooltip>
										</Flex>

										<Badge
											bg={badgeStyle.bg}
											color={badgeStyle.color}
											borderRadius="full"
											px={2.5}
											py={0.5}
											fontSize="2xs"
											fontWeight="semibold"
											textTransform="none"
											mb={2.5}
										>
											{item.categoryLabel}
										</Badge>

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
												fontSize="sm"
												fontWeight="semibold"
												color="brand.600"
												display="inline-flex"
												alignItems="center"
												gap={1.5}
												_hover={{ color: "brand.700", textDecoration: "none" }}
											>
												<span>Visit Website</span>
												<Icon
													as={FaArrowRight}
													boxSize={2.5}
													transition="transform 0.2s ease"
													_groupHover={{ transform: "translateX(3px)" }}
												/>
												<ExternalLinkIcon boxSize={3} opacity={0.7} />
											</Link>

											<Link
												href={reportUrl}
												isExternal
												fontSize="xs"
												color="gray.400"
												display="inline-flex"
												alignItems="center"
												gap={1}
												_hover={{ color: "red.500" }}
											>
												<FaFlag size={10} />
												Report
											</Link>
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
						Know a verified Israeli organization we should add?
					</Heading>
					<Text fontSize="sm" color="gray.600" mb={4}>
						Links For Israel is 100% open source and community-maintained on
						GitHub.
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
						Suggest an Organization on GitHub
					</Button>
				</Box>
			</Container>
		</Box>
	);
}
