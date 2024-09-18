import type { Table } from "@tanstack/react-table";
import type { FilePickerRow } from "../file-picker";

export type TableDataStatus = "partial" | "full";

export function useDataProperties<T extends Table<FilePickerRow>>(table: T) {
	const allColumns = table.getAllColumns();

	const visibleColumns = allColumns.reduce((acc, column) => {
		//using accessorKey, because columnId changes names of columns. Eg. "120 jefferson st." (original) is transformed to "120 jefferson st_"
		if ("accessorKey" in column.columnDef && column.getIsVisible()) {
			acc.push(column.columnDef.accessorKey);
		}

		return acc;
	}, [] as string[]);

	const allRows = table.getRowModel().flatRows;

	const filteredRows = allRows.map((row) => {
		const filteredObject: FilePickerRow = {};
		for (const key of visibleColumns) {
			if (key in row.original && typeof row.original[key] === "string") {
				filteredObject[key] = row.original[key];
			}
		}

		return filteredObject;
	});

	function getDataStatus(): TableDataStatus {
		if (
			visibleColumns.length < allColumns.length ||
			filteredRows.length < allRows.length
		) {
			return "partial";
		}

		return "full";
	}

	const dataStatus = getDataStatus();

	return { dataStatus, visibleColumns, allColumns, filteredRows, allRows };
}
