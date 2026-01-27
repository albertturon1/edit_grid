import type { Column, Table } from "@tanstack/react-table";
import type { TableRow } from "@/lib/imports/types/table";

export function useDataProperties(table: Table<TableRow>) {
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

  const allRows = table.getRowModel().flatRows;

  return {
    allRows,
    allColumns,
    visibleColumns,
    visibleColumnNames,
    allColumnNames,
  };
}
