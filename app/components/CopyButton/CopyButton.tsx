"use client";

import { ComponentProps, PropsWithChildren, useRef } from "react";

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./CopyButton.module.css";
import { useCopy } from "./useCopy";

export interface Props {
	copyText: string;
	fadeDelay?: number;
	displayText?: string;
	className?: string;
	indicatorPosition?: "left" | "right";
}

export function CopyButton({
	copyText,
	fadeDelay = 1000,
	displayText = "copied",
	className,
	children,
	indicatorPosition = "right",
	...rest
}: PropsWithChildren<Props>) {
	const myRef = useRef(null);
	const { handleCopy, copiedSuccessfully } = useCopy(copyText, fadeDelay);

	function copiedIndicator() {
		return (
			<span
				className={[
					copiedSuccessfully && styles.fadeOut,
					styles.copyButtonIcon,
					"mx-1 absolute inset-0",
				]
					.filter(Boolean)
					.join(" ")}
			>
				<FontAwesomeIcon icon={faCheck} />
			</span>
		);
	}

	return (
		<div className="relative inline-block">
			{copiedIndicator()}
			<button
				ref={myRef}
				{...rest}
				className={[className, "relative", copiedSuccessfully && "opacity-0"]
					.filter(Boolean)
					.join(" ")}
				onClick={handleCopy}
				type="button"
				disabled={!copyText}
			>
				{children}
			</button>
		</div>
	);
}
