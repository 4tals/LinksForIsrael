import React, { useContext } from "react";

import { SearchContext } from "@/app/components/RootApp";
import { SearchIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

export function SearchButtonMobile() {
	const { toggleMobileSearch } = useContext(SearchContext);

	return (
		<IconButton
			aria-label="Search"
			icon={<SearchIcon />}
			onClick={toggleMobileSearch}
			size="md"
			variant="ghost"
			borderRadius="full"
			color="whiteAlpha.900"
			_hover={{
				bg: "whiteAlpha.200",
			}}
			_active={{
				bg: "whiteAlpha.300",
			}}
		/>
	);
}
