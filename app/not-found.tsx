import NextLink from "next/link";

import { Logo } from "@/app/components/Logo";
import { Box, Grid, Text, Link as ChakraLink } from "@chakra-ui/react";

const NotFoundPage = () => {
	return (
		<NextLink href="/">
			<Grid width="100vw" height="80vh" placeContent="center">
				<Box position="relative" width={["95%", "80%", "400px"]}>
					<Logo opacity={0.2} />
					<Box position="absolute" left="0" top="0" width="100%" height="100%">
						<Grid
							fontSize={["lg", "xl", "2xl"]} // responsive font sizes
							color="blue.600" // using Chakra UI color scheme
							textAlign="center"
							placeContent="center"
							width="100%"
							height="100%"
							// responsive width
							sx={{
								textWrap: "balance",
								gap: 3, // spacing between text elements
							}}
						>
							<Text>אופס... כנראה שהתבלבלתם בהתנדבות</Text>
							<Text>פה אין התנדבויות...</Text>
							<ChakraLink as={NextLink} href="/">
								תנו לנו לעזור לכם לחזור לעמוד הנכון...
							</ChakraLink>
							<Text
								fontSize={["2xl", "3xl", "4xl"]} // larger font size for emphasis
								fontWeight="bold"
							>
								ביחד ננצח!
							</Text>
						</Grid>
					</Box>
				</Box>
			</Grid>
		</NextLink>
	);
};

export default NotFoundPage;
