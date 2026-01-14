import { type Cell, flexRender } from "@tanstack/react-table";
import { type MouseEvent, useRef } from "react";
import { UserAvatar } from "@/components/user-avatar/user-avatar";
import { useCollaborationSession } from "@/features/room/components/collaborative-provider";
import type { RemoteUser } from "@/lib/collaboration/types";
import type { TableRow } from "@/lib/imports/types/table";
import { cn } from "@/lib/utils";
import { HiddenAvatars } from "../user-avatar/hidden-avatars";
import { useTableData } from "./virtualized-table-context";

export type TableBodyRowCellProps = {
	cell: Cell<TableRow, unknown>;
	rowIndex: number;
	className?: string;
	remote?: RemoteUser[];
	maxAvatars: number;
};

export function TableBodyRowCell({
	cell,
	rowIndex,
	className,
	remote = [],
	maxAvatars,
}: TableBodyRowCellProps) {
	const { onContextMenu } = useTableData();
	const collaborative = useCollaborationSession();
	const cellRef = useRef<HTMLTableCellElement>(null);

	const visibleUsers = remote.slice(0, maxAvatars);
	const hiddenUsers = remote.slice(maxAvatars);

	function handleOnContextMenu(mouseEvent: MouseEvent<HTMLTableCellElement>) {
		onContextMenu({
			activeCell: {
				type: "cell",
				...cell,
			},
			mouseEvent,
		});
	}

	function handleFocus() {
		collaborative.setSelectedCell?.({
			rowIndex,
			colId: cell.column.id,
		});
	}

	function handleBlur() {
		collaborative.setSelectedCell?.(null);
	}

	return (
		<td
			ref={cellRef}
			data-row-index={rowIndex}
			data-col-id={cell.column.id}
			className={cn(
				"flex p-0 border-r min-h-[42px] relative",
				cell.column.columnDef.meta?.className ?? "",
				className,
			)}
			onContextMenu={handleOnContextMenu}
			onFocus={handleFocus}
			onBlur={handleBlur}
			style={{
				width: cell.column.getSize(),
			}}
		>
			<div className="flex-1 relative overflow-hidden">
				{flexRender(cell.column.columnDef.cell, cell.getContext())}
			</div>
			{visibleUsers && (
				<div className="absolute -top-2.5 right-0.5 flex gap-0.5 z-50 -space-x-2">
					{visibleUsers.map((user) => (
						<UserAvatar key={user.clientId} user={user} size="sm" />
					))}
					{!!hiddenUsers.length && (
						<HiddenAvatars
							count={hiddenUsers.length}
							size="sm"
							className="z-10"
						/>
					)}
				</div>
			)}
		</td>
	);
}
