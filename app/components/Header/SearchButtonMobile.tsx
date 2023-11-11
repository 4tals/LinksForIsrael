"use client";

import { useContext } from "react";

import { SearchContext } from "@/app/components/RootApp";

export function SearchButtonMobile() {
	const { toggleMobileSearch } = useContext(SearchContext);
	return (
		<>
			<button
				className="mobile-search-button"
				type="button"
				onClick={toggleMobileSearch}
			>
				<svg
					width="23"
					height="23"
					viewBox="0 0 23 23"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 10.192C0 4.5635 4.561 0 10.1875 0C15.814 0 20.3745 4.5635 20.3745 10.192C20.3745 12.1775 19.807 14.031 18.825 15.598C18.9735 15.722 19.1215 15.8445 19.2695 15.967L19.275 15.972C20.092 16.6495 20.903 17.322 21.704 18.065C22.6655 18.9565 22.7985 20.3435 21.864 21.31C21.6828 21.4976 21.4984 21.6821 21.311 21.8635C20.345 22.7985 18.9585 22.666 18.0675 21.7035C17.3255 20.902 16.653 20.0905 15.976 19.273L15.973 19.269L15.972 19.268L15.605 18.8255C13.9829 19.8469 12.1044 20.3875 10.1875 20.3845C4.561 20.3845 0 15.821 0 10.192ZM10.25 16.75C13.84 16.75 16.75 13.84 16.75 10.25C16.75 6.66 13.84 3.75 10.25 3.75C6.66 3.75 3.75 6.66 3.75 10.25C3.75 13.84 6.66 16.75 10.25 16.75Z"
						fill="white"
					/>
				</svg>
			</button>
		</>
	);
}
