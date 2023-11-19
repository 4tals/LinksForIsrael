"use client";

import { ReactNode } from "react";

import "./dialogModal.scss";

type DialogModalProps = {
	title: string;
	body: ReactNode;
	open?: boolean;
	toggleModal: (open: boolean) => void;
	isRtl?: boolean;
};

export function DialogModal({
	title,
	body,
	open,
	toggleModal,
	isRtl,
}: DialogModalProps) {
	return (
		open &&
		body && (
			<div className={`dialogContainer ${!isRtl ? "ltr" : ""}`}>
				<div
					className="modalBackdrop"
					onClick={() => {
						toggleModal(false);
					}}
				></div>
				<div id="dialogBox" className="dialogBox">
					<header>
						<h2 className="header">{title}</h2>
						<button
							onClick={() => {
								toggleModal(false);
							}}
							id="closeDialogHeader"
						>
							×
						</button>
					</header>
					<section className="dialogContent">{body}</section>
				</div>
			</div>
		)
	);
}
