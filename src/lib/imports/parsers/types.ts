import type { Result } from "@/types/result";

export type FileParserError = "Unknown error" | "Incorrect input data";

export type CellValue = string | number | boolean | null;
export type RawRow = CellValue[];
export type RawTableData = RawRow[];

export type FileParser = {
	parse(file: File): Promise<Result<RawTableData, FileParserError>>;
};
