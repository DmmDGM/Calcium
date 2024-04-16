// Imports
import { Node } from "../types.js";

// Creates helpers
export function toList<Element>(array: Element[]): Node<Element> {
	// Initializes helper
	const list: Node<Element> = { next: null, previous: null, value: array[0] };
	let node = list;

	// Loops through array
	for(let i = 1; i < array.length; i++) {
		node.next = { next: null, previous: node, value: array[i] };
		node = node.next;
	}

	// Returns node
	return list;
}

// Exports
export default toList;
