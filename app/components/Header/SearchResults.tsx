import Link from "next/link";

import { Result } from "./useSearch";

export function SearchResults({
	results,
	close,
}: {
	results: Array<Result>;
	close: () => void;
}) {
	if (!results.length) {
		return null;
	}

	return (
		<div className="search-results-div md:w-2/5 md:h-4/5 mx-auto my-8">
			<div className="search-results-wrapper py-2 md:w-full overflow-hidden flex flex-col">
				<h3 className="font-bold text-lg mb-2">תוצאות מומלצות</h3>
				<ul id="search-results" className="overflow-y-scroll">
					{results.map((item) => (
						<li key={item.name}>
							<div className="searchResultItem">
								<span className="searchResultTitle">
									{item.displayName || item.shortDescription}
								</span>
								<div className="searchResultLinks">
									<a href={item.url} target="_blank" rel="noopener noreferrer">
										קח אותי ליוזמה
									</a>{" "}
									/{" "}
									<Link
										href={`/${item.category}/${item.subCategory}/${item.name}`}
										onClick={() => close()}
									>
										עוד מידע
									</Link>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
