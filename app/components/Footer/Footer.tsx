import { Flex, Box, Link, Image } from "@chakra-ui/react";

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
		<Box as="footer" className="footer">
			<Flex
				className="quote-link"
				align="center"
				justify="center"
				direction="row"
			>
				<Box className="invite-text">&quot;הופכים עליהם, טובים אותם&quot;</Box>
				<Link
					href="https://twitter.com/kann/status/1712897481837539810?t=kxXrXgX59tp1yPnrYiS4Iw&s=19"
					isExternal
				>
					<Image
						src="/images/reverse.png"
						alt="Initiative Icon"
						className="footer-icon"
						boxSize="40px"
					/>
				</Link>
			</Flex>
			<HelpUsButton />
			<Flex className="social-links">
				{socialLinks.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						isExternal
						mx={1} // margin for spacing between icons
					>
						<Image src={link.imgSrc} alt={link.alt} boxSize="25px" />
					</Link>
				))}
			</Flex>
		</Box>
	);
}
