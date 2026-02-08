import React from "react";

import { CloseIcon } from "@chakra-ui/icons";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	useDisclosure,
	Box,
	IconButton,
	useColorModeValue,
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
	isRtl,
}: DialogModalProps) {
	const { isOpen, onClose } = useDisclosure({ isOpen: open });

	// All color mode values at top level
	const overlayBg = useColorModeValue(
		"rgba(0, 0, 0, 0.4)",
		"rgba(0, 0, 0, 0.6)",
	);
	const contentBg = useColorModeValue("white", "gray.800");
	const closeBtnBg = useColorModeValue("gray.100", "gray.700");
	const closeBtnHoverBg = useColorModeValue("gray.200", "gray.600");
	const closeBtnColor = useColorModeValue("gray.600", "gray.300");

	React.useEffect(() => {
		if (open !== isOpen) {
			toggleModal(isOpen);
		}
	}, [isOpen, open, toggleModal]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			size="xl"
			motionPreset="slideInBottom"
		>
			<ModalOverlay bg={overlayBg} backdropFilter="blur(8px)" />
			<ModalContent
				borderRadius="2xl"
				m={4}
				boxShadow="2xl"
				bg={contentBg}
				overflow="hidden"
				maxH="90vh"
			>
				{/* Floating close button */}
				<IconButton
					icon={<CloseIcon boxSize={3} />}
					variant="solid"
					bg={closeBtnBg}
					color={closeBtnColor}
					size="sm"
					position="absolute"
					top={3}
					right={isRtl ? "unset" : 3}
					left={isRtl ? 3 : "unset"}
					zIndex={10}
					onClick={() => toggleModal(false)}
					aria-label="Close modal"
					borderRadius="full"
					boxShadow="md"
					_hover={{
						bg: closeBtnHoverBg,
						transform: "scale(1.05)",
					}}
					_active={{
						transform: "scale(0.95)",
					}}
					transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				/>
				<ModalBody p={0} overflowY="auto">
					<Box>{body}</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
