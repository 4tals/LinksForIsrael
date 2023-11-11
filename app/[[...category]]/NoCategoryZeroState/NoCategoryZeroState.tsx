import React from "react";

import { Logo } from "@/app/components/Logo";

import "./noCategoryZeroState.scss";

export const NoCategoryZeroState = () => {
	return (
		<div className="welcome-message-container">
			<span>ברוכים הבאים לפורטל לינק לישראל</span>
			<span>מרכזים מגוון יוזמות בתחומים שונים!</span>
			<span>בתפריט מימין תוכלו לבחור את הקטגוריה הרלוונטית עבורכם</span>
			<span>ביחד ננצח!</span>
		</div>
	);
};
