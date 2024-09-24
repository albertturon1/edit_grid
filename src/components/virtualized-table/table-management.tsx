import type { FilePickerRow } from "@/components/file-picker";
import type { Table } from "@tanstack/react-table";
import { TableColumnsSelector } from "./table-columns-selector";
import { ExportDataDropdown } from "./export-data-dropdown";
import { RowsSelectionModeToggle } from "./rows-selection-mode-toggle";
import { SelectedRowsIndicator } from "./selected-rows-indicator";

type TableManagementProps<T extends Table<FilePickerRow>> = {
	table: T;
	originalFilename: string;
	rowSelectionMode: boolean;
	onRowSelectionModeChange: (pressed: boolean) => void;
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
