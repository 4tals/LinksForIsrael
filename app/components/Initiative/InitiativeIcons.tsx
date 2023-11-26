import React from "react";

import { Flex, Link as ChakraLink, Image, Text } from "@chakra-ui/react";

import { Tooltip } from "../../[[...category]]/Tooltip";
import { InitiativeLink } from "../../utils/categories";
import { ICONS, ICONS_KEYS } from "../../utils/consts";

export const InitiativeIcons = ({
	link,
	limit,
}: {
	link: InitiativeLink | any;
	limit?: number;
}) => {
	let iconDisplay = ICONS_KEYS.filter((key) => link[key]);
	let showIcons =
		limit && limit < iconDisplay.length
			? iconDisplay.slice(0, limit)
			: iconDisplay;
	let overLimit =
		limit && limit < iconDisplay.length ? iconDisplay.length - limit : 0;

	return (
		<Flex className="link-icons" p="10px 0" align="center">
			{showIcons.map((icon) => (
				<ChakraLink href={link[icon]} key={icon} isExternal>
					<Image
						src={ICONS[icon as keyof typeof ICONS].src}
						alt={ICONS[icon as keyof typeof ICONS].alt}
						boxSize="30px"
						m="0 5px"
						_hover={{
							filter: "brightness(120%)",
							transform: "scale(1.1)",
						}}
					/>
				</ChakraLink>
			))}

			{link.phone && (
				<ChakraLink href={`tel:${link.phone}`} isExternal>
					<Image
						src="https://cdn2.iconfinder.com/data/icons/font-awesome/1792/phone-512.png"
						alt="Phone Link"
						boxSize="30px"
						m="0 5px"
						_hover={{
							filter: "brightness(120%)",
							transform: "scale(1.1)",
						}}
					/>
				</ChakraLink>
			)}

			{link.email && (
				<ChakraLink href={`mailto:${link.email}`} isExternal>
					<Image
						src="https://cdn2.iconfinder.com/data/icons/social-media-2259/512/gmail-512.png"
						alt="Email Link"
						boxSize="30px"
						m="0 5px"
						_hover={{
							filter: "brightness(120%)",
							transform: "scale(1.1)",
						}}
					/>
				</ChakraLink>
			)}

			{link.initiativeValidationDetails && (
				<Tooltip content={link.initiativeValidationDetails} />
			)}

			{overLimit > 0 && (
				<Text fontSize="sm" ml="5px">
					{overLimit}+
				</Text>
			)}
		</Flex>
	);
};
