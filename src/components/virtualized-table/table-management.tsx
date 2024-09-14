import type { FilePickerRow } from "@/components/file-picker";
import type { Table } from "@tanstack/react-table";
import { TableColumnsSelector } from "./table-columns-selector";

type TableManagementProps<T extends Table<FilePickerRow>> = {
	table: T;
};

export function TableManagement<T extends Table<FilePickerRow>>({
	table,
}: TableManagementProps<T>) {
	return (
		<div className="flex items-center py-4 px-5">
			<TableColumnsSelector table={table} />
		</div>
	);
}
