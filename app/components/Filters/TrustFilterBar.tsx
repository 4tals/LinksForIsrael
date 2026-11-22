"use client";

import React, { useMemo } from "react";
import {
	FaCheckCircle,
	FaHandHoldingHeart,
	FaHandsHelping,
	FaLifeRing,
	FaNewspaper,
	FaPhoneAlt,
	FaReceipt,
	FaTimes,
} from "react-icons/fa";

import {
	getInitiativeIntents,
	InitiativeIntent,
	InitiativeLink,
} from "@/app/utils/categories";
import { Badge, Box, Button, Flex, Icon, Text } from "@chakra-ui/react";

export interface TrustFilterState {
	verifiedOnly: boolean;
	taxDeductible46: boolean;
	us501c3?: boolean;
	hasReferences: boolean;
	hasPhone: boolean;
	intent: InitiativeIntent | null;
}

export const INITIAL_TRUST_FILTER: TrustFilterState = {
	verifiedOnly: false,
	taxDeductible46: false,
	us501c3: false,
	hasReferences: false,
	hasPhone: false,
	intent: null,
};

export function hasActiveTrustFilters(state: TrustFilterState): boolean {
	return Boolean(
		state.verifiedOnly ||
			state.taxDeductible46 ||
			state.us501c3 ||
			state.hasReferences ||
			state.hasPhone ||
			state.intent,
	);
}

export function filterInitiativesByTrust(
	links: InitiativeLink[],
	state: TrustFilterState,
	categoryId?: string,
): InitiativeLink[] {
	if (!hasActiveTrustFilters(state)) return links;
	return links.filter((link) => {
		if (state.verifiedOnly && !link.verified) return false;
		if (state.taxDeductible46 && !link.taxDeductible46) return false;
		if (state.us501c3 && !link.us501c3) return false;
		if (
			state.hasReferences &&
			(!link.references || link.references.length === 0)
		) {
			return false;
		}
		if (state.hasPhone && !link.phone) return false;
		if (state.intent) {
			const intents = getInitiativeIntents(link, categoryId);
			if (!intents.includes(state.intent)) return false;
		}
		return true;
	});
}

const LABELS = {
	he: {
		verified: "מאומת בלבד",
		section46: "סעיף 46",
		us501c3: "501(c)(3) ארה״ב",
		references: "עם אזכורים בתקשורת",
		phone: "מוקד טלפוני",
		"get-help": "סיוע",
		volunteer: "התנדבות",
		donate: "תרומה",
		clear: "נקה סינון",
		showing: (shown: number, total: number) =>
			`מציג ${shown} מתוך ${total} יוזמות`,
	},
	en: {
		verified: "Verified Only",
		section46: "Tax-Deductible (§46)",
		us501c3: "US 501(c)(3)",
		references: "Press & Citations",
		phone: "Hotline",
		"get-help": "Get Help",
		volunteer: "Volunteer",
		donate: "Donate",
		clear: "Clear",
		showing: (shown: number, total: number) =>
			`Showing ${shown} of ${total} organizations`,
	},
} as const;

interface TrustFilterBarProps {
	links: InitiativeLink[];
	value: TrustFilterState;
	onChange: (next: TrustFilterState) => void;
	totalFilteredCount: number;
	categoryId?: string;
	locale?: "he" | "en";
	showIntentFilters?: boolean;
}

export const TrustFilterBar: React.FC<TrustFilterBarProps> = ({
	links,
	value,
	onChange,
	totalFilteredCount,
	categoryId,
	locale = "he",
	showIntentFilters = true,
}) => {
	const t = LABELS[locale];
	const isActive = hasActiveTrustFilters(value);

	const counts = useMemo(() => {
		let verified = 0;
		let sec46 = 0;
		let us501c3 = 0;
		let refs = 0;
		let phone = 0;
		const intents: Record<InitiativeIntent, number> = {
			"get-help": 0,
			volunteer: 0,
			donate: 0,
		};

		for (const link of links) {
			if (link.verified) verified++;
			if (link.taxDeductible46) sec46++;
			if (link.us501c3) us501c3++;
			if (link.references && link.references.length > 0) refs++;
			if (link.phone) phone++;
			if (showIntentFilters) {
				for (const intent of getInitiativeIntents(link, categoryId)) {
					intents[intent]++;
				}
			}
		}

		return { verified, sec46, us501c3, refs, phone, intents };
	}, [links, categoryId, showIntentFilters]);

	const hasAnyFilterableSignal =
		counts.verified > 0 ||
		counts.sec46 > 0 ||
		counts.us501c3 > 0 ||
		counts.refs > 0 ||
		counts.phone > 0;

	if (links.length < 3 || !hasAnyFilterableSignal) return null;

	const intentPillConfigs: Array<{
		id: InitiativeIntent;
		icon: React.ElementType;
		colorScheme: string;
	}> = [
		{ id: "get-help", icon: FaLifeRing, colorScheme: "blue" },
		{ id: "volunteer", icon: FaHandsHelping, colorScheme: "teal" },
		{ id: "donate", icon: FaHandHoldingHeart, colorScheme: "purple" },
	];

	const activeIntentTypes = intentPillConfigs.filter(
		(cfg) =>
			counts.intents[cfg.id] > 0 && counts.intents[cfg.id] < links.length,
	);

	return (
		<Box
			bg="white"
			borderRadius="xl"
			borderWidth="1px"
			borderColor="gray.200"
			px={{ base: 3, md: 4 }}
			py={2.5}
			mb={4}
			boxShadow="2xs"
		>
			<Flex align="center" justify="space-between" wrap="wrap" gap={2}>
				<Flex align="center" wrap="wrap" gap={1.5}>
					{counts.verified > 0 && (
						<Button
							size="xs"
							borderRadius="full"
							colorScheme="green"
							variant={value.verifiedOnly ? "solid" : "outline"}
							leftIcon={<Icon as={FaCheckCircle} boxSize={3} />}
							onClick={() =>
								onChange({ ...value, verifiedOnly: !value.verifiedOnly })
							}
						>
							{t.verified}
							<Badge
								ms={1.5}
								borderRadius="full"
								fontSize="2xs"
								bg={value.verifiedOnly ? "whiteAlpha.300" : "green.50"}
								color={value.verifiedOnly ? "white" : "green.700"}
							>
								{counts.verified}
							</Badge>
						</Button>
					)}

					{counts.sec46 > 0 && (
						<Button
							size="xs"
							borderRadius="full"
							colorScheme="teal"
							variant={value.taxDeductible46 ? "solid" : "outline"}
							leftIcon={<Icon as={FaReceipt} boxSize={2.5} />}
							onClick={() =>
								onChange({
									...value,
									taxDeductible46: !value.taxDeductible46,
								})
							}
						>
							{t.section46}
							<Badge
								ms={1.5}
								borderRadius="full"
								fontSize="2xs"
								bg={value.taxDeductible46 ? "whiteAlpha.300" : "teal.50"}
								color={value.taxDeductible46 ? "white" : "teal.700"}
							>
								{counts.sec46}
							</Badge>
						</Button>
					)}

					{counts.us501c3 > 0 && (
						<Button
							size="xs"
							borderRadius="full"
							colorScheme="purple"
							variant={value.us501c3 ? "solid" : "outline"}
							leftIcon={<Icon as={FaReceipt} boxSize={2.5} />}
							onClick={() =>
								onChange({
									...value,
									us501c3: !value.us501c3,
								})
							}
						>
							{t.us501c3}
							<Badge
								ms={1.5}
								borderRadius="full"
								fontSize="2xs"
								bg={value.us501c3 ? "whiteAlpha.300" : "purple.50"}
								color={value.us501c3 ? "white" : "purple.700"}
							>
								{counts.us501c3}
							</Badge>
						</Button>
					)}

					{counts.refs > 0 && (
						<Button
							size="xs"
							borderRadius="full"
							colorScheme="blue"
							variant={value.hasReferences ? "solid" : "outline"}
							leftIcon={<Icon as={FaNewspaper} boxSize={2.5} />}
							onClick={() =>
								onChange({ ...value, hasReferences: !value.hasReferences })
							}
						>
							{t.references}
							<Badge
								ms={1.5}
								borderRadius="full"
								fontSize="2xs"
								bg={value.hasReferences ? "whiteAlpha.300" : "blue.50"}
								color={value.hasReferences ? "white" : "blue.700"}
							>
								{counts.refs}
							</Badge>
						</Button>
					)}

					{counts.phone > 0 && (
						<Button
							size="xs"
							borderRadius="full"
							colorScheme="green"
							variant={value.hasPhone ? "solid" : "outline"}
							leftIcon={<Icon as={FaPhoneAlt} boxSize={2.5} />}
							onClick={() => onChange({ ...value, hasPhone: !value.hasPhone })}
						>
							{t.phone}
							<Badge
								ms={1.5}
								borderRadius="full"
								fontSize="2xs"
								bg={value.hasPhone ? "whiteAlpha.300" : "green.50"}
								color={value.hasPhone ? "white" : "green.700"}
							>
								{counts.phone}
							</Badge>
						</Button>
					)}

					{showIntentFilters &&
						activeIntentTypes.map((cfg) => {
							const selected = value.intent === cfg.id;
							return (
								<Button
									key={cfg.id}
									size="xs"
									borderRadius="full"
									colorScheme={cfg.colorScheme}
									variant={selected ? "solid" : "ghost"}
									bg={selected ? undefined : "gray.50"}
									borderWidth="1px"
									borderColor={selected ? "transparent" : "gray.200"}
									leftIcon={<Icon as={cfg.icon} boxSize={2.5} />}
									onClick={() =>
										onChange({
											...value,
											intent: selected ? null : cfg.id,
										})
									}
								>
									{t[cfg.id]}
								</Button>
							);
						})}
				</Flex>

				{isActive && (
					<Flex align="center" gap={2}>
						<Text fontSize="xs" color="gray.500" fontWeight="medium">
							{t.showing(totalFilteredCount, links.length)}
						</Text>
						<Button
							size="xs"
							variant="ghost"
							colorScheme="gray"
							borderRadius="full"
							leftIcon={<Icon as={FaTimes} boxSize={2.5} />}
							onClick={() => onChange(INITIAL_TRUST_FILTER)}
						>
							{t.clear}
						</Button>
					</Flex>
				)}
			</Flex>
		</Box>
	);
};
