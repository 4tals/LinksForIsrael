import React, { useState } from "react";
import { FaHandPointer } from "react-icons/fa";

import {
	Box,
	Flex,
	Icon,
	Image,
	Text,
	Tooltip,
	useColorModeValue,
} from "@chakra-ui/react";

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

	// All color mode values must be called at the top level
	const bgColor = useColorModeValue("white", "gray.700");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const hoverBorderColor = useColorModeValue("blue.300", "blue.500");
	const gradientOverlay = useColorModeValue(
		"linear(to-b, transparent 0%, white 100%)",
		"linear(to-b, transparent 0%, gray.700 100%)",
	);
	const titleColor = useColorModeValue("gray.800", "gray.100");
	const descriptionColor = useColorModeValue("gray.600", "gray.400");

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
			bg={bgColor}
			borderRadius="xl"
			overflow="hidden"
			minWidth={{ base: "150px", md: "250px" }}
			width={{ base: "70%", md: "250px" }}
			transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
			cursor={link.description?.length > 0 ? "pointer" : "default"}
			boxShadow="md"
			border="1px solid"
			borderColor={borderColor}
			_hover={{
				transform: "translateY(-4px)",
				boxShadow: "2xl",
				borderColor: hoverBorderColor,
			}}
			onClick={handleLinkClick}
			style={{ direction: isRtl ? "rtl" : "ltr" }}
			aspectRatio={1 / 1}
			paddingBlockEnd={{ base: "30px" }}
			position="relative"
		>
			<Tooltip label="לחץ לפרטים נוספים" hasArrow placement="top">
				<Box position="relative" overflow="hidden">
					<Image
						src={imageUrl}
						alt={link.displayName}
						objectFit="cover"
						w="full"
						h={{ base: "60px", md: "110px" }}
						onError={() => setImageError(true)}
						transition="transform 0.3s ease"
						_hover={{ transform: "scale(1.05)" }}
					/>
					<Box
						position="absolute"
						top="0"
						left="0"
						right="0"
						bottom="0"
						bgGradient={gradientOverlay}
						opacity="0.9"
					/>
				</Box>
			</Tooltip>
			<Flex
				direction="column"
				p={{ base: "12px 16px", md: "16px 20px" }}
				gap={2}
			>
				<Text
					fontSize={{ base: "sm", md: "lg" }}
					fontWeight="semibold"
					noOfLines={{ base: 3, md: 1 }}
					color={titleColor}
					letterSpacing="tight"
				>
					{link.displayName}
				</Text>
				{link.shortDescription && (
					<Text
						fontSize={{ base: "xs", md: "sm" }}
						fontWeight="normal"
						noOfLines={{ base: 3, md: 2 }}
						color={descriptionColor}
						lineHeight="1.5"
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
