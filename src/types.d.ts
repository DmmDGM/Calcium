// Defines types
export type Group = {
	index: number;
	type: string;
	value: (Group | Token)[];
}

export type Token = {
	index: number;
	type: string;
	value: string;
};
