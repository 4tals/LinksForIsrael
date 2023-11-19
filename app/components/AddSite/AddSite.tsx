"use client";

import { useContext, useState } from "react";

import { SearchContext } from "@/app/components/RootApp";

import styles from "./AddSite.module.scss";

export function AddSite() {
	const [isFormVisible, setIsFormVisible] = useState(false);
	const { isMobileSearchOpen, toggleMobileSearch } = useContext(SearchContext);
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
				{isFormVisible && (
					<div className={styles.addSiteForm}>
						<div
							className={styles.formContainerBackdrop}
							onClick={() => setIsFormVisible(false)}
						/>
						<div className={styles.formContainer}>
							<iframe
								src="https://docs.google.com/forms/d/e/1FAIpQLSco2RfeIn1glCPqC2JoPtN-lfmdmxu6HPy7JjHnt66ktk8SAw/viewform?embedded=true"
								width="300"
								height="520"
								frameBorder={0}
								marginHeight={0}
								marginWidth={0}
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
				)}
			</footer>
		</>
	);
}
