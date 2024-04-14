// Defines types
export type Branch = {
	parent: Branch | null;
	index: number;
	type: string;
	value: (Branch | Token)[];
};

export type Expression = {
	index: number;
	type: string;
	value: (Branch | Expression | Token)[];
};

export type Token = {
	index: number;
	type: string;
	value: string;
};
