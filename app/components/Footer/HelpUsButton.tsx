"use client";

import React from "react";

import { Link } from "@chakra-ui/next-js";

const displayText = "< כניסה למפתחים >";

export const HelpUsButton = (): JSX.Element => {
	return (
		<Link
			href="https://github.com/4tals/LinksForIsrael/blob/main/docs/contribute.md"
			isExternal
			sx={{
				fontFamily: "'Consolas', 'Monaco', 'Source Code Pro', monospace",
				backgroundColor: "#2196F3", // Standard blue color
				color: "white",
				padding: { base: "8px 18px", md: "12px 24px" },
				fontSize: { base: "xs", md: "sm", lg: "md" }, //bas Smaller font size on mobile (xs) and slightly larger on tablet and above (sm)
				border: "none",
				borderRadius: "8px",
				textDecoration: "none",
				boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
				transition: "transform 0.3s ease, background-color 0.3s ease",
				_hover: {
					backgroundColor: "#1E88E5",
					transform: "translateY(-2px)",
					boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
				},
				_focus: {
					outline: "none",
					boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
				},
			}}
		>
			{displayText}
		</Link>
	);
};
