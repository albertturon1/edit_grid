import { useEffect, useState, type RefObject } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
	TableBodyRow,
	type TableBodyRowProps,
} from "@/components/virtualized-table/table-body-row";

type TableBodyProps = Pick<TableBodyRowProps, "rows" | "onContextMenu"> & {
	tableContainerRef: RefObject<HTMLDivElement>;
};

export function TableBody({ tableContainerRef, ...props }: TableBodyProps) {
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);

		return () => {
			setIsMounted(false);
		};
	}, []);

	const rowVirtualizer = useVirtualizer({
		count: props.rows.length,
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
					{...props}
					key={virtualRow.index}
					virtualRow={virtualRow}
					rowVirtualizer={rowVirtualizer}
					rowIdx={rowIdx}
				/>
			))}
		</tbody>
	);
}
