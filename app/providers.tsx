"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

const colors = {
	blue: {
		900: "#1a365d",
		800: "#153e75",
		700: "#2a69ac",
		600: "#3f90d8",
		500: "#64b5f6",
		400: "#8bd1ff",
		300: "#b3e5ff",
		200: "#d9f2ff",
	},
};

export const theme = extendTheme({ colors });
// app/providers.tsx

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<CacheProvider>
			<ChakraProvider theme={theme}>{children}</ChakraProvider>
		</CacheProvider>
	);
}
