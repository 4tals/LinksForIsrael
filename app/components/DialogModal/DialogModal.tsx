"use client";

import { ReactNode, useEffect, useState } from "react";

import styles from "../AddSite/AddSite.module.scss";
import "./dialogModal.scss";

type DialogModalProps = {
	title: string;
	body: ReactNode;
	open?: boolean;
	toggleModal: (open: boolean) => void;
};

export function DialogModal({
	title,
	body,
	open,
	toggleModal,
}: DialogModalProps) {
	return (
		open &&
		body && (
			<div className="dialogContainer">
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
