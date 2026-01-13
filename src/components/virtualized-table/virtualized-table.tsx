import { useRef, useState, type Dispatch } from "react";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { TableHead } from "@/components/virtualized-table/table-head";
import { TableBody } from "@/components/virtualized-table/table-body";
import { TableManagement } from "@/components/virtualized-table/table-management";
import { useVirtualizedTable } from "@/components/virtualized-table/hooks/useVirtualizedTable";
import { TableContextMenu } from "@/components/virtualized-table/table-context-menu";
import type { ContextMenuPosition } from "@/components/context-menu/context-menu";
import type { Cell, Header, RowData } from "@tanstack/react-table";
import { useWindowSize } from "usehooks-ts";
import type { TableHeaders, TableRow } from "@/lib/imports/types/table";
import type { FileImportResult } from "@/lib/imports/types/import";

export type ActiveCell =
	| ({ type: "cell" } & Cell<TableRow, unknown>)
	| ({ type: "header" } & Header<RowData, unknown>);

export type ExtendedContextMenuPosition = ContextMenuPosition & {
	activeCell: ActiveCell;
};

export type VirtualizedTableProps = {
	headers: TableHeaders;
	rows: TableRow[];
	onRowsChange: Dispatch<React.SetStateAction<TableRow[]>>;
	originalFilename: string;
	onFileImport: (props: FileImportResult) => void;
	onDataUpdate: (props: { headers: TableHeaders; rows: TableRow[] }) => void;
};

export type HandleOnContextMenuProps = {
	mouseEvent: React.MouseEvent<HTMLTableCellElement>;
	activeCell: ActiveCell;
};

export function VirtualizedTable({
	headers,
	rows,
	onRowsChange,
	onDataUpdate,
	...props
}: VirtualizedTableProps) {
	const { height } = useWindowSize();

	//The virtualizer needs to know the scrollable container element
	const tableContainerRef = useRef<HTMLDivElement>(null);

	// rowSelectionMode is boolean value that determines if row selection mode is active
	const [rowSelectionMode, setRowSelectionMode] = useState(false);

	const { table } = useVirtualizedTable({
		rowSelectionMode,
		data: {
			headers,
			rows,
		},
	});

	const [position, setPosition] = useState<ExtendedContextMenuPosition | null>(
		null,
	);

	function handleOnContextMenu({
		mouseEvent,
		activeCell,
	}: HandleOnContextMenuProps) {
		mouseEvent.preventDefault();

		setPosition({
			x: mouseEvent.clientX,
			y: mouseEvent.clientY,
			activeCell,
		});
	}

	function handleOnFileImport(e: FileImportResult) {
		setPosition(null);
		props.onFileImport(e);
		setRowSelectionMode(false);
	}

	function handleOnClose() {
		setPosition(null);
	}

	return (
		<>
			<div
				className="w-full text-sm"
				style={{
					height: height - NAVBAR_HEIGHT,
					paddingBottom: NAVBAR_HEIGHT, // to keep scrollbar visible
				}}
			>
				<TableManagement
					{...props}
					headers={headers}
					onFileImport={handleOnFileImport}
					table={table}
					rowSelectionMode={rowSelectionMode}
					onRowSelectionModeChange={setRowSelectionMode}
				/>
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
						<TableHead
							headerGroups={table.getHeaderGroups()}
							onContextMenu={handleOnContextMenu}
						/>
						<TableBody
							rows={table.getRowModel().rows}
							tableContainerRef={tableContainerRef}
							onContextMenu={handleOnContextMenu}
						/>
					</table>
				</div>
			</div>
			<TableContextMenu position={position} onClose={handleOnClose} />
		</>
	);
}
