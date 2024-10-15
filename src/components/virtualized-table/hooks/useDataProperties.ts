import type { Column, Row, Table } from "@tanstack/react-table";
import type { FilePickerRow } from "@/features/home/components/headline-file-picker";

export type TableDataStatus = "partial" | "full";

export function useDataProperties<T extends Table<FilePickerRow>>(
	table: T,
	rowSelectionMode: boolean,
) {
	const allColumns = table.getAllColumns() ?? [];
	const visibleColumns: Column<FilePickerRow, unknown>[] = [];
	const visibleColumnNames: string[] = [];
	const allColumnNames: string[] = [];

	for (const column of allColumns) {
		if (typeof column.columnDef.header === "string") {
			allColumnNames.push(column.columnDef.header);
		}

		if (column.getIsVisible()) {
			visibleColumns.push(column);
		}

		if (column.getIsVisible() && typeof column.columnDef.header === "string") {
			visibleColumnNames.push(column.columnDef.header);
		}
	}

	const someColumnsToggled = allColumns.length !== visibleColumns.length;
	const noModeActive = !rowSelectionMode && !someColumnsToggled;

	const allRows = table.getRowModel().flatRows;

	function filterAndPushRow(row: Row<FilePickerRow>) {
		if (someColumnsToggled) {
			const filteredOriginalRow = filterRowByColumns({
				row,
				visibleColumnNames,
			});
			return filteredOriginalRow;
		}

		return row;
	}

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

	const dataStatus: TableDataStatus =
		visibleColumnNames.length === allColumnNames.length &&
		allRows.length === selectedRows.length
			? "full"
			: "partial";

	return {
		dataStatus,
		selectedRows,
		allRows,
		allColumns,
		visibleColumns,
		visibleColumnNames,
		allColumnNames,
	};
}

function filterRowByColumns({
	visibleColumnNames,
	row,
}: {
	visibleColumnNames: string[];
	row: Row<FilePickerRow>;
}): Row<FilePickerRow> {
	const filteredOriginal: FilePickerRow = {};

	for (const key of visibleColumnNames) {
		if (key in row.original && typeof row.original[key] === "string") {
			filteredOriginal[key] = row.original[key];
		}
	}

	return { ...row, original: filteredOriginal };
}
