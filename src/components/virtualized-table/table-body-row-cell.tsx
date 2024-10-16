import { flexRender, type Cell } from "@tanstack/react-table";
import type { FilePickerRow } from "@/features/home/components/headline-file-picker";
import { cn } from "@/lib/utils";
import type { MouseEvent } from "react";
import type { HandleOnContextMenuProps } from "./virtualized-table";

export type TableBodyRowCellProps = {
	cell: Cell<FilePickerRow, unknown>;
	className?: string;
	onContextMenu: (props: HandleOnContextMenuProps) => void;
};

export function TableBodyRowCell({
	cell,
	className,
	onContextMenu,
}: TableBodyRowCellProps) {
	function handleOnContextMenu(mouseEvent: MouseEvent<HTMLTableCellElement>) {
		onContextMenu({
			activeCell: {
				type: "cell",
				...cell,
			},
			mouseEvent,
		});
	}

	return (
		<td
			className={cn(
				"flex overflow-hidden p-0 border-r min-h-[42px]", // min-h-42 to keep stable height when none of the columns is visible (border issues)
				cell.column.columnDef.meta?.className ?? "",
				className,
			)}
			onContextMenu={handleOnContextMenu}
			style={{
				width: cell.column.getSize(),
			}}
		>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</td>
	);
}
