import type { FilePickerRow } from "@/features/home/components/headline-file-picker";
import type { Table } from "@tanstack/react-table";
import { TableColumnsSelector } from "@/components/virtualized-table/table-columns-selector";
import { RowsSelectionModeToggle } from "@/components/virtualized-table/rows-selection-mode-toggle";
import type { TableHeaders } from "@/components/file-picker-import-dialog/mapHeadersToRows";
import { FileDropdownMenu } from "@/components/virtualized-table/file-dropdown-menu";
import type { OnFileImport } from "@/features/home/components/headline-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type TableManagementProps<T extends Table<FilePickerRow>> = {
	table: T;
	originalFilename: string;
	rowSelectionMode: boolean;
	onRowSelectionModeChange: (pressed: boolean) => void;
	headers: TableHeaders;
	onFileImport: (props: OnFileImport) => void;
};

export function TableManagement<T extends Table<FilePickerRow>>(
	props: TableManagementProps<T>,
) {
	const rowsSelectedNum = props.table.getFilteredSelectedRowModel().rows.length;
	const totalRowsNum = props.table.getFilteredRowModel().rows.length;

	const rowProps = {
		message: `${rowsSelectedNum} of ${totalRowsNum} row(s) selected.`,
		rowSelectionMode: props.rowSelectionMode,
	};

	return (
		<>
			<div className="flex xs:hidden flex-col gap-y-2 py-2 ">
				<div className="flex gap-x-1 sm:gap-x-3 justify-between w-full">
					<FileDropdownMenu {...props} className="flex-1" />
					<RowsSelectionModeToggle {...props} className="flex-1" />
					<TableColumnsSelector table={props.table} className="flex-1" />
				</div>
				<SelectedRowsIndicatorMobile {...rowProps} />
			</div>
			<div className="hidden xs:flex">
				<div className="flex gap-x-1 sm:gap-x-3 py-2 justify-between w-full">
					<div className="flex gap-x-2 sm:gap-x-3 flex-1">
						<FileDropdownMenu {...props} />
						<div className="flex items-center gap-x-3">
							<RowsSelectionModeToggle {...props} className="flex-1" />
							<SelectedRowsIndicator {...rowProps} />
						</div>
					</div>
					<TableColumnsSelector table={props.table} />
				</div>
			</div>
		</>
	);
}

type SelectedRowsIndicatorProps = {
	message: string;
	rowSelectionMode: boolean;
};

function SelectedRowsIndicator(props: SelectedRowsIndicatorProps) {
	if (!props.rowSelectionMode) {
		return null;
	}

	return (
		<div className="text-sm text-muted-foreground tabular-nums">
			{props.message}
		</div>
	);
}

function SelectedRowsIndicatorMobile(props: SelectedRowsIndicatorProps) {
	return (
		<div
			className={cn(
				"transition-height-opacity ease-in-out duration-200",
				props.rowSelectionMode ? "opacity-100 h-10" : "h-0 opacity-0",
			)}
		>
			<Alert className="p-3 w-full flex items-center justify-center">
				<AlertDescription className="text-xs flex items-center gap-x-2">
					<Check className="h-4 w-4 text-primary" />
					{props.message}
				</AlertDescription>
			</Alert>
		</div>
	);
}
