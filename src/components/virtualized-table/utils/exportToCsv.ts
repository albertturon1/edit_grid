import type { Row } from "@tanstack/react-table";
import type { TableRow } from "@/lib/imports/types/table";
import { convertIntoCsv } from "./convertIntoCsv";

export function convertRowsToCsv(
	rows: Row<TableRow>[],
	visibleColumnNames: string[],
	includeHeaders: boolean,
): string {
	const mappedRows = mapRowsIntoStringArrays(rows);
	const headers = includeHeaders ? visibleColumnNames : [];

	return convertIntoCsv(headers, mappedRows);
}

function mapRowsIntoStringArrays(rows: Row<TableRow>[]) {
	return rows.map((row) => {
		return row.getAllCells().reduce<string[]>((acc, e) => {
			const value = e.getValue();
			if (e.column.getIsVisible() && typeof value === "string") {
				acc.push(value);
			}
			return acc;
		}, []);
	});
}
