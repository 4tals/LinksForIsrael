"use client";

import NextLink from "next/link";
import React, { useContext } from "react";
import { FaExclamationTriangle, FaPhoneAlt, FaPrint } from "react-icons/fa";

import { AppToolsContext } from "@/app/components/RootApp";
import { Box, Button, Flex, HStack, Icon, Link, Text } from "@chakra-ui/react";

const ESSENTIAL_HOTLINES = [
	{
		name: "ער״ן",
		subtitle: "סיוע נפשי 24/7",
		number: "1201",
		href: "tel:1201",
	},
	{
		name: "נט״ל",
		subtitle: "טראומה וחרדה",
		number: "1-800-363-363",
		href: "tel:1800363363",
	},
	{
		name: "ידידים",
		subtitle: "סיוע בדרכים",
		number: "1230",
		href: "tel:1230",
	},
	{
		name: "פיקוד העורף",
		subtitle: "מידע וחירום",
		number: "104",
		href: "tel:104",
	},
	{
		name: "איחוד הצלה",
		subtitle: "חירום רפואי",
		number: "1221",
		href: "tel:1221",
	},
	{
		name: "סיוע לתקיפה מינית",
		subtitle: "נשים 24/7",
		number: "1202",
		href: "tel:1202",
	},
	{
		name: "מד״א",
		subtitle: "אמבולנס",
		number: "101",
		href: "tel:101",
	},
	{
		name: "משטרה",
		subtitle: "מוקד חירום",
		number: "100",
		href: "tel:100",
	},
] as const;

export function HotlinesBar() {
	const { openEmergencyMode } = useContext(AppToolsContext);

	return (
		<Box
			bg="white"
			borderRadius="xl"
			borderWidth="1px"
			borderColor="gray.200"
			boxShadow="xs"
			p={{ base: 3.5, md: 4 }}
			mb={6}
		>
			<Flex
				direction={{ base: "column", lg: "row" }}
				align={{ base: "flex-start", lg: "center" }}
				justify="space-between"
				gap={3}
			>
				<Flex
					align="center"
					justify="space-between"
					gap={2}
					flexShrink={0}
					w={{ base: "100%", lg: "auto" }}
				>
					<Flex align="center" gap={2}>
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
							מוקדי חירום וסיוע מיידי:
						</Text>
					</Flex>

					<HStack spacing={1.5}>
						<Button
							size="xs"
							colorScheme="red"
							variant="solid"
							borderRadius="full"
							leftIcon={<Icon as={FaExclamationTriangle} boxSize={2.5} />}
							onClick={openEmergencyMode}
						>
							מצב חירום
						</Button>
						<Button
							as={NextLink}
							href="/print"
							size="xs"
							variant="outline"
							colorScheme="gray"
							borderRadius="full"
							leftIcon={<Icon as={FaPrint} boxSize={2.5} />}
						>
							הדפסה לממ״ד
						</Button>
					</HStack>
				</Flex>

				<Flex
					wrap="wrap"
					gap={2}
					flex="1"
					justify={{ base: "flex-start", lg: "flex-end" }}
				>
					{ESSENTIAL_HOTLINES.map((hotline) => (
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
	);
}
