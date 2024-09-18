import type { FilePickerRow } from "@/components/file-picker";
import type { Table } from "@tanstack/react-table";
import { TableColumnsSelector } from "./table-columns-selector";
import { ExportDataDropdown } from "./export-data-dropdown";

type TableManagementProps<T extends Table<FilePickerRow>> = {
	table: T;
	originalFilename: string;
};

export function TableManagement<T extends Table<FilePickerRow>>({
	table,
	originalFilename,
}: TableManagementProps<T>) {
	return (
		<div className="flex items-center py-4 justify-between">
			<ExportDataDropdown originalFilename={originalFilename} table={table} />
			<TableColumnsSelector table={table} />
		</div>
	);
}
