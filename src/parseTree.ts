// Imports
import { Branch, Expression, Token } from "./types.js";

// Creates metas
export const metasBracketLeft = {
	"single_quote_left": {
		type: "string"
	},
	"double_quote_left": {
		type: "string"
	},
	"round_left": {
		type: "round"
	},
	"square_left": {
		type: "square"
	},
	"curly_left": {
		type: "curly"
	}
};
export const metasBracketRight = {
	"single_quote_right": {
		type: "string"
	},
	"double_quote_right": {
		type: "string"
	},
	"round_right": {
		type: "round"
	},
	"square_right": {
		type: "square"
	},
	"curly_right": {
		type: "curly"
	}
};

// Creates keys
export const keysBracketLeft = Object.keys(metasBracketLeft).sort((a, b) => a.length - b.length);
export const keysBracketRight = Object.keys(metasBracketRight).sort((a, b) => a.length - b.length);

// Creates parser
export function parseTree(tokens: Token[]) {
	// Initializes parser
	const branches: Branch = {
		index: 0,
		parent: null,
		type: "global",
		value: []
	};
	let branch = branches;
	
	// Parses branches
	for(let i = 0; i < tokens.length; i++) {
		// Defines current token
		const token = tokens[i];

		// Matches right bracket
		if(token.type in metasBracketRight) {
			const meta = metasBracketRight[token.type as keyof typeof metasBracketRight];
			if(branch.type !== meta.type || branch.parent === null) throw {
				data: { branch, branches, token },
				type: "invalid_right_bracket"
			};
			branch = branch.parent;
			continue;
		}

		// Matches left bracket
		if(token.type in metasBracketLeft) {
			const meta = metasBracketLeft[token.type as keyof typeof metasBracketLeft];
			const subbranch: Branch = {
				index: token.index,
				parent: branch,
				type: meta.type,
				value: []
			};
			branch.value.push(subbranch);
			branch = subbranch;
			continue;
		}

		// Matches token
		branch.value.push(token);
	}

	// Checks for unclosed brackets
	if(branch.type !== "global") throw {
		data: { branch, branches },
		type: "unclosed_left_brakcet"
	};

	// Parses tree
	const tree: Expression = {
		index: 0,
		type: "global",
		value: []
	};

	// Returns tree
	return tree;
}

// Exports
export default parseTree;
