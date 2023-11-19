import React from "react";

import { Logo } from "@/app/components/Logo";

export const NoResultsZeroState = () => {
	return (
		<div className="zero-state-wrapper">
			<div className="logo">
				<Logo opacity={0.2} />
			</div>
			<div className="text">
				<span className="larger">לא נמצאו תוצאות מתאימות</span>
			</div>
		</div>
	);
};
