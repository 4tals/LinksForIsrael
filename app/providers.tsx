"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
	direction: "rtl",
	fonts: {
		heading: "var(--font-display), 'Rubik', system-ui, sans-serif",
		body: "var(--font-display), 'Rubik', system-ui, sans-serif",
	},
	colors: {
		brand: {
			50: "#eff6ff",
			100: "#dbeafe",
			200: "#bfdbfe",
			300: "#93c5fd",
			400: "#60a5fa",
			500: "#1d5cd6",
			600: "#0038b8",
			700: "#002d96",
			800: "#002375",
			900: "#001954",
		},
	},
	styles: {
		global: {
			body: {
				bg: "#f8fafc",
				color: "gray.800",
			},
		},
	},
});

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<CacheProvider>
			<ChakraProvider theme={theme}>{children}</ChakraProvider>
		</CacheProvider>
	);
}
