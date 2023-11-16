"use client";

import { Fragment, ReactNode, useState } from "react";

import { DialogModal } from "../components/DialogModal/DialogModal";
import { Link, SubCategoryData } from "../utils/categories";
import { ShareButtons } from "./ShareButtons";
import { Tooltip } from "./Tooltip";

const containsHebrewLetters = (str: string) => {
	// https://jcuenod.github.io/bibletech/2017/08/19/matching-hebrew-unicode-regex/
	return /[\u0590-\u05EA]/.test(str);
};

export function CategoryContent({
	categoryName,
	subCategories,
	categoryDescription,
}: {
	categoryName?: string;
	subCategories: Array<SubCategoryData>;
	categoryDescription?: string;
}) {
	const [openDialog, setOpenDialog] = useState(false);
	const [description, setDescription] = useState<{
		body: ReactNode;
		link: Link;
	} | null>(null);
	return (
		<>
			<DialogModal
				title={description?.link.displayName || ""}
				body={description?.body}
				open={openDialog}
				toggleModal={setOpenDialog}
				isRtl={containsHebrewLetters(
					`${description?.link.displayName}${description?.link?.description}`,
				)}
			/>
			{categoryName && categoryDescription ? (
				<div className="share-container">
					<div className="category-description">{categoryDescription}</div>
					<ShareButtons category={categoryName} />
				</div>
			) : null}
			<ul className="links-section-list">
				{subCategories.map((subcategory) => (
					<Fragment key={subcategory.name}>
						{
							<h3 key={subcategory.name} className="links-subcategory-header">
								{subcategory.displayName}
								<LinksList
									links={subcategory.links}
									name={subcategory.name}
									setDescription={setDescription}
									setOpenDialog={setOpenDialog}
								/>
							</h3>
						}
					</Fragment>
				))}
			</ul>
		</>
	);
}

function LinksList({
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

function LinkItem({
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
		<li
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
				>
					{/* <img
							className="link-initiative-icon"
							src={link.initiativeImage}
							alt="Initiative Image"
						/> */}
				</div>
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
		</li>
	);
}

const ICONS = {
	whatsapp: {
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/598px-WhatsApp_icon.png",
		alt: "WhatsApp Link",
	},
	facebook: {
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Facebook_icon.svg/2048px-Facebook_icon.svg.png",
		alt: "Facebook Link",
	},
	telegram: {
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png",
		alt: "Telegram Link",
	},
	drive: {
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png",
		alt: "Google Drive Link",
	},
	forms: {
		src: "https://cdn-icons-png.flaticon.com/512/5968/5968528.png",
		alt: "Google Forms Link",
	},
	docs: {
		src: "https://cdn4.iconfinder.com/data/icons/free-colorful-icons/360/google_docs.png",
		alt: "Google Docs Link",
	},
	website: {
		src: "https://cdn-icons-png.flaticon.com/512/6472/6472018.png",
		alt: "Website Link",
	},
	discord: {
		src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiDCYwuxNrkxd_oOUGb0RxYQ5RH_aFzXlxmlgb_183&s",
		alt: "Discord Link",
	},
	instagram: {
		src: "/images/instagram_icon.png",
		alt: "Instagram Link",
	},
	tiktok: {
		src: "https://static.vecteezy.com/system/resources/previews/023/986/921/original/tiktok-logo-tiktok-logo-transparent-tiktok-icon-transparent-free-free-png.png",
		alt: "Tiktok Link",
	},
	twitter: {
		src: "https://cdn-icons-png.flaticon.com/512/124/124021.png",
		alt: "Twitter Link",
	},
	linkedin: {
		src: "https://upload.wikimedia.org/wikipedia/commons/9/90/Wbseries_linkdin.png",
		alt: "LinkedIn Link",
	},
	portal: {
		src: "https://res.cloudinary.com/dargbitr2/image/upload/v1697228919/LinksForIsrael/r5ysb355egkpyd10jovq.jpg",
		alt: "Portal Link",
	},
	youtube: {
		src: "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/395_Youtube_logo-512.png",
		alt: "YouTube Link",
	},
	donation: {
		src: "https://cdn0.iconfinder.com/data/icons/colorful-guache-social-media-logos-1/159/social-media_donate-512.png",
		alt: "Donation Link",
	},
};

const ICONS_KEYS = Object.keys(ICONS);

const LinkIcons = ({ link, limit }: { link: Link | any; limit?: number }) => {
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
