"use client";

import React, { useContext, useEffect, useRef } from "react";

import { MenuContext, SearchContext } from "@/app/components/RootApp";
import { CloseIcon, Search2Icon } from "@chakra-ui/icons";
import {
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
} from "@chakra-ui/react";

interface SearchInputProps {
	id?: string;
	placeholder?: string;
	size?: "sm" | "md" | "lg";
	autoFocusOnMobileOpen?: boolean;
	enableShortcut?: boolean;
}

export function SearchInput({
	id = "searchInputWeb",
	placeholder = "חפשו יוזמה, מצב (למשל: חרדה, אוכל, מילואים)...",
	size = "md",
	autoFocusOnMobileOpen = false,
	enableShortcut = false,
}: SearchInputProps) {
	const { search, onSearch, isMobileSearchOpen } = useContext(SearchContext);
	const { isMenuOpen, toggleMenu } = useContext(MenuContext);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (autoFocusOnMobileOpen && isMobileSearchOpen) {
			inputRef.current?.focus();
		}
	}, [autoFocusOnMobileOpen, isMobileSearchOpen]);

	// Keyboard focus is handled globally by the Spotlight Command Palette in RootApp.tsx
	void enableShortcut;

	return (
		<InputGroup size={size} width="100%" maxW="520px">
			<InputRightElement pointerEvents="none" color="gray.500">
				<Search2Icon boxSize={4} />
			</InputRightElement>
			<Input
				ref={inputRef}
				id={id}
				name="query"
				type="search"
				placeholder={placeholder}
				autoComplete="off"
				value={search}
				onChange={(e) => {
					onSearch(e.target.value);
					if (isMobileSearchOpen && isMenuOpen) {
						toggleMenu();
					}
				}}
				bg="white"
				color="gray.800"
				borderRadius="full"
				border="1px solid"
				borderColor="gray.200"
				pr={10}
				pl={search ? 10 : 4}
				_placeholder={{ color: "gray.500" }}
				_hover={{ borderColor: "blue.300" }}
				_focusVisible={{
					borderColor: "brand.500",
					boxShadow: "0 0 0 2px rgba(29, 92, 214, 0.25)",
				}}
				aria-label="חיפוש יוזמות"
			/>
			{search && (
				<InputLeftElement>
					<IconButton
						aria-label="נקה חיפוש"
						icon={<CloseIcon boxSize={2.5} />}
						size="xs"
						variant="ghost"
						colorScheme="gray"
						borderRadius="full"
						onClick={() => {
							onSearch("");
							inputRef.current?.focus();
						}}
					/>
				</InputLeftElement>
			)}
		</InputGroup>
	);
}
