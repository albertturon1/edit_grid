import { useRef, useState, type Dispatch, type MouseEvent } from "react";
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
import { useOnClickOutside } from "@/lib/useOnClickOutside";
import { TableContextMenu } from "@/components/virtualized-table/table-context-menu";
import { useContextMenuPosition } from "../context-menu/useContextMenuPosition";

type VirtualizedTableProps = {
	headers: TableHeaders;
	rows: TableRows;
	onRowsChange: Dispatch<React.SetStateAction<FilePickerRow[]>>;
	originalFilename: string;
	onFileImport: (props: OnFileImport) => void;
};

export function VirtualizedTable({
	rows,
	onRowsChange,
	...props
}: VirtualizedTableProps) {
	//The virtualizer needs to know the scrollable container element
	const tableContainerRef = useRef<HTMLDivElement>(null);
	const [contextOpen, setContextOpen] = useState(false);

	// rowSelectionMode is boolean value that determines if row selection mode is active
	const [rowSelectionMode, setRowSelectionMode] = useState(false);

	const { height } = useWindowDimensions();
	const { table } = useVirtualizedTable({
		rowSelectionMode,
		rows,
		headers: props.headers.values,
		onRowsChange,
	});

	useOnClickOutside(tableContainerRef, () => {
		setContextOpen(false);
	});

	const position = useContextMenuPosition();

	function handleOnContextMenu(e: MouseEvent<HTMLTableElement>) {
		e.preventDefault();
		setContextOpen(true);
	}

	function handleOnFileImport(e: OnFileImport) {
		setContextOpen(false);
		props.onFileImport(e);
		setRowSelectionMode(false);
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
						onContextMenu={handleOnContextMenu}
						className="tabular-nums bg-background grid"
					>
						<TableHead headerGroups={table.getHeaderGroups()} />
						<TableBody
							rows={table.getRowModel().rows}
							tableContainerRef={tableContainerRef}
						/>
					</table>
				</div>
			</div>
			<TableContextMenu
				open={contextOpen}
				onOpenChange={setContextOpen}
				position={position}
			/>
		</>
	);
}
