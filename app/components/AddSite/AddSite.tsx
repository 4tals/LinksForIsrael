"use client";

import { AddIcon } from "@chakra-ui/icons";
import { Button, Link } from "@chakra-ui/react";

const NEW_INITIATIVE_ISSUE_URL =
	"https://github.com/4tals/LinksForIsrael/issues/new?template=new_initiative.yml";

export function AddSite() {
	return (
		<Button
			as={Link}
			href={NEW_INITIATIVE_ISSUE_URL}
			isExternal
			bg="white"
			color="brand.600"
			size={{ base: "sm", md: "md" }}
			borderRadius="full"
			fontWeight="bold"
			px={{ base: 3.5, md: 5 }}
			rightIcon={<AddIcon boxSize={3} />}
			boxShadow="sm"
			_hover={{
				bg: "blue.50",
				textDecoration: "none",
				transform: "translateY(-1px)",
				boxShadow: "md",
			}}
			_active={{ transform: "translateY(0)" }}
			transition="all 0.2s ease"
		>
			הוסיפו יוזמה
		</Button>
	);
}
