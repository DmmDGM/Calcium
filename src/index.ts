// Imports
import nodeFs from "node:fs";
import nodePath from "node:path";
import nodeUtil from "node:util";
import parseTokens from "./parseTokens.js";
import parseTree from "./parseTree.js";

// Read file
const file = await nodeFs.promises.readFile("./test.ca");
let output;

console.time();
try {
	const tokens = parseTokens(file.toString());
	const tree = parseTree(tokens);
	output = tree;
}
catch(error) {
	if(typeof error === "object" && error !== null && "type" in error) {
		console.log(error);
	}
}
console.timeEnd();
console.log(nodeUtil.inspect(output, {
	colors: true,
	depth: null
}));