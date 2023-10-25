import { Fragment } from "react";

import { Link, SubCategoryData } from "../utils/categories";
import { ShareButtons } from "./ShareButtons";

export function CategoryContent({
	categoryName,
	subCategories,
}: {
	categoryName: string;
	subCategories: Array<SubCategoryData>;
}) {
	return (
		<>
			<div className="share-container">
				<span className="me-3">
					ניתן לשתף ישירות את &quot;<b>{categoryName}</b>&quot; באמצעות
				</span>
				<ShareButtons category={categoryName} />
			</div>
			<ul className="links-section-list pr-10">
				{subCategories.map((subcategory) => (
					<Fragment key={subcategory.name}>
						{subcategory.name !== "Main" && (
							<h3
								className="links-section-subcategory text-xl mb-4"
								key={subcategory.name}
							>
								{subcategory.displayName}
								<LinksList links={subcategory.links} name={subcategory.name} />
							</h3>
						)}
					</Fragment>
				))}
			</ul>
		</>
	);
}

function LinksList({ name, links }: { name: string; links: Array<Link> }) {
	const numLinks = links.length;
	if (numLinks === 0) {
		return <p key={name}>בקרוב</p>;
	}

	return links.map((link) => <LinkItem link={link} key={link.name} />);
}

function LinkItem({ link }: { link: Link }) {
	return (
		<li className="links-section-item" key={link.name}>
			<a
				href={link.url}
				target={link.url?.startsWith(".") ? "" : "_blank"}
				rel="noopener noreferrer"
				id={link.name}
				className="links-section-item-title"
			>
				{link.displayName}
				{link.shortDescription !== "" && (
					<>
						<br />
						<span className="links-section-item-short-description">
							{link.shortDescription}
						</span>
					</>
				)}
			</a>
			<div className="link-icons">
				{link.whatsapp && (
					<a href={link.whatsapp} target="_blank">
						<img
							className="link-icon"
							src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/598px-WhatsApp_icon.png"
							alt="WhatsApp Link"
						/>
					</a>
				)}
				{link.telegram && (
					<a href={link.telegram} target="_blank">
						<img
							className="link-icon"
							src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png"
							alt="Telegram Link"
						/>
					</a>
				)}
				{link.drive && (
					<a href={link.drive} target="_blank">
						<img
							className="link-icon"
							src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png"
							alt="Google Drive Link"
						/>
					</a>
				)}
				{link.forms && (
					<a href={link.forms} target="_blank">
						<img
							className="link-icon"
							src="https://cdn-icons-png.flaticon.com/512/5968/5968528.png"
							alt="Google Forms Link"
						/>
					</a>
				)}
				{link.docs && (
					<a href={link.docs} target="_blank">
						<img
							className="link-icon"
							src="https://cdn4.iconfinder.com/data/icons/free-colorful-icons/360/google_docs.png"
							alt="Google Docs Link"
						/>
					</a>
				)}
				{link.website && (
					<a href={link.website} target="_blank">
						<img
							className="link-icon"
							src="https://cdn-icons-png.flaticon.com/512/5602/5602732.png"
							alt="Website Link"
						/>
					</a>
				)}
				{link.discord && (
					<a href={link.discord} target="_blank">
						<img
							className="link-icon"
							src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiDCYwuxNrkxd_oOUGb0RxYQ5RH_aFzXlxmlgb_183&s"
							alt="Discord Link"
						/>
					</a>
				)}
				{link.instagram && (
					<a href={link.instagram} target="_blank">
						<img
							className="link-icon"
							src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
							alt="Instagram Link"
						/>
					</a>
				)}
				{link.tiktok && (
					<a href={link.tiktok} target="_blank">
						<img
							className="link-icon"
							src="https://static.vecteezy.com/system/resources/previews/023/986/921/original/tiktok-logo-tiktok-logo-transparent-tiktok-icon-transparent-free-free-png.png"
							alt="Tiktok Link"
						/>
					</a>
				)}
				{link.twitter && (
					<a href={link.twitter} target="_blank">
						<img
							className="link-icon"
							src="https://cdn-icons-png.flaticon.com/512/124/124021.png"
							alt="Twitter Link"
						/>
					</a>
				)}
				{link.portal && (
					<a href={link.portal} target="_blank">
						<img
							className="link-icon"
							src="https://res.cloudinary.com/dargbitr2/image/upload/v1697228919/LinksForIsrael/r5ysb355egkpyd10jovq.jpg"
							alt="Portal Link"
						/>
					</a>
				)}
			</div>
			{link.description !== "" && <p>{link.description}</p>}
		</li>
	);
}
