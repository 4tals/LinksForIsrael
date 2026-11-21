"use client";

import NextLink from "next/link";
import React, { useMemo, useState } from "react";
import { FaFlag, FaGlobe, FaSearch } from "react-icons/fa";

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
	Input,
	InputGroup,
	InputLeftElement,
	Link,
	SimpleGrid,
	Text,
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

export function EnglishPortal() {
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [query, setQuery] = useState("");

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
						columns={{ base: 1, sm: 2, lg: 3 }}
						spacing={{ base: 4, md: 5 }}
					>
						{filtered.map((item) => {
							const reportUrl = `https://github.com/4tals/LinksForIsrael/issues/new?template=broken_link.yml&title=${encodeURIComponent(
								`[BROKEN-LINK]: ${item.name}`,
							)}&initiative=${encodeURIComponent(
								item.name,
							)}&url=${encodeURIComponent(item.url)}`;

							return (
								<Flex
									key={item.id}
									direction="column"
									bg="white"
									borderRadius="xl"
									borderWidth="1px"
									borderColor="gray.200"
									p={5}
									boxShadow="xs"
									transition="all 0.2s ease"
									_hover={{
										borderColor: "brand.400",
										boxShadow: "md",
										transform: "translateY(-2px)",
									}}
									justify="space-between"
									gap={4}
								>
									<Box>
										<Badge
											colorScheme="blue"
											variant="subtle"
											borderRadius="full"
											px={2.5}
											py={0.5}
											fontSize="2xs"
											mb={2.5}
										>
											{item.categoryLabel}
										</Badge>
										<Heading as="h2" size="md" color="gray.800" mb={2}>
											{item.name}
										</Heading>
										<Text fontSize="sm" color="gray.600" lineHeight="1.6">
											{item.summary}
										</Text>
									</Box>

									<Box pt={3} borderTopWidth="1px" borderColor="gray.100">
										<Flex align="center" justify="space-between" gap={2}>
											<Button
												as={Link}
												href={item.url}
												isExternal
												size="sm"
												colorScheme="blue"
												bg="brand.600"
												_hover={{ bg: "brand.700", textDecoration: "none" }}
												borderRadius="lg"
												rightIcon={<ExternalLinkIcon />}
											>
												Visit Website
											</Button>
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
