import React from "react";

import { ShareButtons } from "@/app/components/Share/ShareButtons";
import { Box, Flex, Text, useMediaQuery } from "@chakra-ui/react";

interface ShareSectionProps {
	categoryName: string;
	categoryDescription: string;
}

export const ShareSection: React.FC<ShareSectionProps> = ({
	categoryName,
	categoryDescription,
}) => {
	const [isLargerThan480] = useMediaQuery("(min-width: 600px)");

	return (
		<Box p={4} bg="gray.100" borderRadius="md">
			<Flex direction="row" align="center" justifyContent="space-between">
				<Flex alignItems="center" display={{ base: "none", md: "flex" }}>
					<Text fontSize="md" fontWeight="bold" ml={2}>
						בעמוד זה תוכל למצוא רשימת יוזמות שונות בתחום
					</Text>
					<Text fontSize="sm" color="blue.600" noOfLines={1} marginLeft={10}>
						{categoryDescription}
					</Text>
				</Flex>

				<Flex alignItems="center">
					<Text fontSize="sm" fontWeight="bold" ml={2}>
						שתף את העמוד
					</Text>
					<ShareButtons category={categoryName} />
				</Flex>
			</Flex>
		</Box>
	);
};
