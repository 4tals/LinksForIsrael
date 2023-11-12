"use client";

import { useLayoutEffect, useState } from "react";

import { debounce } from "@/app/utils/debounce";

const mobileMaxWidth = 767;

const isMobileWidth = () => {
	if (typeof window === "undefined") {
		return true;
	}
	return window.innerWidth <= mobileMaxWidth;
};

export const useIsMobile = (): boolean => {
	const [isMobile, setIsMobile] = useState(isMobileWidth());

	useLayoutEffect(() => {
		const updateSize = (): void => {
			setIsMobile(isMobileWidth());
		};
		window.addEventListener("resize", debounce(updateSize, 500));
		return (): void => window.removeEventListener("resize", updateSize);
	}, []);

	return isMobile;
};
