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

	// rowSelectionMode is boolean value that determines if row selection mode is active
	const [rowSelectionMode, setRowSelectionMode] = useState(false);

	const { height } = useWindowDimensions();
	const { table } = useVirtualizedTable({
		rowSelectionMode,
		rows,
		headers: props.headers.values,
		onRowsChange,
	});

	return (
		<div
			className="w-full text-sm"
			style={{
				height: height - NAVBAR_HEIGHT,
				paddingBottom: NAVBAR_HEIGHT, // to keep scrollbar visible
			}}
		>
			<TableManagement
				{...props}
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
				<table className="tabular-nums bg-background grid">
					<TableHead table={table} />
					<TableBody table={table} tableContainerRef={tableContainerRef} />
				</table>
			</div>
		</div>
	);
}
