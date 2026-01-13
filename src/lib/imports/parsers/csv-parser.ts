import Papa from "papaparse";
import type { FileParser } from "./types";

export const csvParser: FileParser = {
	parse: (file) =>
		new Promise((resolve) => {
			Papa.parse(file, {
				skipEmptyLines: true,
				complete: (result) => {
					if (!Array.isArray(result.data) || result.data.length === 0) {
						resolve({ success: false, error: "Incorrect input data" });
						return;
					}

					resolve({
						success: true,
						data: result.data as string[][],
					});
				},
				error: () => {
					resolve({ success: false, error: "Unknown error" });
				},
			});
		}),
};
