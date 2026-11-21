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
				fontWeight: "600",
				letterSpacing: "0.3px",
				color: "brand.600",
				bg: "brand.50",
				border: "1px solid",
				borderColor: "brand.200",
				borderRadius: "full",
				px: { base: 4, md: 5 },
				py: 2,
				textDecoration: "none",
				transition: "all 0.2s ease",
				_hover: {
					bg: "brand.600",
					color: "white",
					borderColor: "brand.600",
					transform: "translateY(-1px)",
					textDecoration: "none",
				},
				_focus: {
					outline: "none",
					boxShadow: "0 0 0 3px rgba(29, 92, 214, 0.25)",
				},
			}}
		>
			{"<"} כניסה למפתחים {"/>"}
		</Link>
	);
};
