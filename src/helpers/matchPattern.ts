// Creates helper
export function matchPattern(source: string, target: RegExp): string | null {
	// Matches target
	const match = source.match(target);
	return (match === null || match[0].length === 0) ? null : match[0];
}

// Exports
export default matchPattern;