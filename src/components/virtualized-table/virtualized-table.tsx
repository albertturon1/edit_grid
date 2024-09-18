import { useRef, type Dispatch } from "react";
import { TableHead } from "@/components/virtualized-table/table-head";
import { TableBody } from "@/components/virtualized-table/table-body";
import { TableManagement } from "@/components/virtualized-table/table-management";
import { useVirtualizedTable } from "@/components/virtualized-table/useVirtualizedTable";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { useWindowDimensions } from "@/lib/useWindowDimensions";

export const VIRTUALIZED_TABLE_STICKY_CLASSES = "sticky left-0 z-10";

type VirtualizedTableProps<Data extends Record<PropertyKey, string>[]> = {
	data: Data;
	onDataChange: Dispatch<React.SetStateAction<Data>>;
	originalFilename: string;
};

export function VirtualizedTable<Data extends Record<PropertyKey, string>[]>({
	data,
	onDataChange,
	originalFilename,
}: VirtualizedTableProps<Data>) {
	const table = useVirtualizedTable(data, onDataChange);
	const { height } = useWindowDimensions();

	//The virtualizer needs to know the scrollable container element
	const tableContainerRef = useRef<HTMLDivElement>(null);

	if (data.length === 0) {
		return null;
	}

	return (
		<div
			className="w-full text-sm"
			style={{
				height: height - NAVBAR_HEIGHT,
				paddingBottom: NAVBAR_HEIGHT, // to keep scrollbar visible
			}}
		>
			<TableManagement table={table} originalFilename={originalFilename} />
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
