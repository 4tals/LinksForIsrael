"use client";

import React, { useEffect, useRef, useState } from "react";

import { debounce } from "@/app/utils/debounce";

interface ScrollProps {
	isScrollableLeft: boolean;
	isScrollableRight: boolean;
}

const initialScrollProps: ScrollProps = {
	isScrollableLeft: false,
	isScrollableRight: false,
};

const getScrollableProps = (element: HTMLElement | null): ScrollProps => {
	if (!element) return initialScrollProps;
	const maxScroll = element.scrollWidth - element.clientWidth;
	if (maxScroll <= 2) return initialScrollProps;

	// In RTL containers, modern browsers use negative scrollLeft (0 at right edge, -maxScroll at left edge)
	const scrollLeft = element.scrollLeft;
	return {
		isScrollableLeft: scrollLeft > -(maxScroll - 2),
		isScrollableRight: scrollLeft < -2,
	};
};

function withScroll<P extends object>(
	WrappedComponent: React.ComponentType<P>,
) {
	const ComponentWithScroll = (props: P) => {
		const scrollableDivRef = useRef<HTMLDivElement | null>(null);
		const [scrollableProps, setScrollableProps] =
			useState<ScrollProps>(initialScrollProps);
		const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

		useEffect(() => {
			const scrollableDiv = scrollableDivRef.current;
			if (!scrollableDiv) return;

			const updateScrollProps = (): void => {
				setScrollableProps(getScrollableProps(scrollableDiv));
			};

			const debouncedUpdate = debounce(updateScrollProps, 25);
			updateScrollProps();

			scrollableDiv.addEventListener("scroll", debouncedUpdate, {
				passive: true,
			});

			const resizeObserver = new ResizeObserver(updateScrollProps);
			resizeObserver.observe(scrollableDiv);

			return () => {
				scrollableDiv.removeEventListener("scroll", debouncedUpdate);
				resizeObserver.disconnect();
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
			};
		}, []);

		const stopScroll = () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};

		const startScroll = (delta: number) => {
			const el = scrollableDivRef.current;
			if (!el) return;
			stopScroll();
			el.scrollBy({ left: delta, behavior: "smooth" });
			intervalRef.current = setInterval(() => {
				el.scrollBy({ left: delta, behavior: "smooth" });
			}, 220);
		};

		return (
			<div className="scroll_wrapper">
				<button
					type="button"
					aria-label="גלול שמאלה"
					className={`chevron-button left ${
						scrollableProps.isScrollableLeft ? "show" : "hide"
					}`}
					onMouseDown={() => startScroll(-280)}
					onMouseUp={stopScroll}
					onMouseLeave={stopScroll}
					onTouchStart={() => startScroll(-280)}
					onTouchEnd={stopScroll}
					onTouchCancel={stopScroll}
				>
					<div className="chevron left" />
				</button>
				<div className="scroll_section" ref={scrollableDivRef}>
					<WrappedComponent {...props} />
				</div>
				<button
					type="button"
					aria-label="גלול ימינה"
					className={`chevron-button right ${
						scrollableProps.isScrollableRight ? "show" : "hide"
					}`}
					onMouseDown={() => startScroll(280)}
					onMouseUp={stopScroll}
					onMouseLeave={stopScroll}
					onTouchStart={() => startScroll(280)}
					onTouchEnd={stopScroll}
					onTouchCancel={stopScroll}
				>
					<div className="chevron right" />
				</button>
			</div>
		);
	};

	ComponentWithScroll.displayName = `WithScroll(${
		WrappedComponent.displayName || WrappedComponent.name || "Component"
	})`;

	return ComponentWithScroll;
}

export { withScroll };
