"use client";

import { ReactNode } from "react";

import { Link } from "../utils/categories";
import { LinkItem } from "./LinkItem";

export function LinksList({
	name,
	links,
	setDescription,
	setOpenDialog,
}: {
	name: string;
	links: Array<Link>;
	setDescription: (description: { body: ReactNode; link: Link } | null) => void;
	setOpenDialog: (open: boolean) => void;
}) {
	const numLinks = links.length;
	if (numLinks === 0) {
		return <p key={name}>בקרוב</p>;
	}

	return (
		<div className="links-section-subcategory">
			{links.map((link) => (
				<LinkItem
					link={link}
					key={link.name}
					setDescription={setDescription}
					setOpenDialog={setOpenDialog}
				/>
			))}
		</div>
	);
}
