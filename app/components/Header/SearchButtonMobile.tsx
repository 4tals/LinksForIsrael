"use client";

import { useState } from "react";

import { Category } from "@/app/utils/categories";
import { Root as PortalRoot } from "@radix-ui/react-portal";

import styles from "./SearchForm.module.css";
import { SearchResults } from "./SearchResults";
import { useSearch } from "./useSearch";

export function SearchButtonMobile({ categories }: { categories: Category[] }) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	return (
		<>
			<button
				className="mobile-search-button"
				type="button"
				onClick={() => setIsSearchOpen((value) => !value)}
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

			{isSearchOpen && (
				<SearchForm
					categories={categories}
					close={() => setIsSearchOpen(false)}
				/>
			)}
		</>
	);
}

function SearchForm({
	categories,
	close,
}: {
	categories: Category[];
	close: () => void;
}) {
	const { search, onSearch, results } = useSearch(categories);
	return (
		<PortalRoot>
			<div className={styles.searchOverlay}>
				<div className="search-div" id="searchDiv">
					<div className="search-wrapper">
						<svg
							className="mobile-search-icon"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M6.19348 6.0194C8.88602 3.32687 13.2515 3.32687 15.944 6.0194C18.4395 8.51489 18.6221 12.4474 16.4919 15.1532L19.9998 18.6611L18.9391 19.7218L15.4425 16.2251C12.7341 18.4528 8.72461 18.3011 6.19348 15.77C3.50094 13.0774 3.50094 8.71194 6.19348 6.0194ZM14.8834 7.08007C12.7766 4.97331 9.36089 4.97331 7.25414 7.08007C5.14738 9.18682 5.14738 12.6025 7.25414 14.7093C9.36089 16.816 12.7766 16.816 14.8834 14.7093C16.9901 12.6025 16.9901 9.18682 14.8834 7.08007Z"
								fill="#71717A"
							/>
						</svg>

						<input
							className="search-input"
							type="text"
							name="query"
							placeholder="איך אתם רוצים לעזור?"
							value={search}
							onChange={(e) => onSearch(e.target.value)}
							autoFocus
							ref={(input) => input && input.focus()}
						/>
					</div>
				</div>
				<SearchResults results={results} close={close} />
			</div>
		</PortalRoot>
	);
}
