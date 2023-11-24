import React from "react";

import "./helpUsButton.scss";

const text = "< כניסה למפתחים >";
export const HelpUsButton = (): JSX.Element => {
	return (
		<a
			className="contribute-button"
			href="https://github.com/4tals/LinksForIsrael/blob/main/docs/contribute.md"
			target="_blank"
			rel="noopener noreferrer"
		>
			{text}
		</a>
	);
};
