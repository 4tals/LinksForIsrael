"use client";

import React, { useState } from "react";

import { Logo } from "@/app/components/Logo";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

import { InitiativeLink as LinkType } from "../../utils/categories";
import { InitiativeIcons } from "./InitiativeIcons";
import { ShowMoreModal } from "./InitiativeShowMoreModal";

const containsHebrewLetters = (str: string): boolean =>
	/[\u0590-\u05EA]/.test(str);

interface InitiativeItemProps {
	link: LinkType;
	categoryId?: string;
	subCategoryName?: string;
	setDescription: (description: {
		body: React.ReactNode;
		link: LinkType;
	}) => void;
	setOpenDialog: (open: boolean) => void;
}

export const InitiativeItem: React.FC<InitiativeItemProps> = ({
	link,
	categoryId,
	subCategoryName,
	setDescription,
	setOpenDialog,
}) => {
	const [imageError, setImageError] = useState(false);
	const isRtl = containsHebrewLetters(
		`${link.displayName || ""}${link.shortDescription || ""}`,
	);

	const sharePath =
		categoryId && subCategoryName
			? `/${encodeURIComponent(categoryId)}/${encodeURIComponent(
					subCategoryName,
				)}/${encodeURIComponent(link.name)}`
			: undefined;

	const openDetailsModal = () => {
		setDescription({
			link,
			body: (
				<ShowMoreModal
					link={link}
					setOpenDialog={setOpenDialog}
					sharePath={sharePath}
				/>
			),
		});
		setOpenDialog(true);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			openDetailsModal();
		}
	};

	const hasValidImage = Boolean(link.initiativeImage) && !imageError;

	return (
		<Flex
			direction="column"
			bg="white"
			borderRadius="xl"
			borderWidth="1px"
			borderColor="gray.200"
			overflow="hidden"
			cursor="pointer"
			role="button"
			tabIndex={0}
			aria-label={`פרטים נוספים על ${link.displayName}`}
			transition="all 0.2s ease"
			boxShadow="xs"
			_hover={{
				borderColor: "brand.400",
				boxShadow: "md",
				transform: "translateY(-3px)",
			}}
			_focusVisible={{
				outline: "none",
				boxShadow: "0 0 0 3px rgba(29, 92, 214, 0.35)",
			}}
			onClick={openDetailsModal}
			onKeyDown={handleKeyDown}
			style={{ direction: isRtl ? "rtl" : "ltr" }}
			h="100%"
		>
			<Box
				position="relative"
				w="100%"
				h="124px"
				bg={hasValidImage ? "gray.50" : "brand.50"}
				bgGradient={
					hasValidImage ? undefined : "linear(to-br, blue.50, blue.100)"
				}
				borderBottomWidth="1px"
				borderColor="gray.100"
				overflow="hidden"
				display="flex"
				alignItems="center"
				justifyContent="center"
				flexShrink={0}
			>
				{hasValidImage ? (
					<Image
						src={link.initiativeImage}
						alt={link.displayName}
						objectFit="cover"
						w="100%"
						h="100%"
						loading="lazy"
						onError={() => setImageError(true)}
					/>
				) : (
					<Box opacity={0.25}>
						<Logo width={56} height={63} />
					</Box>
				)}
			</Box>

			<Flex direction="column" flex="1" p={4} justify="space-between" gap={2}>
				<Box>
					<Text
						fontSize="md"
						fontWeight="bold"
						color="gray.800"
						noOfLines={2}
						lineHeight="1.35"
					>
						{link.displayName}
					</Text>
					{link.shortDescription && (
						<Text
							fontSize="sm"
							color="gray.600"
							mt={1.5}
							noOfLines={3}
							lineHeight="1.5"
						>
							{link.shortDescription}
						</Text>
					)}
				</Box>

				<Flex
					align="center"
					justify="space-between"
					pt={2}
					mt="auto"
					borderTopWidth="1px"
					borderColor="gray.100"
					gap={2}
				>
					<Box flex="1">
						<InitiativeIcons link={link} limit={4} />
					</Box>
					<Text
						fontSize="xs"
						fontWeight="semibold"
						color="brand.600"
						whiteSpace="nowrap"
					>
						{isRtl ? "לפרטים ←" : "Details →"}
					</Text>
				</Flex>
			</Flex>
		</Flex>
	);
};
