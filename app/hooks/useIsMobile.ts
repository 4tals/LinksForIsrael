"use client";

import { useEffect, useState } from "react";

import { debounce } from "@/app/utils/debounce";

const MOBILE_MAX_WIDTH = 767;

export const useIsMobile = (): boolean => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const updateSize = (): void => {
			setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH);
		};

		updateSize();
		const debouncedUpdateSize = debounce(updateSize, 200);
		window.addEventListener("resize", debouncedUpdateSize);
		return (): void => {
			window.removeEventListener("resize", debouncedUpdateSize);
		};
	}, []);

	return isMobile;
};
