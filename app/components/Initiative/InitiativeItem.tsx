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
			// Responsive minWidth and width
			minWidth={{ base: "150px", md: "250px" }}
			width={{ base: "70%", md: "250px" }}
			transition="all 0.3s"
			_hover={{ bg: "gray.200", transform: "scale(1.05)", boxShadow: "xl" }}
			onClick={handleLinkClick}
			style={{ direction: isRtl ? "rtl" : "ltr" }}
			aspectRatio={1 / 1}
			paddingBlockEnd={{ base: "30px" }}
			//ellipsis after 3 lines
		>
			<Image
				src={imageUrl}
				alt={link.displayName}
				objectFit="cover"
				opacity="0.3"
				// Responsive width and height
				w={{ base: "full", md: "full" }}
				h={{ base: "40px", md: "100px" }} // Adjusted for mobile
				display={{ base: "none", md: "block" }}
				onError={() => setImageError(true)}
			/>
			<Flex direction="column" p="16px 24px">
				<Text
					fontSize={{ base: "sm", md: "lg" }} // Smaller font size for mobile
					fontWeight="bold"
					noOfLines={{ base: 3, md: 1 }}
				>
					{link.displayName}
				</Text>
				{link.shortDescription && (
					<Text
						fontSize={{ base: "xs", md: "md" }} // Smaller font size for mobile
						fontWeight="medium"
						mt={1}
						noOfLines={{ base: 3, md: 2 }}
						overflow="hidden"
					>
						{link.shortDescription}
					</Text>
				)}
				<Box display={{ base: "none", md: "block" }}>
					<InitiativeIcons link={link} limit={3} />
				</Box>
			</Flex>
		</Box>
	);
};
