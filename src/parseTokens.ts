// Imports
import { Token } from "./types.js";

// Creates metas
export const metasBracketLeft = {
	"'": {
		block: "string_single",
		type: "string_single_left"
	},
	"\"": {
		block: "string_double",
		type: "string_double_left"
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
		block: "string_single",
		type: "string_single_right"
	},
	"\"": {
		block: "string_double",
		type: "string_double_right"
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
	"string_single": {
		pattern: /^([^\\'{]*(\\.)*)*/
	},
	"string_double": {
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
	"<": {
		type: "less_than"
	},
	"<=": {
		type: "less_equal_than"
	},
	"==": {
		type: "equal_to"
	},
	"!=": {
		type: "not_equal_to"
	},
	">": {
		type: "greater_than"
	},
	">=": {
		type: "greater_equal_than"
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
		type: "equal"
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
}

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

	// Parses source
	while(unparsed.length) {
		// Defines current block
		const block = blocks[blocks.length - 1];

		// Matches string
		if(block === "string_single" || block === "string_double") {
			const meta = metasString[block];
			const matchString = findPattern(unparsed, meta.pattern);
			if(matchString !== null && matchString.length !== 0) {
				advance("string", matchString);
			}
		}

		// Matches right bracket
		const matchBracketRight = findOne(unparsed, keysBracketRight);
		if(matchBracketRight !== null) {
			const meta = metasBracketRight[matchBracketRight as keyof typeof metasBracketRight];
			if(block === meta.block) {
				advance(meta.type, matchBracketRight);
				blocks.pop();
				continue;
			}
		}

		// Matches left bracket
		const matchBracketLeft = findOne(unparsed, keysBracketLeft);
		if(matchBracketLeft !== null) {
			const meta = metasBracketLeft[matchBracketLeft as keyof typeof metasBracketLeft];
			advance(meta.type, matchBracketLeft);
			blocks.push(meta.block);
			continue;
		}

		// Matches number
		const matchNumber = findPattern(unparsed, /^[+-]?(\d*\.\d+|\d+(\.\d*)?)(e[+-]?\d+)?/);
		if(matchNumber !== null) {
			advance("number", matchNumber);
			continue;
		}

		// Matches symbol
		const matchSymbol = findOne(unparsed, keysSymbol);
		if(matchSymbol !== null) {
			const meta = metasSymbol[matchSymbol as keyof typeof metasSymbol];
			advance(meta.type, matchSymbol);
			continue;
		}

		// Matches space
		const matchSpace = findPattern(unparsed, /^(\s+|#:.*?:#)+/);
		if(matchSpace !== null) {
			advance("space", matchSpace);
			continue;
		}

		// Matches identifier
		const matchIdentifier = findPattern(unparsed, /^[a-zA-Z_][a-zA-Z0-9_]*/);
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
export function findExact(source: string, target: string) : string | null {
	// Finds match
	const match = source.slice(0, target.length);
	return match === target ? match : null;
}

export function findOne(source: string, targets: string[]): string | null {
	// Finds match
	for(let i = 0; i < targets.length; i++) {
		const match = source.slice(0, targets[i].length);
		if(match === targets[i]) return match;
	}
	return null;
}

export function findPattern(source: string, target: RegExp): string | null {
	// Finds match
	const match = source.match(target);
	return match === null ? null : match[0];
}

// Exports
export default parseTokens;
