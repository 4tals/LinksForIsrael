import React from "react";

import { Logo } from "@/app/components/Logo";
import { Box, Flex, Text } from "@chakra-ui/react";

export const NoCategoryZeroState = () => {
	return (
		<Box
			position="relative"
			height="100%"
			overflow="hidden"
			p={4} // padding for overall alignment
		>
			<Box
				position="absolute"
				top="50%"
				left="50%"
				transform="translate(-50%, -50%)"
				opacity={0.2}
				transition="opacity 0.3s ease"
				_hover={{ opacity: 0.3 }} // subtle hover effect on the logo
			>
				<Logo />
			</Box>
			<Flex
				direction="column"
				fontSize={["lg", "xl", "2xl"]} // responsive font sizes
				color="blue.600" // using Chakra UI color scheme
				position="absolute"
				top="60%" // adjusted for better visual balance
				left="50%"
				transform="translate(-50%, -50%)"
				textAlign="center"
				width={["95%", "80%", "400px"]} // responsive width
				sx={{
					textWrap: "balance",
					gap: 3, // spacing between text elements
				}}
			>
				<Text>ברוכים הבאים לפורטל ״לינק לישראל״</Text>
				<Text>קוד פתוח לריכוז יוזמות בתחומים שונים</Text>
				<Text
					fontSize={["2xl", "3xl", "4xl"]} // larger font size for emphasis
					fontWeight="bold"
				>
					ביחד ננצח!
				</Text>
			</Flex>
		</Box>
	);
};
