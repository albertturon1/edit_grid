import type { Table } from "@tanstack/react-table";
import type { FilePickerRow } from "@/features/home/components/filepicker/file-picker";

type SelectedRowsIndicatorProps<T extends Table<FilePickerRow>> = {
	table: T;
};

export function SelectedRowsIndicator<T extends Table<FilePickerRow>>({
	table,
}: SelectedRowsIndicatorProps<T>) {
	const rowsSelectedNum = table.getFilteredSelectedRowModel().rows.length;
	const totalRowsNum = table.getFilteredRowModel().rows.length;

	return (
		<div className="text-sm text-muted-foreground tabular-nums">
			{`${rowsSelectedNum} of ${totalRowsNum} row(s) selected.`}
		</div>
	);
}
