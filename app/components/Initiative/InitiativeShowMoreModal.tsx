import React from "react";

import {
	Box,
	Text,
	Link as ChakraLink,
	Button,
	VStack,
	HStack,
	useColorModeValue,
} from "@chakra-ui/react";

import { InitiativeLink as LinkType } from "../../utils/categories";
import { InitiativeIcons } from "./InitiativeIcons";

interface ShowMoreModalProps {
	link: LinkType;
	setOpenDialog: (open: boolean) => void;
}

export const ShowMoreModal: React.FC<ShowMoreModalProps> = ({
	link,
	setOpenDialog,
}) => {
	const bgColor = useColorModeValue("gray.50", "gray.800");
	const textColor = useColorModeValue("gray.700", "gray.200");
	const buttonBgColor = useColorModeValue("blue.500", "blue.300");
	const buttonHoverColor = useColorModeValue("blue.600", "blue.400");

	return (
		<Box bg={bgColor} borderRadius="md" p={6} boxShadow="md">
			<VStack spacing={4} align="stretch">
				<Text color={textColor} fontSize="lg">
					{link.description}
				</Text>
				<Box>
					<InitiativeIcons link={link} />
				</Box>
				<HStack justify="space-between">
					<ChakraLink
						href={link.url}
						isExternal
						color={buttonBgColor}
						fontWeight="bold"
					>
						פתח יוזמה
					</ChakraLink>
					<Button
						colorScheme="blue"
						variant="solid"
						onClick={() => setOpenDialog(false)}
						_hover={{ bg: buttonHoverColor }}
					>
						Close
					</Button>
				</HStack>
			</VStack>
		</Box>
	);
};
