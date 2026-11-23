"use client";

import { useEffect, useState } from "react";

import { getUrlParams, updateUrlParams } from "@/app/utils/urlState";

import styles from "./docs.module.scss";

/** Guide body; shows the English translation on ?lang=en when one exists. */
export function DocArticle({
	html,
	englishHtml,
}: {
	html: string;
	englishHtml?: string;
}) {
	const [english, setEnglish] = useState(false);

	useEffect(() => {
		setEnglish(Boolean(englishHtml) && getUrlParams().get("lang") === "en");
	}, [englishHtml]);

	const toggleLanguage = () => {
		updateUrlParams({ lang: english ? null : "en" });
		setEnglish(!english);
	};

	return (
		<>
			{englishHtml && (
				<button
					type="button"
					onClick={toggleLanguage}
					className={styles.languageToggle}
					lang={english ? "he" : "en"}
				>
					{english ? "עברית" : "English"}
				</button>
			)}
			<article
				className={styles.docs}
				lang={english ? "en" : "he"}
				dir={english ? "ltr" : "rtl"}
				dangerouslySetInnerHTML={{
					__html: english && englishHtml ? englishHtml : html,
				}}
			/>
		</>
	);
}
