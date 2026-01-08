export type ParsedData = {
	headers: string[] | null;
	rows: string[][];
};

export type FileParser = {
	canParse: (file: File) => boolean;
	parse: (file: File) => Promise<ParsedData>;
};
