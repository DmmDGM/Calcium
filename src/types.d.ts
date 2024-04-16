// Defines types
export type Branch = {
	expression: Expression;
	group: Group;
}

export type Expression = {
	index: number;
	type: string;
	value: (Expression | Group | Token)[];	
};

export type Group = {
	index: number;
	type: string;
	value: (Group | Token)[];
};

export type Node<Element> = {
	next: Node<Element> | null;
	previous: Node<Element> | null;
	value: Element;
};

export type Token = {
	index: number;
	type: string;
	value: string;
};
