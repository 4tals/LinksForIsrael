import React from "react";

import { ShareButtons } from "@/app/components/Share/ShareButtons";
import { Box, Flex, Text, Spacer, useMediaQuery } from "@chakra-ui/react";

interface ShareSectionProps {
	categoryName: string;
	categoryDescription: string;
}

export const ShareSection: React.FC<ShareSectionProps> = ({
	categoryName,
	categoryDescription,
}) => {
	const [isLargerThan480] = useMediaQuery("(min-width: 480px)");

	return (
		<Box p={4} bg="gray.100" borderRadius="md">
			<Flex direction="row" align="center" justifyContent={"space-between"}>
				{isLargerThan480 ? (
					<Flex>
						<Text fontSize="md" fontWeight="bold" ml={2}>
							רשימת יוזמות שונות בתחום
						</Text>
						<Text fontSize="sm" color="blue.600" noOfLines={1} marginLeft={10}>
							{categoryDescription}
						</Text>
					</Flex>
				) : null}
				<Flex>
					<Text
						fontSize="sm"
						fontWeight="bold"
						ml={2}
						align={"center"}
						flexShrink={0}
					>
						שתף את העמוד
					</Text>
					<ShareButtons category={categoryName} />
				</Flex>
			</Flex>
		</Box>
	);
};
