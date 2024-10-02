import type { FilePickerRow } from "@/features/home/components/filepicker/file-picker";
import type { Table } from "@tanstack/react-table";
import { TableColumnsSelector } from "@/components/virtualized-table/table-columns-selector";
import { ExportDataDropdown } from "@/components/virtualized-table/export-data-dropdown";
import { RowsSelectionModeToggle } from "@/components/virtualized-table/rows-selection-mode-toggle";
import { SelectedRowsIndicator } from "@/components/virtualized-table/selected-rows-indicator";
import type { TableHeaders } from "@/features/home/utils/mapHeadersToRows";

type TableManagementProps<T extends Table<FilePickerRow>> = {
	table: T;
	originalFilename: string;
	rowSelectionMode: boolean;
	onRowSelectionModeChange: (pressed: boolean) => void;
	headers: TableHeaders;
};

export function TableManagement<T extends Table<FilePickerRow>>({
	table,
	originalFilename,
	...props
}: TableManagementProps<T>) {
	return (
		<div className="flex items-center py-4 justify-between">
			<div className="flex h-full gap-x-5 items-center">
				<ExportDataDropdown
					{...props}
					originalFilename={originalFilename}
					table={table}
				/>
				<>
					<RowsSelectionModeToggle {...props} />
					{props.rowSelectionMode ? (
						<SelectedRowsIndicator table={table} />
					) : null}
				</>
			</div>
			<TableColumnsSelector table={table} />
		</div>
	);
}
