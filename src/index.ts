// Imports
import nodeFs from "node:fs";
import nodePath from "node:path";
import parseTokens from "./parseTokens.js";

// Read file
const file = await nodeFs.promises.readFile("./test.ca");
let output;

console.time();
try {
	output = parseTokens(file.toString());
}
catch(error) {
	if(typeof error === "object" && error !== null && "type" in error) {
		console.log(error);
	}
}
console.timeEnd();
console.log(output);