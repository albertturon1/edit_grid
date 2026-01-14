import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import { getValueFromSystemTheme, useTheme } from "@/components/theme-provider";
import { TableBodyRowCell } from "@/components/virtualized-table/table-body-row-cell";
import { useCollaborationSession } from "@/features/room/components/collaborative-provider";
import type { RemoteUser } from "@/lib/collaboration/types";
import { cn } from "@/lib/utils";
import { useTableData } from "./virtualized-table-context";

export type TableBodyRowProps = {
	virtualRow: VirtualItem;
	rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
	rowIdx: number;
};

export function TableBodyRow({
	rowVirtualizer,
	virtualRow,
	rowIdx,
}: TableBodyRowProps) {
	const collaborative = useCollaborationSession();
	const remote = collaborative?.users.remote ?? [];
	const { table } = useTableData();
	const rows = table.getRowModel().rows;
	const row = rows[virtualRow.index];
	const { theme } = useTheme();
	const currentTheme = theme === "system" ? getValueFromSystemTheme() : theme;

	//TODO: fix color schema for dark mode
	const oddCellBgColor =
		currentTheme === "light" ? "bg-gray-50" : "bg-picker-primary";

	const background = rowIdx % 2 === 0 ? oddCellBgColor : "bg-background"; // from the first row, every second row has a backgroundColor to make the table easier to read

	if (!row) {
		return null;
	}

	const getRemoteUsersForCell = (colId: string): RemoteUser[] => {
		return remote.filter(
			(u) =>
				u.selectedCell?.rowIndex === virtualRow.index &&
				u.selectedCell?.colId === colId,
		);
	};

	return (
		<tr
			data-index={virtualRow.index}
			ref={(node) => rowVirtualizer.measureElement(node)}
			key={row.id}
			className={cn(
				"flex absolute w-full border-b",
				background, // needed when no column is selected (none of the <td /> are rendered)
			)}
			style={{
				transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
			}}
		>
			{row.getVisibleCells().map((cell, idx) => {
				const remoteUsersForCell = getRemoteUsersForCell(cell.column.id);
				return (
					<TableBodyRowCell
						key={cell.id}
						cell={cell}
						rowIndex={virtualRow.index}
						className={cn(
							background,
							idx === 0 && "sticky left-0 z-10", // sticky first cell
						)}
						remote={remoteUsersForCell}
						maxAvatars={3}
					/>
				);
			})}
		</tr>
	);
}
