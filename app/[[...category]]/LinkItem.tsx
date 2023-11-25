"use client";

import { ReactNode } from "react";

import { Link } from "../utils/categories";
import { LinkIcons } from "./LinkIcons";

const containsHebrewLetters = (str: string) => {
	// https://jcuenod.github.io/bibletech/2017/08/19/matching-hebrew-unicode-regex/
	return /[\u0590-\u05EA]/.test(str);
};

export function LinkItem({
	link,
	setDescription,
	setOpenDialog,
}: {
	link: Link;
	setDescription: (description: { body: ReactNode; link: Link } | null) => void;
	setOpenDialog: (open: boolean) => void;
}) {
	const handleLinkClick = (e: React.MouseEvent) => {
		if (link.description?.length > 0) {
			e.preventDefault(); // Prevent redirect
			showMore(link, setOpenDialog);
		}
	};

	const showMore = (link: Link, setOpenDialog: any) => {
		setDescription({
			link,
			body: (
				<>
					<p>{link.description}</p>
					<br />
					<LinkIcons link={link} />
					<a href={link.url} target="_blank" className="popup-link-btn">
						פתח יוזמה
					</a>{" "}
				</>
			),
		});
		setOpenDialog(true); // <-- Open the modal
	};

	return (
		<div
			className={`links-section-item 
				${
					!containsHebrewLetters(`${link.displayName}${link?.shortDescription}`)
						? "ltr"
						: ""
				}`}
			key={link.name}
		>
			{link.initiativeImage && (
				<div
					className="link-initiative-icon-bg"
					style={{ backgroundImage: `url("${link.initiativeImage}")` }}
				></div>
			)}
			<a
				href={link.url}
				target={link.url?.startsWith(".") ? "" : "_blank"}
				onClick={handleLinkClick}
			>
				<div id={link.name} className="links-section-item-title">
					{link.displayName}
					{link.shortDescription !== "" && (
						<>
							<br />
							<span className="links-section-item-short-description">
								{link.shortDescription}
							</span>
						</>
					)}
				</div>

				<LinkIcons link={link} limit={3} />
			</a>
		</div>
	);
}
