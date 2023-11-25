"use client";

import { Link } from "../utils/categories";
import { ICONS, ICONS_KEYS } from "../utils/consts";
import { Tooltip } from "./Tooltip";

export const LinkIcons = ({
	link,
	limit,
}: {
	link: Link | any;
	limit?: number;
}) => {
	let iconDisplay: Array<keyof typeof ICONS> = [];
	let showIcons: Array<keyof typeof ICONS> = [];
	let overLimit = 0;

	ICONS_KEYS.forEach((key: any) => {
		if (link[key]) {
			iconDisplay.push(key);
		}
	});

	if (limit && limit < iconDisplay.length) {
		showIcons = iconDisplay.slice(0, limit);
		overLimit = iconDisplay.length - limit;
	} else {
		showIcons = iconDisplay;
	}

	return (
		<div className="link-icons">
			{showIcons.map((icon) => (
				<a href={link[icon]} key={icon} target="_blank">
					<img
						className="link-icon"
						src={ICONS[icon].src}
						alt={ICONS[icon].alt}
					/>
				</a>
			))}
			{link.phone && (
				<a href={`tel:${link.phone}`} target="_blank">
					<img
						className="link-icon"
						src="https://cdn2.iconfinder.com/data/icons/font-awesome/1792/phone-512.png"
						alt="Phone Link"
					/>
				</a>
			)}

			{link.email && (
				<a href={`mailto:${link.email}`} target="_blank">
					<img
						className="link-icon"
						src="https://cdn2.iconfinder.com/data/icons/social-media-2259/512/gmail-512.png"
						alt="Email Link"
					/>
				</a>
			)}

			{link.initiativeValidationDetails && (
				<Tooltip content={link.initiativeValidationDetails} />
			)}
			{overLimit > 0 && <span className="link-icon">{overLimit}+</span>}
		</div>
	);
};
