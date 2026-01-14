import type { Cell, Header, RowData, Table } from "@tanstack/react-table";
import { useCallback, useRef, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import type { ContextMenuPosition } from "@/components/context-menu/context-menu";
import { TableManagement } from "@/components/virtualized-table/controls/table-management";
import { TableBody } from "@/components/virtualized-table/table-body";
import { TableContextMenu } from "@/components/virtualized-table/table-context-menu";
import { TableHead } from "@/components/virtualized-table/table-head";
import { VirtualizedTableProvider } from "@/components/virtualized-table/virtualized-table-context";
import type { ImportedSourceMetadata } from "@/lib/imports/types/import";
import type { TableRow } from "@/lib/imports/types/table";
import { NAVBAR_HEIGHT } from "@/routes/__root";

export type ActiveCell =
	| ({ type: "cell" } & Cell<TableRow, unknown>)
	| ({ type: "header" } & Header<RowData, unknown>);

export type ExtendedContextMenuPosition = ContextMenuPosition & {
	activeCell: ActiveCell;
};

export type HandleOnContextMenuProps = {
	mouseEvent: React.MouseEvent<HTMLTableCellElement>;
	activeCell: ActiveCell;
};

interface VirtualizedTableProps {
	table: Table<TableRow>;
	metadata: ImportedSourceMetadata;
}

export function VirtualizedTable({ table, metadata }: VirtualizedTableProps) {
	const { height } = useWindowSize();
	const tableContainerRef = useRef<HTMLDivElement>(null);
	const [rowSelectionMode, setRowSelectionMode] = useState(false);
	const [position, setPosition] = useState<ExtendedContextMenuPosition | null>(
		null,
	);

	const handleOnContextMenu = useCallback(
		({ mouseEvent, activeCell }: HandleOnContextMenuProps) => {
			mouseEvent.preventDefault();

			setPosition({
				x: mouseEvent.clientX,
				y: mouseEvent.clientY,
				activeCell,
			});
		},
		[],
	);

	const handleOnClose = useCallback(() => {
		setPosition(null);
	}, []);

	return (
		<VirtualizedTableProvider
			table={table}
			metadata={metadata}
			rowSelectionMode={rowSelectionMode}
			onRowSelectionModeChange={setRowSelectionMode}
			onContextMenu={handleOnContextMenu}
		>
			<div
				className="w-full text-sm"
				style={{
					height: height - NAVBAR_HEIGHT,
					paddingBottom: NAVBAR_HEIGHT, // to keep scrollbar visible
				}}
			>
				<TableManagement />
				{/*
					overflow-auto - scrollable table container
					relative - needed for sticky header
				*/}
				<div
					className="overflow-auto relative h-full border rounded"
					ref={tableContainerRef}
				>
					<table
						onContextMenu={(e) => {
							e.preventDefault();
						}}
						className="tabular-nums bg-background grid"
					>
						<TableHead />
						<TableBody tableContainerRef={tableContainerRef} />
					</table>
				</div>
			</div>
			<TableContextMenu
				table={table}
				position={position}
				onClose={handleOnClose}
			/>
		</VirtualizedTableProvider>
	);
}
