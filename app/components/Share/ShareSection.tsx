"use client";

import NextLink from "next/link";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

import { ShareButtons } from "@/app/components/Share/ShareButtons";
import { Box, Button, Flex, Heading, Icon, Text } from "@chakra-ui/react";

interface ShareSectionProps {
	categoryName: string;
	categoryDescription?: string;
	headingAs?: "h1" | "h2";
	categoryHref?: string;
	onCategoryJump?: () => void;
}

export const ShareSection: React.FC<ShareSectionProps> = ({
	categoryName,
	categoryDescription,
	headingAs = "h1",
	categoryHref,
	onCategoryJump,
}) => {
	return (
		<Box
			p={{ base: 4, md: 5 }}
			bg="white"
			borderRadius="xl"
			borderWidth="1px"
			borderColor="gray.200"
			boxShadow="xs"
		>
			<Flex
				direction={{ base: "column", md: "row" }}
				align={{ base: "flex-start", md: "center" }}
				justify="space-between"
				gap={3}
			>
				<Box>
					<Flex align="center" gap={3} wrap="wrap">
						<Heading
							as={headingAs}
							size={{ base: "md", md: "lg" }}
							color="brand.700"
						>
							{categoryName}
						</Heading>
						{categoryHref && (
							<Button
								as={NextLink}
								href={categoryHref}
								onClick={onCategoryJump}
								size="xs"
								variant="subtle"
								bg="brand.50"
								color="brand.700"
								borderRadius="full"
								rightIcon={<Icon as={FaArrowLeft} boxSize={2.5} />}
								_hover={{ bg: "brand.100", textDecoration: "none" }}
							>
								לכל הקטגוריה
							</Button>
						)}
					</Flex>
					{categoryDescription && (
						<Text fontSize={{ base: "sm", md: "md" }} color="gray.600" mt={1}>
							{categoryDescription}
						</Text>
					)}
				</Box>

				<Flex
					align="center"
					gap={2}
					flexShrink={0}
					bg="gray.50"
					px={3}
					py={1.5}
					borderRadius="full"
					borderWidth="1px"
					borderColor="gray.100"
				>
					<Text fontSize="xs" fontWeight="semibold" color="gray.600">
						שיתוף העמוד:
					</Text>
					<ShareButtons category={categoryName} />
				</Flex>
			</Flex>
		</Box>
	);
};
