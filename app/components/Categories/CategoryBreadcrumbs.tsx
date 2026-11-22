"use client";

import NextLink from "next/link";
import React from "react";
import { FaChevronLeft } from "react-icons/fa";

import { Box, Flex, Icon, Link, Text } from "@chakra-ui/react";

export interface BreadcrumbTrailItem {
	label: string;
	href?: string;
}

export function CategoryBreadcrumbs({
	items,
}: {
	items: BreadcrumbTrailItem[];
}) {
	if (items.length === 0) return null;

	return (
		<Box as="nav" aria-label="פירורי לחם" mb={3}>
			<Flex
				as="ol"
				align="center"
				wrap="wrap"
				gap={1.5}
				listStyleType="none"
				fontSize="xs"
				color="gray.500"
			>
				{items.map((item, idx) => {
					const isLast = idx === items.length - 1;
					return (
						<Flex as="li" key={`${item.label}-${idx}`} align="center" gap={1.5}>
							{idx > 0 && (
								<Icon
									as={FaChevronLeft}
									boxSize={2.5}
									color="gray.400"
									aria-hidden="true"
								/>
							)}
							{item.href && !isLast ? (
								<Link
									as={NextLink}
									href={item.href}
									color="gray.600"
									fontWeight="medium"
									_hover={{ color: "brand.600", textDecoration: "underline" }}
								>
									{item.label}
								</Link>
							) : (
								<Text
									as="span"
									color="gray.800"
									fontWeight="semibold"
									aria-current={isLast ? "page" : undefined}
								>
									{item.label}
								</Text>
							)}
						</Flex>
					);
				})}
			</Flex>
		</Box>
	);
}
