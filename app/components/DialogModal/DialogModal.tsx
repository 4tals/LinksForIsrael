"use client";

import React from "react";

import {
	Box,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
} from "@chakra-ui/react";

type DialogModalProps = {
	title: string;
	body: React.ReactNode;
	open?: boolean;
	toggleModal: (open: boolean) => void;
	isRtl?: boolean;
};

export function DialogModal({
	title,
	body,
	open = false,
	toggleModal,
	isRtl = true,
}: DialogModalProps) {
	const handleClose = () => {
		toggleModal(false);
	};

	return (
		<Drawer
			isOpen={open}
			onClose={handleClose}
			placement={isRtl ? "left" : "right"}
			size="md"
		>
			<DrawerOverlay bg="blackAlpha.300" backdropFilter="blur(2px)" />
			<DrawerContent
				dir={isRtl ? "rtl" : "ltr"}
				maxW={{ base: "100%", sm: "460px", md: "520px" }}
				my={{ base: 0, md: 3 }}
				mx={{ base: 0, md: 3 }}
				borderRadius={{ base: 0, md: "20px" }}
				overflow="hidden"
				boxShadow="0 24px 48px -12px rgba(15, 23, 42, 0.22)"
				borderWidth={{ base: 0, md: "1px" }}
				borderColor="gray.200"
				bg="white"
			>
				<DrawerHeader
					bg="brand.600"
					color="white"
					fontSize={{ base: "lg", md: "xl" }}
					fontWeight="bold"
					py={4}
					px={6}
					pl={isRtl ? 12 : 6}
					pr={isRtl ? 6 : 12}
					flexShrink={0}
				>
					{title}
				</DrawerHeader>
				<DrawerCloseButton
					color="white"
					size="md"
					top={3.5}
					left={isRtl ? 3 : "unset"}
					right={isRtl ? "unset" : 3}
					_hover={{ bg: "whiteAlpha.200" }}
					aria-label="סגור כרטיס"
				/>
				<DrawerBody
					p={0}
					display="flex"
					flexDirection="column"
					overflowY="auto"
				>
					<Box flex="1" display="flex" flexDirection="column">
						{body}
					</Box>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
}
