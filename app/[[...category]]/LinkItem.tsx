import React from "react";

import { Box, Flex, Link as ChakraLink, Image, Text } from "@chakra-ui/react";

import { InitiativeLink as LinkType } from "../utils/categories";
import { LinkIcons } from "./LinkIcons";

const containsHebrewLetters = (str: string) => /[\u0590-\u05EA]/.test(str);

export function LinkItem({
	link,
	setDescription,
	setOpenDialog,
}: {
	link: LinkType;
	setDescription: (
		description: { body: React.ReactNode; link: LinkType } | null,
	) => void;
	setOpenDialog: (open: boolean) => void;
}) {
	const handleLinkClick = (e: React.MouseEvent) => {
		if (link.description?.length > 0) {
			e.preventDefault(); // Prevent redirect
			showMore(link, setOpenDialog);
		}
	};

	const showMore = (link: LinkType, setOpenDialog: any) => {
		setDescription({
			link,
			body: (
				<>
					<Text>{link.description}</Text>
					<br />
					<LinkIcons link={link} />
					<ChakraLink href={link.url} isExternal>
						פתח יוזמה
					</ChakraLink>
				</>
			),
		});
		setOpenDialog(true); // <-- Open the modal
	};

	return (
		<Box
			className={`links-section-item ${
				!containsHebrewLetters(`${link.displayName}${link?.shortDescription}`)
					? "ltr"
					: ""
			}`}
			key={link.name}
			onClick={handleLinkClick}
		>
			{link.initiativeImage && (
				<Image
					src={link.initiativeImage}
					alt={link.displayName}
					position="absolute"
					top="0"
					left="5%"
					width="90%"
					objectFit="contain"
					opacity="0.2"
				/>
			)}
			<Flex direction="column" p="16px 24px">
				<Text fontSize="17px" fontWeight="900" noOfLines={1}>
					{link.displayName}
				</Text>
				{link.shortDescription && (
					<Text fontSize="14px" fontWeight="600" noOfLines={2}>
						{link.shortDescription}
					</Text>
				)}
				<LinkIcons link={link} limit={3} />
			</Flex>
		</Box>
	);
}
