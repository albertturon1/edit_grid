import type { Row, Table } from "@tanstack/react-table";
import { useMemo } from "react";
import type { ExportDialogFormSchema } from "@/components/virtualized-table/export-dialog";
import type { ExportMode } from "@/components/virtualized-table/types/export";
import { downloadBlob } from "@/components/virtualized-table/utils/downloadFile";
import { convertRowsToCsv } from "@/components/virtualized-table/utils/exportToCsv";
import { useTableData } from "@/components/virtualized-table/virtualized-table-context";
import type { TableRow } from "@/lib/imports/types/table";

function prepareExportData(table: Table<TableRow>, rowSelectionMode: boolean) {
	const allColumns = table.getAllColumns() ?? [];
	const visibleColumnNames: string[] = [];

	for (const column of allColumns) {
		if (column.getIsVisible() && typeof column.columnDef.header === "string") {
			visibleColumnNames.push(column.columnDef.header);
		}
	}

	const allRows = table.getRowModel().flatRows;

	const selectedRows = rowSelectionMode
		? allRows.filter((row) => row.getIsSelected())
		: allRows;

	return { selectedRows, visibleColumnNames };
}

export function useExport() {
	const { table, metadata, rowSelectionMode } = useTableData();

	const { selectedRows, visibleColumnNames } = prepareExportData(
		table,
		rowSelectionMode,
	);

	const isOriginalHeaders = !!metadata.firstRowValues.length;

	const rows: Record<ExportMode, Row<TableRow>[]> = useMemo(
		() => ({
			selected: selectedRows,
			all: table.getRowModel().flatRows,
		}),
		[selectedRows, table],
	);

	function exportData(
		exportMode: ExportMode,
		filename: string,
		includeHeaders: boolean,
	) {
		const csv = convertRowsToCsv(
			rows[exportMode],
			visibleColumnNames,
			includeHeaders,
		);
		downloadBlob(csv, filename);
	}

	function exportSubmit(formData: ExportDialogFormSchema) {
		const mode = rowSelectionMode ? formData.exportType : "all";
		exportData(mode, formData.filename, formData.includeHeaders);
	}

	function exportAll() {
		exportData("all", metadata.filename, isOriginalHeaders);
	}

	function exportSelected() {
		exportData("selected", metadata.filename, isOriginalHeaders);
	}

	return {
		exportSubmit,
		exportAll,
		exportSelected,
	};
}
