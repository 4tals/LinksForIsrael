"use client";

import React, { useMemo, useState } from "react";

import { Box, Flex, Image, Text } from "@chakra-ui/react";

const SKIP_FAVICON_HOSTS = new Set([
	"chat.whatsapp.com",
	"wa.me",
	"api.whatsapp.com",
	"t.me",
	"docs.google.com",
	"forms.monday.com",
	"linktr.ee",
	"bit.ly",
	"facebook.com",
	"www.facebook.com",
	"instagram.com",
	"www.instagram.com",
	"youtube.com",
	"www.youtube.com",
	"padlet.com",
	"rebrand.ly",
	// Hosts without an indexed favicon in Google S2 (prevents 404 console noise)
	"meshekhai.co.il",
	"www.leket.org",
	"leket.org",
	"www.pitchonlev.org.il",
	"pitchonlev.org.il",
	"www.brothersforlife.com",
	"brothersforlife.com",
	"survey.gov.il",
	"akim.org.il",
	"www.akim.org.il",
	"www.netinalahaher.org.il",
	"netinalahaher.org.il",
	"yedidim-il.org",
	"www.yedidim-il.org",
]);

const FAVICON_HOST_OVERRIDES: Record<string, string> = {
	"user.drushim-miluim.co.il": "drushim-miluim.co.il",
};

const AVATAR_GRADIENTS = [
	"linear(to-br, #1e3a8a, #1d4ed8)",
	"linear(to-br, #115e59, #0f766e)",
	"linear(to-br, #312e81, #4338ca)",
	"linear(to-br, #0c4a6e, #0369a1)",
	"linear(to-br, #4c1d95, #6d28d9)",
	"linear(to-br, #002d96, #0038b8)",
];

function getHostname(url?: string | null): string | null {
	if (!url) return null;
	try {
		const parsed = new URL(url);
		return parsed.hostname.toLowerCase();
	} catch {
		return null;
	}
}

function getInitials(name: string): string {
	const cleaned = name
		.replace(/["״׳'()\-–—:|]/g, " ")
		.trim()
		.split(/\s+/)
		.filter(Boolean);
	if (cleaned.length === 0) return "ל";
	if (cleaned.length === 1) return cleaned[0].slice(0, 2).toUpperCase();
	return `${cleaned[0][0]}${cleaned[1][0]}`.toUpperCase();
}

function getGradientIndex(seed: string): number {
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash * 31 + seed.charCodeAt(i)) | 0;
	}
	return Math.abs(hash) % AVATAR_GRADIENTS.length;
}

interface OrgAvatarProps {
	name: string;
	imageUrl?: string;
	primaryUrl?: string | null;
	size?: string;
}

export const OrgAvatar: React.FC<OrgAvatarProps> = ({
	name,
	imageUrl,
	primaryUrl,
	size = "48px",
}) => {
	const hostname = useMemo(() => getHostname(primaryUrl), [primaryUrl]);
	const faviconUrl = useMemo(() => {
		if (!hostname || SKIP_FAVICON_HOSTS.has(hostname)) return null;
		const resolvedHost = FAVICON_HOST_OVERRIDES[hostname] || hostname;
		return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
			resolvedHost,
		)}&sz=64`;
	}, [hostname]);

	// Stage 0: custom imageUrl -> Stage 1: high-res site favicon -> Stage 2: crisp monogram
	const initialStage = imageUrl ? 0 : faviconUrl ? 1 : 2;
	const [stage, setStage] = useState<number>(initialStage);

	const activeSrc =
		stage === 0 ? imageUrl : stage === 1 ? faviconUrl : undefined;

	const advanceStage = () => {
		if (stage === 0 && faviconUrl) {
			setStage(1);
		} else {
			setStage(2);
		}
	};

	if (activeSrc) {
		return (
			<Flex
				boxSize={size}
				minW={size}
				borderRadius="12px"
				bg="white"
				borderWidth="1px"
				borderColor="gray.200"
				boxShadow="0 1px 2px rgba(15, 23, 42, 0.05)"
				align="center"
				justify="center"
				overflow="hidden"
				p={1.5}
				flexShrink={0}
				transition="border-color 0.2s ease, transform 0.2s ease"
				_groupHover={{ borderColor: "blue.200" }}
			>
				<Image
					src={activeSrc}
					alt=""
					w="100%"
					h="100%"
					objectFit="contain"
					borderRadius="6px"
					loading="lazy"
					onError={advanceStage}
					onLoad={(e) => {
						// Google S2 returns a 16x16 generic globe when no favicon exists
						if (stage === 1 && e.currentTarget.naturalWidth <= 16) {
							setStage(2);
						}
					}}
				/>
			</Flex>
		);
	}

	const gradient = AVATAR_GRADIENTS[getGradientIndex(name)];
	const initials = getInitials(name);

	return (
		<Box
			boxSize={size}
			minW={size}
			borderRadius="12px"
			bgGradient={gradient}
			color="white"
			display="flex"
			alignItems="center"
			justifyContent="center"
			flexShrink={0}
			boxShadow="0 2px 6px rgba(0, 56, 184, 0.18)"
			userSelect="none"
		>
			<Text fontSize="sm" fontWeight="bold" letterSpacing="0.02em">
				{initials}
			</Text>
		</Box>
	);
};
