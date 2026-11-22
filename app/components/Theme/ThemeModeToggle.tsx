"use client";

import React, { useEffect, useState } from "react";
import { FaAdjust, FaMoon, FaSun } from "react-icons/fa";

import { IconButton, Tooltip } from "@chakra-ui/react";

type VisualMode = "light" | "dark" | "contrast";

const STORAGE_KEY = "linksforisrael_visual_mode";

function applyVisualMode(mode: VisualMode) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	if (mode === "light") {
		root.removeAttribute("data-visual-mode");
	} else {
		root.setAttribute("data-visual-mode", mode);
	}
}

export function ThemeModeToggle() {
	const [mode, setMode] = useState<VisualMode>("light");

	useEffect(() => {
		try {
			const saved = window.localStorage.getItem(
				STORAGE_KEY,
			) as VisualMode | null;
			if (saved === "dark" || saved === "contrast" || saved === "light") {
				setMode(saved);
				applyVisualMode(saved);
			}
		} catch {
			// Ignore storage errors
		}
	}, []);

	const cycleMode = () => {
		const next: VisualMode =
			mode === "light" ? "dark" : mode === "dark" ? "contrast" : "light";
		setMode(next);
		applyVisualMode(next);
		try {
			window.localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// Ignore
		}
	};

	const label =
		mode === "light"
			? "מצב כהה (לחיצה להחלפה)"
			: mode === "dark"
				? "מצב ניגודיות גבוהה (נגישות)"
				: "חזרה למצב רגיל";

	const icon =
		mode === "light" ? (
			<FaMoon size={14} />
		) : mode === "dark" ? (
			<FaAdjust size={14} />
		) : (
			<FaSun size={14} />
		);

	return (
		<Tooltip label={label} hasArrow>
			<IconButton
				aria-label={label}
				icon={icon}
				size={{ base: "sm", md: "md" }}
				variant="ghost"
				color="white"
				borderRadius="full"
				_hover={{ bg: "whiteAlpha.200" }}
				onClick={cycleMode}
			/>
		</Tooltip>
	);
}
