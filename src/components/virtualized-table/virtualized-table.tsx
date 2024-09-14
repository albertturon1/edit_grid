import { useRef } from "react";
import { TableHead } from "@/components/virtualized-table/table-head";
import { TableBody } from "@/components/virtualized-table/table-body";
import { TableManagement } from "@/components/virtualized-table/table-management";
import { useVirtualizedTable } from "@/components/virtualized-table/useVirtualizedTable";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { useWindowDimensions } from "@/lib/useWindowDimensions";

export const VIRTUALIZED_TABLE_STICKY_CLASSES =
	"sticky left-0 z-10 bg-background";
export const VIRTUALIZED_TABLE_CELL_CLASSES = "flex pl-1.5";

type VirtualizedTableProps<Data extends Record<PropertyKey, string>[]> = {
	data: Data;
};

export function VirtualizedTable<Data extends Record<PropertyKey, string>[]>({
	data,
}: VirtualizedTableProps<Data>) {
	const table = useVirtualizedTable(data);
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
			<TableManagement table={table} />
			{/* 
				overflow-auto - scrollable table container
				relative - needed for sticky header
				*/}
			<div
				className="overflow-auto relative h-full mx-2 border rounded"
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
