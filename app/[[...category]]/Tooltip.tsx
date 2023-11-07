import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

export const Tooltip = ({ content }: { content: string }) => {
	const [visible, setVisible] = useState(false);
	// Define the type for the ref to be an HTMLDivElement or null
	const tooltipRef = useRef<HTMLDivElement>(null);
	const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

	useEffect(() => {
		// Now TypeScript knows getBoundingClientRect exists on the current property
		if (tooltipRef.current) {
			const rect = tooltipRef.current.getBoundingClientRect();
			setTooltipPosition({
				top: rect.bottom + window.scrollY,
				left: rect.left + rect.width / 2 + window.scrollX,
			});
		}
	}, [visible]);

	const message = "✓ אומת על ידי צוות לינק לישראל";

	const createPortal = () => {
		if (!visible || !tooltipRef.current) {
			return null;
		}

		const tooltipStyle: React.CSSProperties = {
			position: "absolute", // TypeScript should recognize this as a valid value
			backgroundColor: "black",
			color: "white",
			textAlign: "center",
			borderRadius: "3px",
			padding: "5px 14px",
			zIndex: 1000,
			top: `${tooltipPosition.top}px`,
			left: `${tooltipPosition.left}px`,
			transform: "translateX(-50%) translateY(-100%)",
			whiteSpace: "nowrap",
			fontSize: "0.8rem",
		};

		const tooltipElement = <div style={tooltipStyle}>{message}</div>;

		return ReactDOM.createPortal(tooltipElement, document.body);
	};

	return (
		<div
			style={{ position: "relative", display: "inline-block" }}
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
			ref={tooltipRef}
		>
			<img
				className="link-icon checkmark-icon"
				src="https://cdn2.iconfinder.com/data/icons/greenline/512/check-512.png"
				alt="Validated Initiative"
			/>
			{createPortal()}
		</div>
	);
};
