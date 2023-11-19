export interface MenuContextProps {
	isMenuOpen: boolean;
	toggleMenu: () => void;
	isMobile: boolean;
}

export const initialMenuContext: MenuContextProps = {
	isMenuOpen: false,
	toggleMenu: () => {},
	isMobile: false,
};
