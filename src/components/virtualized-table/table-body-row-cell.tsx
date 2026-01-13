import type { MouseEvent } from "react";
import { flexRender, type Cell } from "@tanstack/react-table";
import type { TableRow } from "@/lib/imports/types/table";
import { cn } from "@/lib/utils";
import type { HandleOnContextMenuProps } from "@/components/virtualized-table/virtualized-table";

export type TableBodyRowCellProps = {
	cell: Cell<TableRow, unknown>;
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
