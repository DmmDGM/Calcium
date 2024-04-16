// Creates helper
export function matchAny(source: string, targets: string[]): string | null {
	// Matches target
	for(let i = 0; i < targets.length; i++) {
		let target = targets[i];
		if(target.length === 0) continue;
		const match = source.slice(0, target.length);
		if(match === target) return match;
	}
	return null;
}

// Exports
export default matchAny;
