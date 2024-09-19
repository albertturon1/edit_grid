import { flexRender, type Cell } from "@tanstack/react-table";
import type { FilePickerRow } from "../file-picker";
import { cn } from "@/lib/utils";

type TableBodyRowCellProps = {
	cell: Cell<FilePickerRow, unknown>;
	className?: string;
};

export function TableBodyRowCell({ cell, className }: TableBodyRowCellProps) {
	return (
		<td
			className={cn(
				"flex overflow-hidden p-0 border-r min-h-[42px]", // min-h-42 to keep stable height when none of the columns is visible (border issues)
				cell.column.columnDef.meta?.className ?? "",
				className,
			)}
			style={{
				width: cell.column.getSize(),
			}}
		>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</td>
	);
}
