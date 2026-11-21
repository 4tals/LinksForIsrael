"use client";

import React, { useContext } from "react";

import { SearchContext } from "@/app/components/RootApp";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

export function SearchButtonMobile() {
	const { isMobileSearchOpen, toggleMobileSearch } = useContext(SearchContext);

	return (
		<IconButton
			aria-label={isMobileSearchOpen ? "סגור חיפוש" : "פתח חיפוש"}
			icon={isMobileSearchOpen ? <CloseIcon boxSize={3.5} /> : <SearchIcon />}
			onClick={toggleMobileSearch}
			size="md"
			variant="ghost"
			color="white"
			borderRadius="full"
			_hover={{ bg: "whiteAlpha.200" }}
			_active={{ bg: "whiteAlpha.300" }}
		/>
	);
}
