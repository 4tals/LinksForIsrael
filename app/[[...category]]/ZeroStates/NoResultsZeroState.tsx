"use client";

import React, { useContext } from "react";

import { Logo } from "@/app/components/Logo";
import { SearchContext } from "@/app/components/RootApp";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";

export const NoResultsZeroState = () => {
	const { search, onSearch, setActiveIntent } = useContext(SearchContext);

	return (
		<Flex justify="center" align="center" py={14} px={4}>
			<VStack
				spacing={4}
				bg="white"
				p={{ base: 8, md: 10 }}
				borderRadius="2xl"
				borderWidth="1px"
				borderColor="gray.200"
				boxShadow="xs"
				textAlign="center"
				maxW="440px"
				w="100%"
			>
				<Box opacity={0.25}>
					<Logo width={76} height={86} />
				</Box>
				<Heading as="h3" size="md" color="gray.800">
					לא נמצאו תוצאות מתאימות
				</Heading>
				<Text fontSize="sm" color="gray.600">
					{search
						? `לא מצאנו יוזמות עבור "${search}". נסו מילת מפתח אחרת או עברו לעיון בקטגוריות.`
						: "לא נמצאו יוזמות תחת הסינון שנבחר."}
				</Text>
				<Button
					colorScheme="blue"
					bg="brand.600"
					_hover={{ bg: "brand.700" }}
					borderRadius="full"
					px={6}
					onClick={() => {
						onSearch("");
						setActiveIntent(null);
					}}
				>
					נקה סינון וחיפוש
				</Button>
			</VStack>
		</Flex>
	);
};
