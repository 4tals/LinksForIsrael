"use client";

import React, { useContext } from "react";
import { FaMagic, FaSearch, FaShieldAlt } from "react-icons/fa";

import { Logo } from "@/app/components/Logo";
import { AppToolsContext } from "@/app/components/RootApp";
import {
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Icon,
	Text,
	VStack,
} from "@chakra-ui/react";

export interface PortalHeroProps {
	locale: "he" | "en";
	stats: {
		totalCount: number;
		nihulCount: number;
		citationsCount: number;
	};
	title: string;
	subtitle: string;
	actionButtons?: React.ReactNode;
	searchSlot: React.ReactNode;
	quickTags?: string[];
	onSelectQuickTag?: (tag: string) => void;
}

/**
 * Shared Hero card used by both the Hebrew homepage (/) and English portal (/en)
 * so both language experiences share identical visual hierarchy, trust badges,
 * layout rhythm, and interactive controls.
 */
export function PortalHero({
	locale,
	stats,
	title,
	subtitle,
	actionButtons,
	searchSlot,
	quickTags = [],
	onSelectQuickTag,
}: PortalHeroProps) {
	const { openCommandPalette, openHelperWizard } = useContext(AppToolsContext);
	const isHe = locale === "he";

	return (
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
				left={isHe ? { base: "-40px", md: "20px" } : undefined}
				right={!isHe ? { base: "-40px", md: "20px" } : undefined}
				top="50%"
				transform="translateY(-50%)"
				opacity={0.06}
				pointerEvents="none"
				display={{ base: "none", sm: "block" }}
			>
				<Logo width={260} height={290} />
			</Box>

			<VStack
				spacing={4}
				align="center"
				textAlign="center"
				maxW="720px"
				mx="auto"
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
						{isHe
							? `${stats.totalCount} עמותות ויוזמות`
							: `${stats.totalCount} Verified Organizations`}
					</Badge>
					<Badge
						colorScheme="teal"
						variant="subtle"
						px={3}
						py={1}
						borderRadius="full"
						fontSize="xs"
						display="inline-flex"
						alignItems="center"
						gap={1}
					>
						<Icon as={FaShieldAlt} boxSize={2.5} />
						<span>
							{isHe
								? `${stats.nihulCount} ניהול תקין (data.gov.il)`
								: `${stats.nihulCount} MOJ Good Standing (data.gov.il)`}
						</span>
					</Badge>
					<Badge
						colorScheme="green"
						variant="subtle"
						px={3}
						py={1}
						borderRadius="full"
						fontSize="xs"
					>
						{isHe
							? `${stats.citationsCount} אזכורים עצמאיים · קוד פתוח`
							: `${stats.citationsCount} Press Citations · Open Source`}
					</Badge>
				</HStack>

				<Heading
					as="h1"
					fontSize={{ base: "2xl", md: "4xl" }}
					fontWeight="bold"
					color="brand.700"
					lineHeight="1.2"
				>
					{title}
				</Heading>

				<Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
					{subtitle}
				</Text>

				{/* Primary Action Pills */}
				<Flex wrap="wrap" justify="center" gap={2.5} pt={1}>
					<Button
						size={{ base: "sm", md: "md" }}
						colorScheme="blue"
						bg="brand.600"
						color="white"
						borderRadius="full"
						px={5}
						fontWeight="bold"
						leftIcon={<Icon as={FaMagic} />}
						onClick={openHelperWizard}
						boxShadow="sm"
						_hover={{ bg: "brand.700", transform: "translateY(-1px)" }}
						transition="all 0.15s ease"
					>
						{isHe ? "עזרו לי למצוא ב-10 שניות" : "10-Second Helper"}
					</Button>
					<Button
						size={{ base: "sm", md: "md" }}
						variant="outline"
						colorScheme="blue"
						bg="white"
						borderRadius="full"
						px={4}
						fontWeight="semibold"
						leftIcon={<Icon as={FaSearch} boxSize={3} />}
						onClick={openCommandPalette}
						display={{ base: "none", sm: "inline-flex" }}
						_hover={{ bg: "brand.50", transform: "translateY(-1px)" }}
						transition="all 0.15s ease"
					>
						{isHe ? "חיפוש מהיר (⌘K)" : "Quick Search (⌘K)"}
					</Button>
					{actionButtons}
				</Flex>

				<Box w="100%" maxW="540px" pt={1}>
					{searchSlot}
				</Box>

				{quickTags.length > 0 && onSelectQuickTag && (
					<Flex wrap="wrap" justify="center" gap={2}>
						{quickTags.map((tag) => (
							<Button
								key={tag}
								size="xs"
								variant="outline"
								colorScheme="blue"
								borderRadius="full"
								fontWeight="medium"
								onClick={() => onSelectQuickTag(tag)}
								_hover={{ bg: "blue.50" }}
							>
								{tag}
							</Button>
						))}
					</Flex>
				)}
			</VStack>
		</Box>
	);
}
