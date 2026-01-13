export type ExampleConfig = {
	id: string;
	filepath: string;
	name: string;
};

export const EXAMPLE_CONFIGS: ExampleConfig[] = [
	{
		id: "example-small",
		filepath: "/example_small.csv",
		name: "Small Example",
	},
	{
		id: "example-medium",
		filepath: "/example_medium.csv",
		name: "Medium Example",
	},
	{
		id: "example-big",
		filepath: "/example_big.csv",
		name: "Big Example",
	},
];
