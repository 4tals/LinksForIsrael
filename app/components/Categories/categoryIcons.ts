import React from "react";
import {
	FaBullhorn,
	FaFire,
	FaHandHoldingHeart,
	FaHandsHelping,
	FaHeartbeat,
	FaPlaneArrival,
	FaSeedling,
	FaShieldAlt,
	FaUsers,
} from "react-icons/fa";

export const CATEGORY_ICONS: Record<
	string,
	{ icon: React.ElementType; bg: string; color: string }
> = {
	Medical: { icon: FaHeartbeat, bg: "red.50", color: "red.600" },
	Defense: { icon: FaShieldAlt, bg: "blue.50", color: "brand.600" },
	Economic: { icon: FaHandHoldingHeart, bg: "purple.50", color: "purple.600" },
	FamilyAndPets: { icon: FaUsers, bg: "teal.50", color: "teal.600" },
	GeneralAssistance: {
		icon: FaHandsHelping,
		bg: "blue.50",
		color: "blue.700",
	},
	Olim: { icon: FaPlaneArrival, bg: "blue.50", color: "brand.700" },
	Agriculture: { icon: FaSeedling, bg: "green.50", color: "green.700" },
	MemorialRemembrance: { icon: FaFire, bg: "orange.50", color: "orange.700" },
	StrategicCommunication: {
		icon: FaBullhorn,
		bg: "cyan.50",
		color: "cyan.700",
	},
};

export function getCategoryIcon(categoryId: string) {
	return (
		CATEGORY_ICONS[categoryId] || {
			icon: FaHandsHelping,
			bg: "brand.50",
			color: "brand.600",
		}
	);
}
