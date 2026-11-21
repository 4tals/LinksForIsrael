"use client";

import React from "react";

import {
	Box,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
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
		<Modal
			isOpen={open}
			onClose={handleClose}
			isCentered
			size={{ base: "full", sm: "lg", md: "xl" }}
			scrollBehavior="inside"
		>
			<ModalOverlay bg="blackAlpha.500" backdropFilter="blur(2px)" />
			<ModalContent
				borderRadius={{ base: 0, sm: "xl" }}
				overflow="hidden"
				boxShadow="2xl"
				dir={isRtl ? "rtl" : "ltr"}
				maxH={{ base: "100dvh", sm: "88vh" }}
			>
				<ModalHeader
					bg="brand.600"
					color="white"
					fontSize={{ base: "lg", md: "xl" }}
					fontWeight="bold"
					py={4}
					px={6}
					pl={isRtl ? 12 : 6}
					pr={isRtl ? 6 : 12}
				>
					{title}
				</ModalHeader>
				<ModalCloseButton
					color="white"
					size="md"
					top={3.5}
					left={isRtl ? 3 : "unset"}
					right={isRtl ? "unset" : 3}
					_hover={{ bg: "whiteAlpha.200" }}
					aria-label="סגור חלון"
				/>
				<ModalBody p={0}>
					<Box>{body}</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
