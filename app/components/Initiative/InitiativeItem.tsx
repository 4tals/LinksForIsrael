import React from "react";

import { Box, Flex, Image, Text } from "@chakra-ui/react";

import { InitiativeLink as LinkType } from "../../utils/categories";
import { InitiativeIcons } from "./InitiativeIcons";
import { ShowMoreModal } from "./InitiativeShowMoreModal";

const containsHebrewLetters = (str: string) => /[\u0590-\u05EA]/.test(str);

export function InitiativeItem({
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
			setDescription({
				link,
				body: <ShowMoreModal link={link} setOpenDialog={setOpenDialog} />,
			});
			setOpenDialog(true);
		}
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
				<InitiativeIcons link={link} limit={3} />
			</Flex>
		</Box>
	);
}
