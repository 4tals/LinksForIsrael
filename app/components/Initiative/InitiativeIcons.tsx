import React from "react";

import {
	Flex,
	Link as ChakraLink,
	Image,
	Text,
	useColorModeValue,
	useStyleConfig,
} from "@chakra-ui/react";

import { InitiativeLink } from "../../utils/categories";
import { ICONS } from "../../utils/consts";

// Define the IconKey type based on the keys of ICONS
type IconKey = keyof typeof ICONS;

interface InitiativeIconsProps {
	link: InitiativeLink;
	limit?: number;
}

export const InitiativeIcons: React.FC<InitiativeIconsProps> = ({
	link,
	limit,
}) => {
	// Ensure that iconDisplay only contains keys that exist in both ICONS and link
	let iconDisplay: IconKey[] = (Object.keys(ICONS) as IconKey[]).filter(
		(key) => link[key],
	);
	let showIcons: IconKey[] =
		limit && limit < iconDisplay.length
			? iconDisplay.slice(0, limit)
			: iconDisplay;
	let overLimit: number =
		limit && limit < iconDisplay.length ? iconDisplay.length - limit : 0;

	return (
		<Flex direction="row" wrap="wrap" align="center" mt={2}>
			{showIcons.map((icon) => (
				<IconLink
					href={link[icon]}
					iconUrl={ICONS[icon].src}
					alt={ICONS[icon].alt}
					key={icon}
				/>
			))}

			{overLimit > 0 && (
				<Text fontSize="sm" ml={2} fontWeight="bold">
					+{overLimit}
				</Text>
			)}
		</Flex>
	);
};

interface IconLinkProps {
	href: string;
	iconUrl: string;
	alt: string;
}

const IconLink: React.FC<IconLinkProps> = ({ href, iconUrl, alt }) => {
	const iconStyle = useStyleConfig("Icon");
	const iconHoverBg = useColorModeValue("gray.100", "gray.700");

	return (
		<ChakraLink href={href} isExternal>
			<Image
				src={iconUrl}
				alt={alt}
				boxSize="30px"
				m={1}
				p={1}
				borderRadius="md"
				sx={iconStyle}
				_hover={{
					bg: iconHoverBg,
					transform: "scale(1.1)",
				}}
			/>
		</ChakraLink>
	);
};
