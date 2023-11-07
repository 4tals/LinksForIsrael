import { HelpUsButton } from "./HelpUsButton";

export function Footer() {
	return (
		<footer className="footer">
			<div className="social-links">
				<a
					href="https://www.instagram.com/links_for_israel/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src="/images/instagram_icon.png"
						alt="Instagram"
						width="32"
						height="32"
					/>
				</a>
				<a
					href="https://www.facebook.com/LinksForIsrael/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/1024px-2021_Facebook_icon.svg.png?20220821121039"
						alt="Facebook"
						width="32"
						height="32"
					/>
				</a>
				<a
					href="https://github.com/4tals/LinksForIsrael/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
						alt="GitHub"
						width="32"
						height="32"
					/>
				</a>
				<a
					href="https://twitter.com/linksforisrael"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"
						alt="Twitter"
						width="32"
						height="32"
					/>
				</a>
				<a
					href="https://www.linkedin.com/company/links-for-israel/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src="https://upload.wikimedia.org/wikipedia/commons/9/90/Wbseries_linkdin.png"
						alt="Linkedin"
						width="32"
						height="32"
					/>
				</a>
				<HelpUsButton />
			</div>
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
						width="40px"
					/>
				</a>
			</div>
		</footer>
	);
}
