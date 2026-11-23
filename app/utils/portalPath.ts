/**
 * Path of a category / sub-category / initiative page.
 * The host serves lowercase paths only, so every internal URL goes through here.
 */
export function portalPath(...segments: string[]): string {
	return `/${segments
		.map((segment) => encodeURIComponent(segment.toLowerCase()))
		.join("/")}`;
}
