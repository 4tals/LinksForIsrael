import React from "react";

import { Box, Flex, Text } from "@chakra-ui/react";

import { Link as LinkType } from "../utils/categories";
import { LinkItem } from "./LinkItem";

export function LinksList({
	name,
	links,
	setDescription,
	setOpenDialog,
}: {
	name: string;
	links: Array<LinkType>;
	setDescription: (
		description: { body: React.ReactNode; link: LinkType } | null,
	) => void;
	setOpenDialog: (open: boolean) => void;
}) {
	const numLinks = links.length;
	if (numLinks === 0) {
		return <Text key={name}>בקרוב</Text>;
	}

	return (
		<Flex
			direction="row"
			gap="16px"
			p="10px"
			boxShadow="md"
			borderRadius="lg"
			// overflowY="auto"
		>
			{links.map((link) => (
				<LinkItem
					link={link}
					key={link.name}
					setDescription={setDescription}
					setOpenDialog={setOpenDialog}
				/>
			))}
		</Flex>
	);
}
