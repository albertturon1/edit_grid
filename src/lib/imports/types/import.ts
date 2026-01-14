import type { TableData } from "./table";

export interface ImportedSourceMetadata {
	filename: string;
	firstRowValues: string[];
}

export interface FileImportResult {
	file: File;
	table: TableData;
	metadata: ImportedSourceMetadata;
}
