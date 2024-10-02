import { useRef, type Dispatch } from "react";
import { TableHead } from "@/components/virtualized-table/table-head";
import { TableBody } from "@/components/virtualized-table/table-body";
import { TableManagement } from "@/components/virtualized-table/table-management";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { useWindowDimensions } from "@/lib/useWindowDimensions";
import { useVirtualizedTable } from "@/components/virtualized-table/hooks/useVirtualizedTable";
import type { FilePickerRow } from "@/features/home/components/filepicker/file-picker";
import type {
	TableHeaders,
	TableRows,
} from "@/features/home/utils/mapHeadersToRows";

export const VIRTUALIZED_TABLE_STICKY_CLASSES = "sticky left-0 z-10";

type VirtualizedTableProps = {
	headers: TableHeaders;
	rows: TableRows;
	onRowsChange: Dispatch<React.SetStateAction<FilePickerRow[]>>;
	originalFilename: string;
};

export function VirtualizedTable({
	rows,
	headers,
	onRowsChange,
	originalFilename,
}: VirtualizedTableProps) {
	//The virtualizer needs to know the scrollable container element
	const tableContainerRef = useRef<HTMLDivElement>(null);

	const { height } = useWindowDimensions();
	const { table, rowSelectionMode, setRowSelectionMode } = useVirtualizedTable({
		rows,
		headers: headers.values,
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
				table={table}
				originalFilename={originalFilename}
				rowSelectionMode={rowSelectionMode}
				onRowSelectionModeChange={setRowSelectionMode}
				headers={headers}
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
