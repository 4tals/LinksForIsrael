import React from "react";

import { Logo } from "@/app/components/Logo";

import "./noCategoryZeroState.scss";

export const NoCategoryZeroState = () => {
	return (
		<div className="welcome-message-container">
			<div className="logo">
				<Logo opacity={0.2} />
			</div>
			<div className="intro">
				<span>ברוכים הבאים לפורטל לינק לישראל</span>
				<span>מרכזים מגוון יוזמות בתחומים שונים</span>
				<span>
					בתפריט למעלה תוכלו לבחור את הקטגוריה הרלוונטית עבורכם (ניתן לגלול ימין
					לשמאל)
				</span>
				<span className="larger">ביחד ננצח!</span>
			</div>
		</div>
	);
};
