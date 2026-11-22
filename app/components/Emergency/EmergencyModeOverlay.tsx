"use client";

import NextLink from "next/link";
import React from "react";
import {
	FaExclamationTriangle,
	FaExternalLinkAlt,
	FaPhoneAlt,
	FaPrint,
	FaTimes,
} from "react-icons/fa";

import { updateUrlParams } from "@/app/utils/urlState";
import {
	Badge,
	Box,
	Button,
	Container,
	Flex,
	Heading,
	HStack,
	Icon,
	Link,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	SimpleGrid,
	Text,
} from "@chakra-ui/react";

const EMERGENCY_CARDS = [
	{
		name: "פיקוד העורף",
		desc: "הנחיות התגוננות, מרחבים מוגנים וחירום",
		number: "104",
		href: "tel:104",
		web: "https://www.oref.org.il/",
		color: "orange",
	},
	{
		name: "מד״א — אמבולנס",
		desc: "חירום רפואי והצלת חיים 24/7",
		number: "101",
		href: "tel:101",
		web: "https://www.mdais.org/",
		color: "red",
	},
	{
		name: "משטרת ישראל",
		desc: "דיווח על סכנה מיידית ואירועי ביטחון",
		number: "100",
		href: "tel:100",
		color: "blue",
	},
	{
		name: "כבאות והצלה",
		desc: "שריפות, חילוץ ולכודים",
		number: "102",
		href: "tel:102",
		color: "red",
	},
	{
		name: "ער״ן — סיוע נפשי 24/7",
		desc: "עזרה ראשונה נפשית אנונימית (עברית, ערבית, רוסית, אנגלית)",
		number: "1201",
		href: "tel:1201",
		web: "https://www.eran.org.il/",
		color: "teal",
	},
	{
		name: "נט״ל — טראומה וחרדה",
		desc: "קו סיוע מקצועי לנפגעי חרדה, מלחמה וטראומה",
		number: "1-800-363-363",
		href: "tel:1800363363",
		web: "https://www.natal.org.il/",
		color: "purple",
	},
	{
		name: "איחוד הצלה",
		desc: "חובשים ופרמדיקים מתנדבים בהגעה מיידית",
		number: "1221",
		href: "tel:1221",
		web: "https://1221.org.il/",
		color: "orange",
	},
	{
		name: "ידידים — סיוע בדרכים ובבית",
		desc: "חילוץ ממעלית, פתיחת דלת, פנצ׳ר ומצבר — חינם",
		number: "1230",
		href: "tel:1230",
		web: "https://yedidim-il.org/",
		color: "green",
	},
	{
		name: "סיוע לנפגעות ולנפגעי תקיפה מינית",
		desc: "מוקד 24/7 אנונימי לנשים (1202) ולגברים (1203)",
		number: "1202",
		href: "tel:1202",
		web: "https://1202.org.il/",
		color: "pink",
	},
];

export function EmergencyModeOverlay({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const handleClose = () => {
		updateUrlParams({ emergency: null });
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} size="full">
			<ModalOverlay bg="gray.900" />
			<ModalContent bg="#0f172a" color="white" dir="rtl" m={0}>
				<ModalBody p={0}>
					<Box
						bg="red.700"
						py={4}
						px={4}
						borderBottomWidth="2px"
						borderColor="red.500"
					>
						<Container maxW="1100px">
							<Flex align="center" justify="space-between" wrap="wrap" gap={3}>
								<Flex align="center" gap={3}>
									<Icon
										as={FaExclamationTriangle}
										boxSize={6}
										color="yellow.300"
									/>
									<Box>
										<Heading as="h2" size="md">
											מצב חירום שקט — מוקדי הצלה וסיוע 24/7
										</Heading>
										<Text fontSize="xs" color="red.100">
											תצוגה מהירה ונקייה לשעת חירום — זמינה גם ללא קליטה מלאה
										</Text>
									</Box>
								</Flex>

								<HStack spacing={2}>
									<Button
										as={NextLink}
										href="/print"
										onClick={handleClose}
										size="sm"
										variant="outline"
										color="white"
										borderColor="whiteAlpha.500"
										_hover={{ bg: "whiteAlpha.200", textDecoration: "none" }}
										leftIcon={<Icon as={FaPrint} />}
										borderRadius="full"
									>
										דף להדפסה לממ״ד
									</Button>
									<Button
										size="sm"
										bg="white"
										color="gray.900"
										_hover={{ bg: "gray.100" }}
										leftIcon={<Icon as={FaTimes} />}
										borderRadius="full"
										onClick={handleClose}
									>
										יציאה ממצב חירום
									</Button>
								</HStack>
							</Flex>
						</Container>
					</Box>

					<Container maxW="1100px" py={{ base: 6, md: 8 }} px={4}>
						<SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
							{EMERGENCY_CARDS.map((card) => (
								<Flex
									key={card.number}
									direction="column"
									justify="space-between"
									bg="gray.800"
									borderWidth="1px"
									borderColor="gray.700"
									borderRadius="2xl"
									p={5}
									gap={4}
								>
									<Box>
										<Flex align="center" justify="space-between" mb={2}>
											<Heading as="h3" size="sm" color="white">
												{card.name}
											</Heading>
											<Badge
												colorScheme={card.color}
												variant="solid"
												fontSize="sm"
												px={3}
												py={0.5}
												borderRadius="full"
												dir="ltr"
											>
												{card.number}
											</Badge>
										</Flex>
										<Text fontSize="sm" color="gray.300" lineHeight="1.5">
											{card.desc}
										</Text>
									</Box>

									<HStack spacing={2}>
										<Button
											as={Link}
											href={card.href}
											flex="1"
											size="lg"
											colorScheme="green"
											borderRadius="xl"
											leftIcon={<Icon as={FaPhoneAlt} />}
											_hover={{ textDecoration: "none" }}
										>
											חייג עכשיו ({card.number})
										</Button>
										{card.web && (
											<Button
												as={Link}
												href={card.web}
												isExternal
												size="lg"
												variant="outline"
												color="gray.200"
												borderColor="gray.600"
												_hover={{ bg: "gray.700", textDecoration: "none" }}
												borderRadius="xl"
												aria-label={`אתר ${card.name}`}
											>
												<Icon as={FaExternalLinkAlt} boxSize={3.5} />
											</Button>
										)}
									</HStack>
								</Flex>
							))}
						</SimpleGrid>
					</Container>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
