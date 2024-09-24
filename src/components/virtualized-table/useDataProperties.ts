import type { Row, Table } from "@tanstack/react-table";
import type { FilePickerRow } from "../file-picker";

export type TableDataStatus = "partial" | "full";

export function useDataProperties<T extends Table<FilePickerRow>>(
	table: T,
	rowSelectionMode: boolean,
) {
	const allColumns = table.getAllColumns();

	const visibleColumns = allColumns.reduce((acc, column) => {
		//using accessorKey, because columnId changes names of columns. Eg. "120 jefferson st." (original) is transformed to "120 jefferson st_"
		if ("accessorKey" in column.columnDef && column.getIsVisible()) {
			acc.push(column.columnDef.accessorKey);
		}

		return acc;
	}, [] as string[]);

	const someColumnsToggled = visibleColumns.length !== allColumns.length;

	const noModeActive = !rowSelectionMode && !someColumnsToggled;

	function filterAndPushRow(row: Row<FilePickerRow>) {
		if (someColumnsToggled) {
			const filteredOriginalRow = filterRowByColumns({ row, visibleColumns });
			return filteredOriginalRow;
		}

		return row;
	}

	const allRows = table.getRowModel().flatRows;

	const selectedRows = noModeActive
		? allRows
		: allRows.reduce<Row<FilePickerRow>[]>((acc, row) => {
				if (rowSelectionMode && !row.getIsSelected()) {
					return acc; // Skip unselected rows if row selection is active
				}

				const newRow = filterAndPushRow(row);

				acc.push(newRow);
				return acc;
			}, []);

	function getDataStatus(): TableDataStatus {
		if (
			visibleColumns.length < allColumns.length ||
			(rowSelectionMode &&
				selectedRows.length > 0 &&
				selectedRows.length < allRows.length)
		) {
			return "partial";
		}

		return "full";
	}

	const dataStatus = getDataStatus();

	return { dataStatus, visibleColumns, allColumns, selectedRows, allRows };
}

function filterRowByColumns({
	visibleColumns,
	row,
}: { visibleColumns: string[]; row: Row<FilePickerRow> }): Row<FilePickerRow> {
	const filteredOriginal: FilePickerRow = {};

	for (const key of visibleColumns) {
		if (key in row.original && typeof row.original[key] === "string") {
			filteredOriginal[key] = row.original[key];
		}
	}

	return { ...row, original: filteredOriginal };
}
