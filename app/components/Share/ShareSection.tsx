import React from "react";

import { ShareButtons } from "@/app/components/Share/ShareButtons";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, Icon, Spacer } from "@chakra-ui/react";

interface ShareSectionProps {
	categoryName: string;
	categoryDescription: string;
}

export const ShareSection: React.FC<ShareSectionProps> = ({
	categoryName,
	categoryDescription,
}) => {
	return (
		<Box p={4} bg="gray.100" borderRadius="md">
			<Flex direction="row" align="center" justifyContent={"space-between"}>
				<Text fontSize="md" fontWeight="bold" ml={2}>
					שתף את העמוד הזה:
				</Text>
				<Spacer />
				<Text fontSize="sm" color="blue.600" noOfLines={1} margin={2}>
					{categoryDescription}
				</Text>
				<ShareButtons category={categoryName} />
			</Flex>
		</Box>
	);
};
