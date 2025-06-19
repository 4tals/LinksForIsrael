"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
	return element
		? {
				isScrollableLeft:
					element.scrollLeft - 1 > element.clientWidth - element.scrollWidth,
				isScrollableRight: element.scrollLeft < 0,
			}
		: initialScrollProps;
};

const withScroll = (WrappedComponent: React.ComponentType<any>) => {
	const ComponentWithScroll = (props: any) => {
		const scrollableDivRef = useRef<HTMLDivElement | null>(null);
		const leftButtonRef = useRef<HTMLButtonElement | null>(null);
		const rightButtonRef = useRef<HTMLButtonElement | null>(null);
		const [scrollableProps, setScrollableProps] = useState(initialScrollProps);

		useEffect(() => {
			if (!scrollableDivRef) return;
			setScrollableProps(getScrollableProps(scrollableDivRef.current));
		}, [scrollableDivRef]);

		useLayoutEffect(() => {
			if (
				!scrollableDivRef.current ||
				!leftButtonRef.current ||
				!rightButtonRef.current
			)
				return;
			const scrollableDiv = scrollableDivRef.current;
			const leftButton = leftButtonRef.current;
			const rightButton = rightButtonRef.current;
			let interval: NodeJS.Timeout;
			const updateScrollProps = (): void => {
				setScrollableProps(getScrollableProps(scrollableDivRef.current));
			};

			const pxToScroll = 350;
			const millisecondsToScroll = 100;

			const scrollLeft = (): void => {
				interval = setInterval(() => {
					scrollableDiv.scrollLeft -= pxToScroll;
				}, millisecondsToScroll);
			};
			const scrollRight = (): void => {
				interval = setInterval(() => {
					scrollableDiv.scrollLeft += pxToScroll;
				}, millisecondsToScroll);
			};
			const stopScroll = (): void => {
				clearInterval(interval);
			};
			scrollableDiv.addEventListener("scroll", debounce(updateScrollProps, 20));
			leftButton.addEventListener("mousedown", scrollLeft);
			leftButton.addEventListener("touchstart", scrollLeft);
			leftButton.addEventListener("mouseup", stopScroll);
			leftButton.addEventListener("touchend", stopScroll);
			rightButton.addEventListener("mousedown", scrollRight);
			rightButton.addEventListener("touchstart", scrollRight);
			rightButton.addEventListener("mouseup", stopScroll);
			rightButton.addEventListener("touchend", stopScroll);
			return (): void => {
				scrollableDiv.removeEventListener("scroll", updateScrollProps);
				leftButton.removeEventListener("mousedown", scrollLeft);
				leftButton.removeEventListener("touchstart", scrollLeft);
				leftButton.removeEventListener("mouseup", stopScroll);
				leftButton.removeEventListener("touchend", stopScroll);
				rightButton.removeEventListener("mousedown", scrollRight);
				rightButton.removeEventListener("touchstart", scrollRight);
				rightButton.removeEventListener("mouseup", stopScroll);
				rightButton.removeEventListener("touchend", stopScroll);
			};
		}, []);

		return (
			<div className="scroll_wrapper">
				<button
					className={`chevron-button left ${
						scrollableProps.isScrollableLeft ? "show" : "hide"
					}`}
					ref={leftButtonRef}
				>
					<div className={`chevron left`} />
				</button>
				<div className="scroll_section" ref={scrollableDivRef}>
					<WrappedComponent {...props} />
				</div>
				<button
					className={`chevron-button right ${
						scrollableProps.isScrollableRight ? "show" : "hide"
					}`}
					ref={rightButtonRef}
				>
					<div className={`chevron right`} />
				</button>
			</div>
		);
	};
	return ComponentWithScroll;
};

export { withScroll };
