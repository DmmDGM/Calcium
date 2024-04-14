// Imports
import { Group, Token } from "./types.js";

// Creates metas
export const metasRight = {
	"quote_right": { block: "string" },
	"round_right": { block: "round" },
	"square_right": { block: "square" },
	"curly_right": { block: "curly" }
};
export const metasLeft = {
	"quote_left": { block: "string" },
	"round_left": { block: "round" },
	"square_left": { block: "square" },
	"curly_left": { block: "curly" }
};

// Creates parser
export function parseGroup(tokens: Token[]): Group {
	// Initializes parser
	const global = {
		index: 0,
		type: "global",
		value: []
	};
	const groups: Group[] = [ global ];

	// Parses groups
	for(let i = 0; i < tokens.length; i++) {
		// Defines current context
		const group = groups[groups.length - 1];
		const token = tokens[i];

		// Matches right bracket
		if(token.type in metasRight) {
			const meta = metasRight[token.type as keyof typeof metasRight];
			if(group.type === meta.block) {
				groups.pop();
				continue;
			}
			else {
				throw {
					data: { group, groups, token },
					type: "invalid_right"
				};
			}
		}

		// Matches left bracket
		if(token.type in metasLeft) {
			const meta = metasLeft[token.type as keyof typeof metasLeft];
			const subgroup = {
				index: token.index,
				type: meta.block,
				value: []
			};
			group.value.push(subgroup);
			groups.push(subgroup);
			continue;
		}

		// Matches token
		group.value.push(token);
	}

	// Checks for context
	if(groups[groups.length - 1] !== global) {
		throw {
			data: { groups },
			type: "unclosed_left"
		};
	}

	// Returns group
	return global;
}

// Exports
export default parseGroup;
