import { HelpUsButton } from "./HelpUsButton";

const socialLinks = [
	{
		href: "https://www.instagram.com/links_for_israel/",
		imgSrc: "/images/instagram_icon.png",
		alt: "Instagram",
	},
	{
		href: "https://www.facebook.com/LinksForIsrael/",
		imgSrc:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/1024px-2021_Facebook_icon.svg.png",
		alt: "Facebook",
	},
	{
		href: "https://github.com/4tals/LinksForIsrael/",
		imgSrc: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
		alt: "GitHub",
	},
	{
		href: "https://twitter.com/linksforisrael",
		imgSrc:
			"https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg",
		alt: "Twitter",
	},
	{
		href: "https://www.linkedin.com/company/links-for-israel/",
		imgSrc:
			"https://upload.wikimedia.org/wikipedia/commons/9/90/Wbseries_linkdin.png",
		alt: "Linkedin",
	},
];

export function Footer() {
	return (
		<footer className="footer">
			<div className="quote-link flex flex-row items-center justify-center">
				<div className="invite-text">&quot;הופכים עליהם, טובים אותם&quot;</div>
				<a
					href="https://twitter.com/kann/status/1712897481837539810?t=kxXrXgX59tp1yPnrYiS4Iw&s=19"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src="/images/reverse.png"
						alt="Initiative Icon"
						className="footer-icon"
						width="40"
					/>
				</a>
			</div>
			<div className="social-links">
				<HelpUsButton />
				{socialLinks.map((link) => (
					<a
						key={link.href}
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src={link.imgSrc} alt={link.alt} width="15" height="15" />
					</a>
				))}
			</div>
		</footer>
	);
}
