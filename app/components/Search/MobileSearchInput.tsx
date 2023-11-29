import React, { useContext } from "react";

import { SearchContext } from "@/app/components/RootApp";
import { SearchInput } from "@/app/components/Search/SearchInput";
import { Box, useMediaQuery } from "@chakra-ui/react";

export function MobileSearchInput() {
	const { isMobileSearchOpen } = useContext(SearchContext);
	const [isMobile] = useMediaQuery("(max-width: 768px)");

	return isMobile ? (
		<Box
			position="absolute"
			width="100%"
			zIndex="999"
			display="flex"
			justifyContent="center"
			alignItems="center"
			padding="0 20px"
			backgroundColor="rgba(0, 0, 0, 0.2)"
			overflow="hidden"
			height={isMobileSearchOpen ? "7vh" : "0"}
			transition="height 0.1s ease-in-out"
		>
			<SearchInput />
		</Box>
	) : null;
}
