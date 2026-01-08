import Papa from "papaparse";
import type { FileParser, ParsedData } from "./index";

export const csvParser: FileParser = {
	canParse: (file: File): boolean => {
		return file.name.toLowerCase().endsWith(".csv");
	},
	parse: (file: File): Promise<ParsedData> => {
		return new Promise((resolve, reject) => {
			Papa.parse(file, {
				skipEmptyLines: true,
				complete: (result) => {
					resolve({
						headers: result.meta.fields || null,
						rows: result.data as string[][],
					});
				},
				error: reject,
			});
		});
	},
};
