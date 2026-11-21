"use client";

import React, { useContext } from "react";

import { SearchContext } from "@/app/components/RootApp";
import { SearchInput } from "@/app/components/Search/SearchInput";
import { Box, Collapse } from "@chakra-ui/react";

export function MobileSearchInput() {
	const { isMobileSearchOpen } = useContext(SearchContext);

	return (
		<Box display={{ base: "block", md: "none" }}>
			<Collapse in={isMobileSearchOpen} animateOpacity>
				<Box
					bg="white"
					borderBottomWidth="1px"
					borderColor="gray.200"
					px={4}
					py={3}
					boxShadow="sm"
					display="flex"
					justifyContent="center"
				>
					<SearchInput id="searchInputMobile" autoFocusOnMobileOpen />
				</Box>
			</Collapse>
		</Box>
	);
}
