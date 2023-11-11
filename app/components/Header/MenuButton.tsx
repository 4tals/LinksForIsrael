"use client";

import { useContext } from "react";

import { MenuContext, SearchContext } from "@/app/components/RootApp";

export function MenuButton() {
	const { toggleMenu } = useContext(MenuContext);
	const { isMobileSearchOpen, toggleMobileSearch } = useContext(SearchContext);
	return (
		<button
			onClick={() => {
				toggleMenu();
				isMobileSearchOpen && toggleMobileSearch();
			}}
		>
			<MenuBurgerSvg />
		</button>
	);
}

const MenuBurgerSvg = () => {
	return (
		<svg
			width="30px"
			height="30px"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="menu-burger-svg"
		>
			<g id="SVGRepo_bgCarrier" strokeWidth="0" />
			<g
				id="SVGRepo_tracerCarrier"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<g id="SVGRepo_iconCarrier">
				<g clipPath="url(#clip0_429_11066)">
					<path
						d="M3 6.00092H21M3 12.0009H21M3 18.0009H21"
						stroke="#ffffff"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</g>
				<defs>
					<clipPath id="clip0_429_11066">
						<rect
							width="24"
							height="24"
							fill="white"
							transform="translate(0 0.000915527)"
						></rect>
					</clipPath>
				</defs>
			</g>
		</svg>
	);
};
