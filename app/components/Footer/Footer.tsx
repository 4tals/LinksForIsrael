import React from "react";

import { socialLinks } from "@/app/utils/consts";
import {
	Box,
	Link,
	Image,
	Text,
	IconButton,
	HStack,
	VStack,
} from "@chakra-ui/react";

import { HelpUsButton } from "./HelpUsButton";

export function Footer() {
	return (
		<Box
			as="footer"
			display="flex"
			flexDirection="row"
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
			<VStack
				spacing={2}
				align="center"
				justify="center"
				mb={{ base: 4, md: 0 }} // Adding bottom margin for mobile
			>
				<Text textAlign="center" fontSize="14px" color="gray.600">
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
			</VStack>
			<Box display={{ base: "none", md: "block" }}>
				<HelpUsButton />
			</Box>
			<HStack
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
			</HStack>
		</Box>
	);
}
