"use client";

import { useState } from "react";

import styles from "./AddSite.module.scss";

export function AddSite() {
	const [isFormVisible, setIsFormVisible] = useState(false);
	return (
		<>
			<footer className={styles.addSiteFooter}>
				<button
					className={styles.addSiteButton}
					type="button"
					onClick={() => setIsFormVisible(true)}
				>
					הוסיפו יוזמה +
				</button>
				{isFormVisible && (
					<div className={styles.addSiteForm}>
						<div
							className={styles.formContainerBackdrop}
							onClick={() => setIsFormVisible(false)}
						></div>
						<div className={styles.formContainer}>
							<iframe
								src="https://docs.google.com/forms/d/e/1FAIpQLSeZsW9WkleVF7-9Wtx6JKWTw9cInqJEpMocR54tZkwjAXPxRg/viewform?embedded=true"
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
