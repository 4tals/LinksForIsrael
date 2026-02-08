"use client";

import React from "react";

import { Link } from "@chakra-ui/next-js";

export const HelpUsButton = (): JSX.Element => {
	return (
		<Link
			href="https://github.com/4tals/LinksForIsrael/blob/main/docs/contribute.md"
			isExternal
			sx={{
				fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
				fontSize: { base: "xs", md: "sm" },
				fontWeight: "500",
				letterSpacing: "0.5px",
				color: "whiteAlpha.900",
				bg: "transparent",
				border: "1px solid",
				borderColor: "whiteAlpha.300",
				borderRadius: "full",
				px: { base: 4, md: 5 },
				py: { base: 2, md: 2 },
				textDecoration: "none",
				transition: "all 0.3s ease",
				_hover: {
					bg: "whiteAlpha.100",
					borderColor: "whiteAlpha.500",
					transform: "translateY(-1px)",
					textDecoration: "none",
				},
				_focus: {
					outline: "none",
					boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
				},
			}}
		>
			{"<"} Contribute {"/>"}
		</Link>
	);
};
