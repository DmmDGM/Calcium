// Imports
import toList from "../helpers/toList.js";
import { Branch, Expression, Group, Node } from "../types.js";

// Creates parser
export function parseTree(group: Group) {
	// TODO: Create intermediate abstract syntax tree
	// TODO: Loop through orders of operations until the free is complete

	// Initializes parser
	const global: Branch = {
		expression: { index: 0, type: "global", value: [] },
		group: group
	};
	const branches: Branch[] = [ global ];
	let index = 0;
	
	// Parses tree
	while(index < branches.length) {
		// Defines current context
		const branch = branches[index];
		let node = toList(branch.group.value)
		

		// Matches index access tokens
		for(let i = 0; i < branch.group.value.length; i++) {

		}

		// Increments index
		index += 1;
	}
}

// Exports
export default parseTree;