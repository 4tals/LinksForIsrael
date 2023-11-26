import React from "react";

import { Text, Link as ChakraLink } from "@chakra-ui/react";

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
	const showModalContent = () => {
		return (
			<>
				<Text>{link.description}</Text>
				<br />
				<InitiativeIcons link={link} />
				<ChakraLink href={link.url} isExternal>
					פתח יוזמה
				</ChakraLink>
			</>
		);
	};

	return showModalContent();
};
