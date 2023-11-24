import React from "react";

import { CloseIcon } from "@chakra-ui/icons";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	useDisclosure,
	Box,
	IconButton,
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

	React.useEffect(() => {
		if (open !== isOpen) {
			toggleModal(isOpen);
		}
	}, [isOpen, open, toggleModal]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
			<ModalOverlay bg="blackAlpha.300" />
			<ModalContent borderRadius="lg" m={4} boxShadow="xl">
				<ModalHeader
					backgroundColor="blue.600"
					color="white"
					fontSize="lg"
					fontWeight="bold"
					position="relative"
				>
					{title}
					<IconButton
						icon={<CloseIcon />}
						variant="ghost"
						color="white"
						size="lg"
						position="absolute"
						top={1}
						right={isRtl ? "unset" : 1}
						left={isRtl ? 1 : "unset"}
						onClick={() => toggleModal(false)}
						aria-label="Close modal"
					/>
				</ModalHeader>
				<ModalBody p={6}>
					<Box>{body}</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
