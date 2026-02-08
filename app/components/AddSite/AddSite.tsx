"use client";

import { useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { SearchContext } from "@/app/components/RootApp";

import styles from "./AddSite.module.scss";

export function AddSite() {
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [mounted, setMounted] = useState(false);
	const { isMobileSearchOpen, toggleMobileSearch } = useContext(SearchContext);

	useEffect(() => {
		setMounted(true);
	}, []);

	const modal = isFormVisible && (
		<div className={styles.addSiteForm}>
			<div
				className={styles.formContainerBackdrop}
				onClick={() => setIsFormVisible(false)}
			/>
			<div className={styles.formContainer}>
				<iframe
					src="https://docs.google.com/forms/d/e/1FAIpQLSco2RfeIn1glCPqC2JoPtN-lfmdmxu6HPy7JjHnt66ktk8SAw/viewform?embedded=true"
					title="Add Initiative Form"
				>
					Loading…
				</iframe>
				<button
					className={styles.closeFormButton}
					type="button"
					onClick={() => setIsFormVisible(false)}
				>
					סגור את הטופס
				</button>
				<button
					className={styles.closeFormXButton}
					onClick={() => setIsFormVisible(false)}
				>
					✕
				</button>
			</div>
		</div>
	);

	return (
		<>
			<footer className={styles.addSiteFooter}>
				<button
					className={styles.addSiteButton}
					type="button"
					onClick={() => {
						setIsFormVisible(true);
						isMobileSearchOpen && toggleMobileSearch();
					}}
				>
					הוסיפו יוזמה +
				</button>
			</footer>
			{mounted && modal && createPortal(modal, document.body)}
		</>
	);
}
