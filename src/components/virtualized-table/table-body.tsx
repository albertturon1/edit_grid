import { useEffect, useState, type RefObject } from "react";
import type { Row } from "@tanstack/react-table";
import type { FilePickerRow } from "@/features/home/components/headline-file-picker";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TableBodyRow } from "@/components/virtualized-table/table-body-row";

type TableBodyProps = {
	rows: Row<FilePickerRow>[];
	tableContainerRef: RefObject<HTMLDivElement>;
};

export function TableBody({ rows, tableContainerRef }: TableBodyProps) {
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);

		return () => {
			setIsMounted(false);
		};
	}, []);

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		estimateSize: () => 60, //estimate row height for accurate scrollbar dragging
		getScrollElement: () => tableContainerRef.current,
		//measure dynamic row height, except in firefox because it measures table border height incorrectly
		measureElement:
			typeof window !== "undefined" &&
			navigator.userAgent.indexOf("Firefox") === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		overscan: 10,
	});

	if (!isMounted) {
		return null;
	} // Wait for client-side rendering

	return (
		<tbody
			className="relative grid"
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
