import type { RefObject } from "react";
import type { Row, Table } from "@tanstack/react-table";
import type { FilePickerRow } from "@/components/file-picker";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TableBodyRow } from "./table-body-row";

type TableBodyProps<T extends Table<FilePickerRow>> = {
	table: T;
	tableContainerRef: RefObject<HTMLDivElement>;
};

export function TableBody<T extends Table<FilePickerRow>>({
	table,
	tableContainerRef,
}: TableBodyProps<T>) {
	const { rows } = table.getRowModel();

	const rowVirtualizer = useTableVirtualizer({ tableContainerRef, rows });

	return (
		<tbody
			className="relative"
			style={{
				height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
			}}
		>
			{rowVirtualizer.getVirtualItems().map((virtualRow, rowIdx) => (
				<TableBodyRow
					virtualRow={virtualRow}
					key={virtualRow.index}
					rows={rows}
					rowVirtualizer={rowVirtualizer}
					rowIdx={rowIdx}
				/>
			))}
		</tbody>
	);
}

function useTableVirtualizer({
	rows,
	tableContainerRef,
}: {
	rows: Row<FilePickerRow>[];
	tableContainerRef: RefObject<HTMLDivElement>;
}) {
	return useVirtualizer({
		count: rows.length,
		estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
		getScrollElement: () => tableContainerRef.current,
		//measure dynamic row height, except in firefox because it measures table border height incorrectly
		measureElement:
			typeof window !== "undefined" &&
			navigator.userAgent.indexOf("Firefox") === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		overscan: 5,
	});
}
