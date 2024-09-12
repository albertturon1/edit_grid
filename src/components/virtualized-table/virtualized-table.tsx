import { useRef } from "react";
import { TableHead } from "@/components/virtualized-table/table-head";
import { TableBody } from "@/components/virtualized-table/table-body";
import { useVirtualizedTable } from "@/components/virtualized-table/useVirtualizedTable";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { useWindowDimensions } from "@/lib/useWindowDimensions";

export const VIRTUALIZED_TABLE_STICKY_CLASSES =
	"sticky left-0 z-10 bg-background";
export const VIRTUALIZED_TABLE_CELL_CLASSES = "flex pl-1.5 items-center";

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
			}}
		>
			{/* 
				overflow-auto - scrollable table container
				relative - needed for sticky header
			*/}
			<div className="overflow-auto relative h-full" ref={tableContainerRef}>
				{/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
				<table className="tabular-nums w-full border-slate-500">
					<TableHead table={table} />
					<TableBody table={table} tableContainerRef={tableContainerRef} />
				</table>
			</div>
		</div>
	);
}
