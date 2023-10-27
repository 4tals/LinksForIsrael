"use client";

import { ReactNode, useEffect, useRef } from "react";

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
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (body && !open) {
			toggleModal(true);
		}
	}, [body]);

	const closeDialog = () => {
		dialogRef.current?.close();
	};

	const openDialog = () => {
		dialogRef.current?.showModal();
	};

	open && body ? openDialog() : closeDialog();

	return (
		<dialog id="dialogBox" className="dialogBox" ref={dialogRef}>
			<header>
				<h2 className="header">{title}</h2>
				<button onClick={closeDialog} id="closeDialogHeader">
					X
				</button>
			</header>

			<section className="dialogContent">{body}</section>

			<footer>
				<button onClick={closeDialog} className="closeButton">
					סגור
				</button>
			</footer>
		</dialog>
	);
}
