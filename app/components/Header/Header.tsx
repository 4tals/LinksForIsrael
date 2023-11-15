import { Banner } from "@/app/components/Header/Banner";

import { AddSite } from "../AddSite";
import { SearchButtonMobile } from "./SearchButtonMobile";
import { SearchFormWeb } from "./SearchFormWeb";

export function Header() {
	return (
		<header className="page-header" role="banner" dir="rtl">
			<div className="left-section">
				<Banner />
			</div>
			<div className="middle-section">
				<SearchFormWeb />
			</div>
			<div className="right-section">
				<AddSite />
				<SearchButtonMobile />
			</div>
		</header>
	);
}
