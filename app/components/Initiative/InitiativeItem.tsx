import React, { useState } from "react";

import { Box, Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";

import { InitiativeLink as LinkType } from "../../utils/categories";
import { InitiativeIcons } from "./InitiativeIcons";
import { ShowMoreModal } from "./InitiativeShowMoreModal";

// Define the type for your function parameter
const containsHebrewLetters = (str: string): boolean =>
	/[\u0590-\u05EA]/.test(str);
const defaultImageUrl =
	"https://res.cloudinary.com/dargbitr2/image/upload/v1697311977/LinksForIsrael/jix5eizmqcegmfra89gs.jpg";

// Define types for your component props
interface InitiativeItemProps {
	link: LinkType;
	setDescription: (description: {
		body: React.ReactNode;
		link: LinkType;
	}) => void;
	setOpenDialog: (open: boolean) => void;
}

export const InitiativeItem: React.FC<InitiativeItemProps> = ({
	link,
	setDescription,
	setOpenDialog,
}) => {
	const [imageError, setImageError] = useState(false);
	const isRtl = containsHebrewLetters(
		`${link.displayName}${link?.shortDescription}`,
	);
	const bgColor = useColorModeValue("white", "gray.700");

	// Explicitly type the event parameter
	const handleLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (link.description?.length > 0) {
			e.preventDefault();
			setDescription({
				link,
				body: <ShowMoreModal link={link} setOpenDialog={setOpenDialog} />,
			});
			setOpenDialog(true);
		}
	};

	const imageUrl =
		imageError || !link.initiativeImage
			? defaultImageUrl
			: link.initiativeImage;

	return (
		<Box
			bg={"gray.100"}
			borderRadius="md"
			overflow="hidden"
			minWidth={{ base: "250px", md: "300px" }}
			transition="all 0.3s"
			_hover={{ bg: "gray.200", transform: "scale(1.05)", boxShadow: "xl" }}
			onClick={handleLinkClick}
			style={{ direction: isRtl ? "rtl" : "ltr" }}
		>
			<Image
				src={imageUrl}
				alt={link.displayName}
				objectFit="cover"
				opacity="0.3"
				w={{ base: "full", md: "full" }}
				h={{ base: "50px", md: "100px" }}
				onError={() => setImageError(true)}
			/>
			<Flex direction="column" p="16px 24px">
				<Text fontSize="lg" fontWeight="bold" noOfLines={1}>
					{link.displayName}
				</Text>
				{link.shortDescription && (
					<Text fontSize="md" fontWeight="medium" mt={1} noOfLines={2}>
						{link.shortDescription}
					</Text>
				)}
				<InitiativeIcons link={link} limit={3} />
			</Flex>
		</Box>
	);
};
