import type { Column, Row, Table } from "@tanstack/react-table";
import type { TableRow } from "@/lib/imports/types/table";

export function useDataProperties(
	table: Table<TableRow>,
	rowSelectionMode: boolean,
) {
	const allColumns = table.getAllColumns() ?? [];
	const visibleColumns: Column<TableRow, unknown>[] = [];
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

	function filterAndPushRow(row: Row<TableRow>) {
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
		: allRows.reduce<Row<TableRow>[]>((acc, row) => {
				if (rowSelectionMode && !row.getIsSelected()) {
					return acc; // Skip unselected rows if row selection is active
				}

				const newRow = filterAndPushRow(row);

				acc.push(newRow);
				return acc;
			}, []);

	return {
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
	row: Row<TableRow>;
}): Row<TableRow> {
	const filteredOriginal: TableRow = {};

	for (const key of visibleColumnNames) {
		if (key in row.original && typeof row.original[key] === "string") {
			filteredOriginal[key] = row.original[key];
		}
	}

	return { ...row, original: filteredOriginal };
}
