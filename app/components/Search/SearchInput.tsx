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
			bg="whiteAlpha.100"
			border="1px solid"
			borderColor="whiteAlpha.200"
			width={isMobile ? "100%" : "100%"}
			maxW="400px"
			height={isMobile ? "36px" : "40px"}
			borderRadius="full"
			px={4}
			transition="all 0.2s ease"
			_hover={{
				bg: "whiteAlpha.150",
				borderColor: "whiteAlpha.300",
			}}
			_focusWithin={{
				bg: "whiteAlpha.200",
				borderColor: "whiteAlpha.400",
				boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.1)",
			}}
		>
			<Icon
				as={Search2Icon}
				color="whiteAlpha.700"
				w={4}
				h={4}
				mr={2}
				flexShrink={0}
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
				bg="transparent"
				color="white"
				fontSize="sm"
				outline="none"
				width="100%"
				list="search-suggestions"
				p={0}
				_placeholder={{
					color: "whiteAlpha.600",
				}}
				_focus={{
					boxShadow: "none",
				}}
			/>
		</Box>
	);
}
