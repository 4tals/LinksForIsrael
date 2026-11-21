"use client";

import React from "react";

import { ShareButtons } from "@/app/components/Share/ShareButtons";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

interface ShareSectionProps {
	categoryName: string;
	categoryDescription?: string;
	headingAs?: "h1" | "h2";
}

export const ShareSection: React.FC<ShareSectionProps> = ({
	categoryName,
	categoryDescription,
	headingAs = "h1",
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
					<Heading
						as={headingAs}
						size={{ base: "md", md: "lg" }}
						color="brand.700"
					>
						{categoryName}
					</Heading>
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
