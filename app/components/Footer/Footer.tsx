import React from "react";

import { socialLinks } from "@/app/utils/consts";
import { Flex, Box, Link, Image, Text } from "@chakra-ui/react";

import { HelpUsButton } from "./HelpUsButton";

export function Footer() {
	return (
		<Box
			as="footer"
			display="flex"
			fontFamily="'Roboto', sans-serif"
			justifyContent="space-between"
			alignItems="center"
			padding="10px"
			borderTop="1px solid"
			borderColor="gray.200"
			backgroundColor="white"
			height={["7svh", "7vh"]} // Responsive height
			zIndex="999"
			position="sticky"
			bottom="0"
		>
			<Flex
				align="center"
				justify="center"
				fontSize="14px"
				color="gray.600"
				sx={{
					"@media only screen and (max-width: 768px)": {
						// Add any mobile-specific styles here
					},
				}}
			>
				<Text textAlign="center" mr="2">
					הופכים עליהם, טובים אותם
				</Text>
				<Link
					href="https://twitter.com/kann/status/1712897481837539810?t=kxXrXgX59tp1yPnrYiS4Iw&s=19"
					isExternal
				>
					<Image
						src="/images/reverse.png"
						alt="Initiative Icon"
						boxSize="40px"
					/>
				</Link>
			</Flex>
			<HelpUsButton />
			<Flex
				align="center"
				gap={["7px", "15px"]} // Responsive gap
				sx={{}}
			>
				{socialLinks.map((link) => (
					<Link key={link.href} href={link.href} isExternal mx="1">
						<Image
							src={link.imgSrc}
							alt={link.alt}
							boxSize="25px"
							_hover={{ opacity: 0.7 }}
						/>
					</Link>
				))}
			</Flex>
		</Box>
	);
}
