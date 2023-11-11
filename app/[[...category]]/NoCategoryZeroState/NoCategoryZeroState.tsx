import React from "react";

import { Logo } from "@/app/components/Logo";

import "./noCategoryZeroState.scss";

export const NoCategoryZeroState = () => {
	return (
		<div className="welcome-message-container">
			<p>ברוכים הבאים לפורטל לינק לישראל</p>
			<p>מרכזים מגוון יוזמות בתחומים שונים!</p>
			<p>בתפריט מימין תוכלו לבחור את הקטגוריה הרלוונטית עבורכם</p>
			<p>ביחד ננצח!</p>
		</div>
	);
};
