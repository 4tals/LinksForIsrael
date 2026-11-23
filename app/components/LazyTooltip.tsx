"use client";

import { cloneElement, PointerEvent, ReactElement, useState } from "react";

import { Tooltip as ChakraTooltip, TooltipProps } from "@chakra-ui/react";

/**
 * Drop-in Tooltip for long lists: Chakra's Tooltip is costly to hydrate,
 * so it is only mounted once the mouse first reaches the element.
 */
export function Tooltip({ children, ...props }: TooltipProps) {
	const [hovered, setHovered] = useState(false);

	if (hovered) {
		return (
			<ChakraTooltip defaultIsOpen {...props}>
				{children}
			</ChakraTooltip>
		);
	}

	return cloneElement(children as ReactElement, {
		onPointerEnter: (event: PointerEvent) => {
			if (event.pointerType === "mouse") setHovered(true);
		},
	});
}
