"use client";

import React from "react";

import { SimpleGrid, Text } from "@chakra-ui/react";

import { InitiativeLink as LinkType } from "../../utils/categories";
import { InitiativeItem } from "./InitiativeItem";

export function InitiativeList({
	name,
	categoryId,
	links,
	setDescription,
	setOpenDialog,
}: {
	name: string;
	categoryId?: string;
	links: Array<LinkType>;
	setDescription: (
		description: { body: React.ReactNode; link: LinkType } | null,
	) => void;
	setOpenDialog: (open: boolean) => void;
}) {
	if (links.length === 0) {
		return (
			<Text key={name} color="gray.500" fontSize="sm" py={2}>
				בקרוב יתווספו יוזמות בקטגוריה זו
			</Text>
		);
	}

	return (
		<SimpleGrid
			columns={{ base: 1, md: 2, xl: 3 }}
			spacing={{ base: 3.5, md: 4 }}
			pt={2}
		>
			{links.map((link) => (
				<InitiativeItem
					link={link}
					categoryId={categoryId}
					subCategoryName={name}
					key={`${name}-${link.name}`}
					setDescription={setDescription}
					setOpenDialog={setOpenDialog}
				/>
			))}
		</SimpleGrid>
	);
}
