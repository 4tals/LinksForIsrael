"use client";

import React, { useEffect, useState } from "react";
import {
	FaLink,
	FaShareAlt,
	FaTelegramPlane,
	FaWhatsapp,
} from "react-icons/fa";

import { URL_CHANGE_EVENT } from "@/app/utils/urlState";
import { Flex, IconButton, Link, Tooltip, useToast } from "@chakra-ui/react";

export function ShareButtons({ category }: { category: string }) {
	const [currentUrl, setCurrentUrl] = useState("");
	const [canNativeShare, setCanNativeShare] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const syncUrl = () => {
			setCurrentUrl(window.location.href);
		};
		syncUrl();
		setCanNativeShare(
			typeof navigator !== "undefined" &&
				"share" in navigator &&
				window.innerWidth <= 768,
		);
		window.addEventListener(URL_CHANGE_EVENT, syncUrl);
		window.addEventListener("popstate", syncUrl);
		return () => {
			window.removeEventListener(URL_CHANGE_EVENT, syncUrl);
			window.removeEventListener("popstate", syncUrl);
		};
	}, []);

	const toast = useToast();

	const handleCopy = async () => {
		const targetUrl =
			typeof window !== "undefined" ? window.location.href : currentUrl;
		try {
			await navigator.clipboard.writeText(targetUrl);
			toast({
				title: "הקישור הועתק ללוח",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		} catch {
			// Clipboard unavailable
		}
	};

	const encodedUrl = encodeURIComponent(currentUrl);
	const encodedText = encodeURIComponent(
		`פורטל לינק לישראל - ${category}: ${currentUrl}`,
	);

	if (canNativeShare) {
		return <MobileShareButton url={currentUrl} category={category} />;
	}

	return (
		<Flex alignItems="center" gap={1.5}>
			<Tooltip label="העתק קישור לתצוגה הנוכחית" hasArrow>
				<IconButton
					aria-label="העתק קישור"
					icon={<FaLink />}
					onClick={handleCopy}
					size="sm"
					variant="ghost"
					borderRadius="full"
					color="brand.600"
					_hover={{ bg: "blue.50" }}
				/>
			</Tooltip>
			<Tooltip label="שתף בוואטסאפ" hasArrow>
				<IconButton
					as={Link}
					href={`https://wa.me/?text=${encodedText}`}
					isExternal
					aria-label="שתף בוואטסאפ"
					icon={<FaWhatsapp />}
					size="sm"
					variant="ghost"
					borderRadius="full"
					color="#25D366"
					_hover={{ bg: "green.50" }}
				/>
			</Tooltip>
			<Tooltip label="שתף בטלגרם" hasArrow>
				<IconButton
					as={Link}
					href={`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(
						`פורטל לינק לישראל - ${category}`,
					)}`}
					isExternal
					aria-label="שתף בטלגרם"
					icon={<FaTelegramPlane />}
					size="sm"
					variant="ghost"
					borderRadius="full"
					color="#0088cc"
					_hover={{ bg: "blue.50" }}
				/>
			</Tooltip>
		</Flex>
	);
}

function MobileShareButton({
	category,
	url,
}: {
	category: string;
	url: string;
}) {
	const onMobileShare = async () => {
		try {
			await navigator.share({
				title: "פורטל לינק לישראל - כל אתרי הסיוע במקום אחד",
				text: category,
				url: typeof window !== "undefined" ? window.location.href : url,
			});
		} catch {
			// User cancelled native share sheet
		}
	};

	return (
		<IconButton
			aria-label="שתף את העמוד"
			icon={<FaShareAlt />}
			onClick={onMobileShare}
			size="sm"
			variant="outline"
			colorScheme="blue"
			borderRadius="full"
		/>
	);
}
