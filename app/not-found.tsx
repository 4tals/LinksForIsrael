"use client";

import NextLink from "next/link";

import { Logo } from "@/app/components/Logo";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";

const NotFoundPage = () => {
	return (
		<Flex
			minH="65vh"
			align="center"
			justify="center"
			px={4}
			py={12}
			position="relative"
		>
			<VStack
				spacing={5}
				textAlign="center"
				maxW="480px"
				bg="white"
				p={{ base: 8, md: 10 }}
				borderRadius="2xl"
				boxShadow="md"
				borderWidth="1px"
				borderColor="gray.100"
			>
				<Box opacity={0.9}>
					<Logo width={72} height={81} />
				</Box>
				<Heading as="h2" size="lg" color="brand.600">
					אופס... העמוד לא נמצא
				</Heading>
				<Text color="gray.600" fontSize="md">
					כנראה שהתבלבלתם בקישור, פה אין יוזמות — אבל בעמוד הראשי מחכות לכם מאות
					יוזמות פעילות.
				</Text>
				<Button
					as={NextLink}
					href="/"
					colorScheme="blue"
					bg="brand.600"
					_hover={{ bg: "brand.700" }}
					size="lg"
					borderRadius="full"
					px={8}
				>
					חזרה לעמוד הראשי
				</Button>
				<Text fontSize="xl" fontWeight="bold" color="brand.600">
					ביחד ננצח!
				</Text>
			</VStack>
		</Flex>
	);
};

export default NotFoundPage;
