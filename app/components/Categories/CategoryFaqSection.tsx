"use client";

import NextLink from "next/link";
import React from "react";

import { Category } from "@/app/utils/categories";
import { buildCategoryFaqItems } from "@/app/utils/seo";
import { Box, Heading, Link, SimpleGrid, Text } from "@chakra-ui/react";

/**
 * Renders visible, factual FAQ answers grounded in live category data.
 * Maintains 100% text parity with the `FAQPage` JSON-LD emitted by `buildCategoryJsonLd`.
 */
export function CategoryFaqSection({ category }: { category: Category }) {
	const faqs = buildCategoryFaqItems(category);
	if (faqs.length === 0) return null;

	return (
		<Box
			as="section"
			aria-label={`שאלות נפוצות בנושא ${category.displayName}`}
			mt={10}
			mb={6}
			p={{ base: 5, md: 6 }}
			bg="white"
			borderRadius="2xl"
			borderWidth="1px"
			borderColor="gray.200"
		>
			<Heading as="h2" size="md" color="gray.900" mb={4}>
				שאלות נפוצות — {category.displayName}
			</Heading>

			<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
				{faqs.map((faq) => (
					<Box
						key={faq.question}
						p={4}
						bg="gray.50"
						borderRadius="xl"
						borderWidth="1px"
						borderColor="gray.100"
					>
						<Heading as="h3" fontSize="sm" color="brand.700" mb={1.5}>
							{faq.question}
						</Heading>
						<Text fontSize="xs" color="gray.700" lineHeight="1.7">
							{faq.answer}
						</Text>
					</Box>
				))}
			</SimpleGrid>

			<Text fontSize="xs" color="gray.500" mt={4}>
				רוצים להבין איך אנחנו מאמתים ניהול תקין ומדרגים עמותות?{" "}
				<Link
					as={NextLink}
					href="/docs/methodology"
					color="brand.600"
					fontWeight="semibold"
					_hover={{ textDecoration: "underline" }}
				>
					למתודולוגיית האימות הפתוחה
				</Link>
				.
			</Text>
		</Box>
	);
}
