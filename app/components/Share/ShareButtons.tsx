"use client";

import {
	faTelegramPlane,
	faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faLink, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useIsMobile, useUrl } from "../../utils/general";
import { CopyButton } from "../CopyButton/CopyButton";

export function ShareButtons({ category }: { category: string }) {
	const isMobile = useIsMobile();
	const url = useUrl();
	return isMobile && "share" in navigator ? (
		<MobileShareButton url={url} category={category} />
	) : (
		<DesktopShareButtons url={url} />
	);
}

function DesktopShareButtons({ url }: { url: string }) {
	return (
		<div className="inline-flex gap-3 items-center">
			<CopyButton copyText={url}>
				<FontAwesomeIcon icon={faLink} />
			</CopyButton>
			<a
				href={`https://wa.me/?text=${url}`}
				target="_blank"
				rel="noreferrer noopener"
				className="whatsapp-btn"
			>
				<FontAwesomeIcon icon={faWhatsapp} />
			</a>
			<a
				href={`https://t.me/share/url?url=${url}`}
				target="_blank"
				rel="noreferrer noopener"
				className="telegram-btn"
			>
				<FontAwesomeIcon icon={faTelegramPlane} />
			</a>
		</div>
	);
}

function MobileShareButton({
	category,
	url,
}: {
	category: string;
	url: string;
}) {
	return (
		<button
			className="share-mobile-btn"
			onClick={async () => {
				try {
					await navigator.share({
						title: "פורטל לינק לישראל - כל אתרי הסיוע למלחמה במקום אחד 🇮🇱",
						text: category,
						url: url,
					});
				} catch (err) {
					console.log(err);
				}
			}}
		>
			<FontAwesomeIcon icon={faShareAlt} />
		</button>
	);
}
