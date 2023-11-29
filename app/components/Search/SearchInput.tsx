import React, { useContext, useEffect, useRef } from "react";

import { MenuContext, SearchContext } from "@/app/components/RootApp";
import { Search2Icon } from "@chakra-ui/icons";
import { Box, Input, Icon, useMediaQuery } from "@chakra-ui/react";

export function SearchInput() {
	const { search, onSearch, isMobileSearchOpen } = useContext(SearchContext);
	const { isMenuOpen, toggleMenu } = useContext(MenuContext);
	const inputRef = useRef<HTMLInputElement>(null);
	const [isMobile] = useMediaQuery("(max-width: 768px)");

	useEffect(() => {
		if (isMobileSearchOpen) {
			inputRef.current?.focus();
		}
	}, [isMobileSearchOpen]);

	return (
		<Box
			display="flex"
			alignItems="center"
			backgroundColor="white"
			width={isMobile ? "100%" : "400px"}
			height={isMobile ? "35px" : "44px"}
			borderRadius="20px"
			padding="0 10px"
		>
			<Icon
				as={Search2Icon}
				color="gray.500"
				w={6}
				h={6}
				display={{ base: "none", md: "flex" }}
			/>
			<Input
				ref={inputRef}
				id="searchInputWeb"
				name="query"
				placeholder="מה תרצו לחפש?"
				autoComplete="off"
				value={search}
				onChange={(e) => {
					onSearch(e.target.value);
					if (isMobileSearchOpen && isMenuOpen) {
						toggleMenu();
					}
				}}
				border="none"
				outline="none"
				marginRight="7px"
				width="100%"
				list="search-suggestions"
				borderRadius="20px"
				bgColor="transparent" // Set background to transparent
				_focus={{ boxShadow: "none" }} // Remove focus outline
			/>
		</Box>
	);
}
