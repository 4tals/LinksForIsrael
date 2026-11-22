"use client";

import NextLink from "next/link";
import React from "react";
import { FaCheckCircle, FaShieldAlt } from "react-icons/fa";

import {
	computeInitiativeRankScore,
	InitiativeLink,
} from "@/app/utils/categories";
import { Badge, Box, Flex, Icon, Link, Progress, Text } from "@chakra-ui/react";

export function TrustScoreMeter({
	link,
	isRtl = true,
	onNavigate,
}: {
	link: InitiativeLink;
	isRtl?: boolean;
	onNavigate?: () => void;
}) {
	const score = computeInitiativeRankScore(link);
	const refsCount = link.references?.length || 0;

	const tierColor = score >= 75 ? "green" : score >= 45 ? "blue" : "gray";

	const signals: Array<{ label: string; active: boolean }> = [
		{
			label: isRtl ? "אימות ארגון" : "Verified Org",
			active: Boolean(link.verified),
		},
		{
			label: isRtl ? "ניהול תקין (data.gov.il)" : "MOJ Good Standing",
			active: Boolean(link.properManagement),
		},
		{
			label: isRtl ? "סעיף 46" : "§46 Tax-Deductible",
			active: Boolean(link.taxDeductible46),
		},
		{
			label: isRtl
				? refsCount > 0
					? `${refsCount} אזכורים עצמאיים`
					: "אזכורים חיצוניים"
				: refsCount > 0
					? `${refsCount} Independent Citations`
					: "Citations",
			active: refsCount > 0,
		},
		{
			label: isRtl ? "מוקד טלפוני" : "Direct Hotline",
			active: Boolean(link.phone),
		},
	];

	return (
		<Box
			bg="gray.50"
			borderWidth="1px"
			borderColor="gray.200"
			borderRadius="xl"
			p={3.5}
		>
			<Flex align="center" justify="space-between" mb={2} gap={2}>
				<Flex align="center" gap={1.5}>
					<Icon as={FaShieldAlt} color={`${tierColor}.600`} boxSize={3.5} />
					<Text fontSize="xs" fontWeight="bold" color="gray.800">
						{isRtl ? "מדד שקיפות ואימות" : "Transparency & Verification Score"}
					</Text>
				</Flex>
				<Flex align="center" gap={2}>
					<Badge
						colorScheme={tierColor}
						variant="solid"
						borderRadius="full"
						px={2}
						fontSize="2xs"
					>
						{score} / 100
					</Badge>
					<Link
						as={NextLink}
						href={isRtl ? "/docs/methodology" : "/docs/methodology?lang=en"}
						onClick={onNavigate}
						fontSize="2xs"
						color="brand.600"
						fontWeight="semibold"
						_hover={{ textDecoration: "underline" }}
					>
						{isRtl ? "שיטת הדירוג" : "Methodology"}
					</Link>
				</Flex>
			</Flex>

			<Progress
				value={score}
				size="xs"
				colorScheme={tierColor}
				borderRadius="full"
				bg="gray.200"
				mb={2.5}
			/>

			<Flex wrap="wrap" gap={1.5}>
				{signals
					.filter((s) => s.active)
					.map((s) => (
						<Badge
							key={s.label}
							bg="white"
							color="gray.700"
							borderWidth="1px"
							borderColor="gray.200"
							borderRadius="full"
							px={2}
							py={0.5}
							fontSize="2xs"
							fontWeight="medium"
							textTransform="none"
							display="inline-flex"
							alignItems="center"
							gap={1}
						>
							<Icon as={FaCheckCircle} color="green.500" boxSize={2.5} />
							<span>{s.label}</span>
						</Badge>
					))}
			</Flex>
		</Box>
	);
}
