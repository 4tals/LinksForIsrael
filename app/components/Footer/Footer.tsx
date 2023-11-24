import React from "react";

import { socialLinks } from "@/app/utils/consts";
import {
	Flex,
	Box,
	Link,
	Image,
	Text,
	IconButton,
	Stack,
} from "@chakra-ui/react";

import { HelpUsButton } from "./HelpUsButton";

export function Footer() {
	return (
		<Box
			as="footer"
			display="flex"
			flexDirection={{ base: "column", md: "row" }}
			fontFamily="Roboto, sans-serif"
			justifyContent="space-between"
			alignItems="center"
			padding="10px"
			borderTopWidth="1px"
			borderColor="gray.200"
			backgroundColor="white"
			zIndex="999"
			position="sticky"
			bottom="0"
		>
			<Flex
				align="center"
				justify="center"
				fontSize="14px"
				color="gray.600"
				mb={{ base: 4, md: 0 }}
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
						boxSize={{ base: "30px", md: "40px" }}
					/>
				</Link>
			</Flex>
			{/* HelpUsButton will only display on non-mobile (medium and above) screens */}
			<Box display={{ base: "none", md: "block" }}>
				<HelpUsButton />
			</Box>
			<Stack
				direction={{ base: "row", md: "row" }}
				align="center"
				justify="center"
				spacing={2}
			>
				{socialLinks.map((link) => (
					<Link key={link.href} href={link.href} isExternal>
						<IconButton
							aria-label={link.alt}
							icon={<Image src={link.imgSrc} alt={link.alt} boxSize="25px" />}
							variant="unstyled"
							_hover={{ opacity: 0.7 }}
						/>
					</Link>
				))}
			</Stack>
		</Box>
	);
}
