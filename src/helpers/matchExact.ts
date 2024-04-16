// Creates helper
export function matchExact(source: string, target: string) : string | null {
	// Matches target
	if(target.length === 0) return null;
	const match = source.slice(0, target.length);
	return (match === target) ? match : null;
}

// Export
export default matchExact;
