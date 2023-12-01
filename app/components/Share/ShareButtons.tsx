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
		<Flex alignItems="center" gap={1}>
			<IconButton
				aria-label="Copy link"
				icon={<FaLink />}
				onClick={handleCopy}
				size="sm"
				colorScheme="gray"
			/>
			<Link href={`https://wa.me/?text=${currentUrl}`} isExternal>
				<IconButton
					icon={<FaWhatsapp />}
					colorScheme="whatsapp"
					aria-label="Share on WhatsApp"
					size="sm"
				/>
			</Link>
			<Link href={`https://t.me/share/url?url=${currentUrl}`} isExternal>
				<IconButton
					icon={<FaTelegramPlane />}
					aria-label="Share on Telegram"
					colorScheme="telegram"
					size="sm"
				/>
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
