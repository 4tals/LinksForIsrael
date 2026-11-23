"use client";

import { CountryCode, InitiativeLink } from "@/app/utils/categories";
import { Button, Flex } from "@chakra-ui/react";

const COUNTRIES: { code: CountryCode; en: string; he: string }[] = [
	{ code: "us", en: "🇺🇸 US", he: "🇺🇸 ארה״ב" },
	{ code: "uk", en: "🇬🇧 UK", he: "🇬🇧 בריטניה" },
	{ code: "fr", en: "🇫🇷 France", he: "🇫🇷 צרפת" },
	{ code: "ca", en: "🇨🇦 Canada", he: "🇨🇦 קנדה" },
	{ code: "au", en: "🇦🇺 Australia", he: "🇦🇺 אוסטרליה" },
	{ code: "global", en: "🌍 Global", he: "🌍 גלובלי" },
];

export function parseCountryParam(value: string | null): CountryCode | null {
	const match = COUNTRIES.find((country) => country.code === value);
	return match ? match.code : null;
}

export function matchesCountry(
	link: InitiativeLink,
	country: CountryCode | null,
): boolean {
	return (
		!country || Boolean(link.countries && link.countries.includes(country))
	);
}

export function CountryChips({
	value,
	onChange,
	locale,
}: {
	value: CountryCode | null;
	onChange: (next: CountryCode | null) => void;
	locale: "he" | "en";
}) {
	return (
		<Flex
			wrap="wrap"
			gap={1.5}
			mb={3}
			role="group"
			aria-label={locale === "he" ? "סינון לפי מדינה" : "Filter by country"}
		>
			{COUNTRIES.map((country) => {
				const active = value === country.code;
				return (
					<Button
						key={country.code}
						size="sm"
						borderRadius="full"
						variant={active ? "solid" : "outline"}
						colorScheme={active ? "blue" : "gray"}
						bg={active ? undefined : "white"}
						aria-pressed={active}
						onClick={() => onChange(active ? null : country.code)}
					>
						{country[locale]}
					</Button>
				);
			})}
		</Flex>
	);
}
