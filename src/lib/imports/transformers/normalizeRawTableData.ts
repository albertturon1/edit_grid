import type { RawTableData } from "../parsers/types";
import type { TableData } from "../types/table";

export interface NormalizeOptions {
	firstRowAsHeaders: boolean;
}

function placeholderHeaders(length: number): string[] {
	return Array.from({ length }, (_, i) => `Column${i + 1}`);
}

export function normalizeRawTableData(
	raw: RawTableData,
	options: NormalizeOptions,
): { table: TableData; firstRowValues: string[] } | null {
	const firstRow = raw[0];
	if (!firstRow) return null;

	const firstRowStringified = firstRow.map(String);

	const headers = options.firstRowAsHeaders
		? firstRowStringified
		: placeholderHeaders(firstRowStringified.length);

	const startIndex = options.firstRowAsHeaders ? 1 : 0;

	const rows = raw.slice(startIndex).map((row) => {
		const record: Record<string, string> = {};
		headers.forEach((h, i) => {
			record[h] = String(row[i] ?? "");
		});
		return record;
	});

	return {
		table: { headers, rows },
		firstRowValues: firstRowStringified,
	};
}
