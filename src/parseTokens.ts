// Imports
import { Token } from "./types.js";

// Creates metas
export const metasBracketLeft = {
	"'": {
		block: "single_string",
		type: "single_quote_left"
	},
	"\"": {
		block: "double_string",
		type: "double_quote_left"
	},
	"(": {
		block: "round",
		type: "round_left"
	},
	"[": {
		block: "square",
		type: "square_left"
	},
	"{": {
		block: "curly",
		type: "curly_left"
	}
};
export const metasBracketRight = {
	"'": {
		block: "single_string",
		type: "single_quote_right"
	},
	"\"": {
		block: "double_string",
		type: "double_quote_right"
	},
	")": {
		block: "round",
		type: "round_right"
	},
	"]": {
		block: "square",
		type: "square_right"
	},
	"}": {
		block: "curly",
		type: "curly_right"
	}
};
export const metasString = {
	"single_string": {
		pattern: /^([^\\'{]*(\\.)*)*/
	},
	"double_string": {
		pattern: /^([^\\"{]*(\\.)*)*/
	}
};
export const metasSymbol = {
	"+": {
		type: "add"
	},
	"-": {
		type: "subtract"
	},
	"*": {
		type: "multiply"
	},
	"/": {
		type: "divide"
	},
	"%": {
		type: "modulo"
	},
	"^": {
		type: "power"
	},
	"**": {
		type: "power"
	},
	"<": {
		type: "less"
	},
	"<=": {
		type: "less_equal"
	},
	"==": {
		type: "equal"
	},
	"!=": {
		type: "not_equal"
	},
	">": {
		type: "greater"
	},
	">=": {
		type: "greater_equal"
	},
	"!": {
		type: "not"
	},
	"&": {
		type: "and"
	},
	"|": {
		type: "or"
	},
	"=": {
		type: "define"
	},
	".": {
		type: "dot"
	},
	",": {
		type: "comma"
	},
	":": {
		type: "colon"
	},
	";": {
		type: "semicolon"
	}
};

// Creates keys
export const keysBracketLeft = Object.keys(metasBracketLeft).sort((a, b) => a.length - b.length);
export const keysBracketRight = Object.keys(metasBracketRight).sort((a, b) => a.length - b.length);
export const keysSymbol = Object.keys(metasSymbol).sort((a, b) => b.length - a.length);

// Creates parser
export function parseTokens(source: string): Token[] {
	// Initializes parser
	const blocks: string[] = [ "global" ];
	const tokens: Token[] = [];
	let index = 0;
	let unparsed = source;
	let advance = (type: string, value: string): void => {
		tokens.push({ index, type, value });
		index += value.length;
		unparsed = unparsed.slice(value.length);
	}

	// Parses tokens
	while(unparsed.length) {
		// Defines current block
		const block = blocks[blocks.length - 1];

		// Matches string
		if(block in metasString) {
			const meta = metasString[block as keyof typeof metasString];
			const matchString = matchPattern(unparsed, meta.pattern);
			if(matchString !== null) {
				advance("string", matchString);
			}
		}

		// Matches right bracket
		const matchBracketRight = matchAny(unparsed, keysBracketRight);
		if(matchBracketRight !== null) {
			const meta = metasBracketRight[matchBracketRight as keyof typeof metasBracketRight];
			if(block === meta.block) {
				advance(meta.type, matchBracketRight);
				blocks.pop();
				continue;
			}
		}

		// Matches left bracket
		const matchBracketLeft = matchAny(unparsed, keysBracketLeft);
		if(matchBracketLeft !== null) {
			const meta = metasBracketLeft[matchBracketLeft as keyof typeof metasBracketLeft];
			advance(meta.type, matchBracketLeft);
			blocks.push(meta.block);
			continue;
		}

		// Matches space
		const matchSpace = matchPattern(unparsed, /^(\s+|#:.*?:#)+/);
		if(matchSpace !== null) {
			advance("space", matchSpace);
			continue;
		}

		// Matches number
		const matchNumber = matchPattern(unparsed, /^[+-]?(\d*\.\d+|\d+(\.\d*)?)(e[+-]?\d+)?/);
		if(matchNumber !== null) {
			advance("number", matchNumber);
			continue;
		}

		// Matches symbol
		const matchSymbol = matchAny(unparsed, keysSymbol);
		if(matchSymbol !== null) {
			const meta = metasSymbol[matchSymbol as keyof typeof metasSymbol];
			advance(meta.type, matchSymbol);
			continue;
		}

		// Matches identifier
		const matchIdentifier = matchPattern(unparsed, /^[a-zA-Z_][a-zA-Z0-9_]*/);
		if(matchIdentifier !== null) {
			advance("identifier", matchIdentifier);
			continue;
		}
		
		// Throws error
		throw {
			data: { block, blocks, index, source, tokens, unparsed },
			type: "invalid_token"
		};
	}

	// Returns tokens
	return tokens;
}

// Creates finders
export function matchExact(source: string, target: string) : string | null {
	// Finds match
	if(target.length === 0) return null;
	const match = source.slice(0, target.length);
	return (match === target) ? match : null;
}

export function matchAny(source: string, targets: string[]): string | null {
	// Finds match
	for(let i = 0; i < targets.length; i++) {
		let target = targets[i];
		if(target.length === 0) continue;
		const match = source.slice(0, target.length);
		if(match === target) return match;
	}
	return null;
}

export function matchPattern(source: string, target: RegExp): string | null {
	// Finds match
	const match = source.match(target);
	return (match === null || match[0].length === 0) ? null : match[0];
}

// Exports
export default parseTokens;
