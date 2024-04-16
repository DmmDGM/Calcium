// Imports
import matchAny from "../helpers/matchAny.js";
import matchPattern from "../helpers/matchPattern.js";
import { Token } from "../types.js";

// Creates metas
export const metasLeft = {
	"'": { block: "single", type: "quote_left" },
	"\"": { block: "double", type: "quote_left" },
	"(": { block: "round", type: "round_left" },
	"[": { block: "square", type: "square_left" },
	"{": { block: "curly", type: "curly_left" },
	"<<": { block: "angle", type: "angle_left" }
};
export const metasRight = {
	"'": { block: "single", type: "quote_right" },
	"\"": { block: "double", type: "quote_right" },
	")": { block: "round", type: "round_right" },
	"]": { block: "square", type: "square_right" },
	"}": { block: "curly", type: "curly_right" },
	">>": { block: "angle", type: "angle_right" }
};
export const metasString = {
	"single": { pattern: /^([^\\'{]*(\\.)*)*/ },
	"double": { pattern: /^([^\\"{]*(\\.)*)*/ }
};
export const metasSymbol = {
	"+": { type: "add" },
	"-": { type: "subtract" },
	"*": { type: "multiply" },
	"/": { type: "divide" },
	"%": { type: "modulo" },
	"**": { type: "power" },
	"<": { type: "less" },
	"<=": { type: "less_equal" },
	"==": { type: "equal" },
	"!=": { type: "not_equal" },
	">": { type: "greater" },
	">=": { type: "greater_equal" },
	"!": { type: "not" },
	"&": { type: "and" },
	"|": { type: "or" },
	"=": { type: "define" },
	".": { type: "dot" },
	",": { type: "comma" },
	":": { type: "colon" },
	";": { type: "semicolon" },
	"$": { type: "dollar" }
};

// Creates keys
export const keysLeft = Object.keys(metasLeft).sort((a, b) => b.length - a.length);
export const keysRight = Object.keys(metasRight).sort((a, b) => b.length - a.length);
export const keysSymbol = Object.keys(metasSymbol).sort((a, b) => b.length - a.length);

// Creates parser
export function parseTokens(source: string): Token[] {
	// Initializes parser
	const blocks: string[] = [ "global" ];
	const tokens: Token[] = [];
	let index = 0;
	let unparsed = source;
	let advance = (value: string): void => {
		index += value.length;
		unparsed = unparsed.slice(value.length);
	};
	let append = (type: string, value: string): void => {
		tokens.push({ index, type, value });
		advance(value);
	};

	// Parses tokens
	while(unparsed.length) {
		// Defines current context
		const block = blocks[blocks.length - 1];

		// Matches string
		if(block in metasString) {
			const meta = metasString[block as keyof typeof metasString];
			const matchString = matchPattern(unparsed, meta.pattern);
			if(matchString !== null) {
				append("text", matchString);
			}
		}

		// Matches right bracket
		const matchRight = matchAny(unparsed, keysRight);
		if(matchRight !== null) {
			const meta = metasRight[matchRight as keyof typeof metasRight];
			if(block === meta.block) {
				append(meta.type, matchRight);
				blocks.pop();
				continue;
			}
		}

		// Matches left bracket
		const matchLeft = matchAny(unparsed, keysLeft);
		if(matchLeft !== null) {
			const meta = metasLeft[matchLeft as keyof typeof metasLeft];
			append(meta.type, matchLeft);
			blocks.push(meta.block);
			continue;
		}

		// Matches space
		const matchSpace = matchPattern(unparsed, /^(\s+|#:.*?:#)+/);
		if(matchSpace !== null) {
			advance(matchSpace);
			continue;
		}

		// Matches number
		const matchNumber = matchPattern(unparsed, /^[+-]?(\d*\.\d+|\d+(\.\d*)?)(e[+-]?\d+)?\b/);
		if(matchNumber !== null) {
			append("number", matchNumber);
			continue;
		}

		// Matches symbol
		const matchSymbol = matchAny(unparsed, keysSymbol);
		if(matchSymbol !== null) {
			const meta = metasSymbol[matchSymbol as keyof typeof metasSymbol];
			append(meta.type, matchSymbol);
			continue;
		}

		// Matches identifier
		const matchIdentifier = matchPattern(unparsed, /^[a-zA-Z_][a-zA-Z0-9_]*\b/);
		if(matchIdentifier !== null) {
			append("identifier", matchIdentifier);
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

// Exports
export default parseTokens;
