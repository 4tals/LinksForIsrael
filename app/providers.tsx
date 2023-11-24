// app/providers.tsx
"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";

// app/providers.tsx

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<CacheProvider>
			<ChakraProvider>{children}</ChakraProvider>
		</CacheProvider>
	);
}
