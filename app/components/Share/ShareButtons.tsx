import React, { useEffect, useState } from "react";
import {
	FaTelegramPlane,
	FaWhatsapp,
	FaLink,
	FaShareAlt,
} from "react-icons/fa";

import {
	Flex,
	IconButton,
	Link,
	useClipboard,
	useToast,
	Tooltip,
} from "@chakra-ui/react";

export function ShareButtons({ category }: { category: string }) {
	const [currentUrl, setCurrentUrl] = useState("");
	useEffect(() => {
		if (typeof window !== "undefined") {
			setCurrentUrl(window.location.href);
		}
	}, []);

	const { onCopy } = useClipboard(currentUrl);
	const toast = useToast();
	const handleCopy = () => {
		onCopy();
		toast({
			title: "Link copied",
			status: "success",
			duration: 2000,
			isClosable: true,
		});
	};

	const isMobile = typeof navigator !== "undefined" && "share" in navigator;

	return isMobile ? (
		<MobileShareButton url={currentUrl} category={category} />
	) : (
		<Flex alignItems="center" gap={2}>
			<Tooltip label="Copy link" aria-label="Tooltip for copy link button">
				<IconButton
					aria-label="Copy link"
					icon={<FaLink />}
					onClick={handleCopy}
					size="sm"
					colorScheme="gray"
				/>
			</Tooltip>
			<Link href={`https://wa.me/?text=${currentUrl}`} isExternal>
				<Tooltip
					label="Share on WhatsApp"
					aria-label="Tooltip for WhatsApp button"
				>
					<IconButton
						icon={<FaWhatsapp />}
						// _hover={{ colorScheme: "whatsapp" }}
						aria-label="Share on WhatsApp"
						size="sm"
						colorScheme="whatsapp"
					/>
				</Tooltip>
			</Link>
			<Link href={`https://t.me/share/url?url=${currentUrl}`} isExternal>
				<Tooltip
					label="Share on Telegram"
					aria-label="Tooltip for Telegram button"
				>
					<IconButton
						icon={<FaTelegramPlane />}
						// _hover={{ colorScheme: "telegram" }}
						aria-label="Share on Telegram"
						size="sm"
						colorScheme="telegram"
					/>
				</Tooltip>
			</Link>
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
				title: "פורטל לינק לישראל - כל אתרי הסיוע למלחמה במקום אחד 🇮🇱",
				text: category,
				url,
			});
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<IconButton
			aria-label="Share"
			icon={<FaShareAlt />}
			onClick={onMobileShare}
			size="sm"
		/>
	);
}
