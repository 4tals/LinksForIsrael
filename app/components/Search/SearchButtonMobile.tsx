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
			size="lg"
			colorScheme="blue"
			borderRadius="full"
			variant="solid"
			color="white"
		/>
	);
}
