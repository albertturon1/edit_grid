import { useRef, useState, type Dispatch } from "react";
import { TableHead } from "@/components/virtualized-table/table-head";
import { TableBody } from "@/components/virtualized-table/table-body";
import { TableManagement } from "@/components/virtualized-table/table-management";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { useWindowDimensions } from "@/lib/useWindowDimensions";
import { useVirtualizedTable } from "@/components/virtualized-table/hooks/useVirtualizedTable";
import type { FilePickerRow } from "@/features/home/components/headline-file-picker";
import type {
	TableHeaders,
	TableRows,
} from "@/components/file-picker-import-dialog/mapHeadersToRows";
import type { OnFileImport } from "@/features/home/components/headline-picker";
import { TableContextMenu } from "@/components/virtualized-table/table-context-menu";
import type { ContextMenuPosition } from "@/components/context-menu/context-menu";
import type { Cell, Header, RowData } from "@tanstack/react-table";
import { useContextMenuMethods } from "./useContextMenuMethods";

export type ActiveCell =
	| ({ type: "cell" } & Cell<FilePickerRow, unknown>)
	| ({ type: "header" } & Header<RowData, unknown>);

export type ExtendedContextMenuPosition = ContextMenuPosition & {
	activeCell: ActiveCell;
};

export type VirtualizedTableProps = {
	headers: TableHeaders;
	rows: TableRows;
	onRowsChange: Dispatch<React.SetStateAction<FilePickerRow[]>>;
	originalFilename: string;
	onFileImport: (props: OnFileImport) => void;
	onDataUpdate: (props: { headers: TableHeaders; rows: TableRows }) => void;
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
	//The virtualizer needs to know the scrollable container element
	const tableContainerRef = useRef<HTMLDivElement>(null);

	// rowSelectionMode is boolean value that determines if row selection mode is active
	const [rowSelectionMode, setRowSelectionMode] = useState(false);

	const { height } = useWindowDimensions();
	const { table } = useVirtualizedTable({
		rowSelectionMode,
		rows,
		headers: headers.values,
		onRowsChange,
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

	function handleOnFileImport(e: OnFileImport) {
		setPosition(null);
		props.onFileImport(e);
		setRowSelectionMode(false);
	}

	function handleOnClose() {
		setPosition(null);
	}

	const {
		handleAddColumn,
		handleAddRow,
		handleRemoveColumn,
		handleRemoveRow,
		handleDuplicateRow,
	} = useContextMenuMethods({
		headers,
		tableRows: table.getRowModel().rows,
		position,
		onDataUpdate,
		onClose: handleOnClose,
	});

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
			<TableContextMenu
				position={position}
				onClose={handleOnClose}
				addColumn={handleAddColumn}
				addRow={handleAddRow}
				removeColumn={handleRemoveColumn}
				removeRow={handleRemoveRow}
				duplicateRow={handleDuplicateRow}
			/>
		</>
	);
}
