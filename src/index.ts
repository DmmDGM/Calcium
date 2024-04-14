// Imports
import nodeFs from "node:fs";
import nodePath from "node:path";
import nodeUtil from "node:util";
import parseTokens from "./parseTokens.js";
// import parseTree from "./parseTree.js";
import parseGroups from "./parseGroup.js";

// Read file
const file = await nodeFs.promises.readFile("./test.ca");
let output;

console.time();
try {
	const tokens = parseTokens(file.toString().repeat(1));
	const groups = parseGroups(tokens);
	output = groups;
}
catch(error) {
	if(typeof error === "object" && error !== null && "type" in error) {
		output = error;
	}
}
console.timeEnd();
// console.log(nodeUtil.inspect(output, { colors: true, depth: null }));
console.log(output);