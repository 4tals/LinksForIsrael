"use client";

import { useContext } from "react";

import { SearchContext } from "@/app/components/RootApp";
import { AddIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	Link,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react";

const FORM_EMBED_URL =
	"https://docs.google.com/forms/d/e/1FAIpQLSco2RfeIn1glCPqC2JoPtN-lfmdmxu6HPy7JjHnt66ktk8SAw/viewform?embedded=true";
const FORM_DIRECT_URL =
	"https://docs.google.com/forms/d/e/1FAIpQLSco2RfeIn1glCPqC2JoPtN-lfmdmxu6HPy7JjHnt66ktk8SAw/viewform";

export function AddSite() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isMobileSearchOpen, toggleMobileSearch } = useContext(SearchContext);

	const handleOpen = () => {
		if (isMobileSearchOpen) {
			toggleMobileSearch();
		}
		onOpen();
	};

	return (
		<>
			<Button
				type="button"
				onClick={handleOpen}
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
					transform: "translateY(-1px)",
					boxShadow: "md",
				}}
				_active={{ transform: "translateY(0)" }}
				transition="all 0.2s ease"
			>
				הוסיפו יוזמה
			</Button>

			<Modal
				isOpen={isOpen}
				onClose={onClose}
				isCentered
				size={{ base: "full", md: "2xl" }}
			>
				<ModalOverlay bg="blackAlpha.500" backdropFilter="blur(2px)" />
				<ModalContent
					borderRadius={{ base: 0, md: "xl" }}
					overflow="hidden"
					maxH={{ base: "100dvh", md: "88vh" }}
				>
					<ModalHeader
						bg="brand.600"
						color="white"
						py={3.5}
						px={5}
						fontSize="lg"
					>
						<Flex align="center" justify="space-between" pl={8}>
							<span>הוספת יוזמה חדשה</span>
							<Link
								href={FORM_DIRECT_URL}
								isExternal
								fontSize="xs"
								fontWeight="medium"
								color="blue.100"
								_hover={{ color: "white", textDecoration: "underline" }}
								display="inline-flex"
								alignItems="center"
								gap={1}
							>
								פתיחה בחלון חדש
								<ExternalLinkIcon />
							</Link>
						</Flex>
					</ModalHeader>
					<ModalCloseButton
						color="white"
						top={3}
						left={3}
						right="unset"
						aria-label="סגור טופס"
					/>
					<ModalBody p={0} bg="gray.50">
						<Box h={{ base: "calc(100dvh - 56px)", md: "72vh" }} w="100%">
							<iframe
								title="טופס הוספת יוזמה ללינק לישראל"
								src={FORM_EMBED_URL}
								width="100%"
								height="100%"
								style={{ border: 0 }}
							>
								טוען טופס...
							</iframe>
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
