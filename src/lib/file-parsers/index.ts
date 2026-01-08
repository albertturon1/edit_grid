import type { FileParser } from "./types";
import { csvParser } from "./csv-parser";

export type ParsedData = {
	headers: string[] | null;
	rows: string[][];
};

export type { FileParser } from "./types";

export { csvParser };

const PARSER_REGISTRY = {
	".csv": csvParser,
} as const;

export function getParser(file: File): FileParser | null {
	const ext = ("." +
		file.name.split(".").pop()?.toLowerCase()) as keyof typeof PARSER_REGISTRY;
	return PARSER_REGISTRY[ext] || null;
}
