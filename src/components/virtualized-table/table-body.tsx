import type { RefObject } from "react";
import type { Table, Row } from "@tanstack/react-table";
import type { FilePickerRow } from "@/components/file-picker";
import { flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import cx from "clsx";
import {
	VIRTUALIZED_TABLE_CELL_CLASSES,
	VIRTUALIZED_TABLE_STICKY_CLASSES,
} from "@/components/virtualized-table/virtualized-table";

// biome-ignore lint/suspicious/noExplicitAny: generic
type TableBodyProps<T extends Table<any>> = {
	table: T;
	tableContainerRef: RefObject<HTMLDivElement>;
};

// biome-ignore lint/suspicious/noExplicitAny: generic
export function TableBody<T extends Table<any>>({
	table,
	tableContainerRef,
}: TableBodyProps<T>) {
	const { rows } = table.getRowModel();

	const rowVirtualizer = useVirtualizer({
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

	return (
		<tbody
			className="relative"
			style={{
				height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
			}}
		>
			{rowVirtualizer.getVirtualItems().map((virtualRow) => {
				const row = rows[virtualRow.index] as Row<FilePickerRow>;

				return (
					<tr
						data-index={virtualRow.index} //needed for dynamic row height measurement
						ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
						key={row.id}
						className="flex absolute w-full"
						style={{
							transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
						}}
					>
						{row.getVisibleCells().map((cell, idx) => {
							return (
								<td
									className={cx(
										"flex items-center border-b border-r bg-background overflow-hidden py-1",
										VIRTUALIZED_TABLE_CELL_CLASSES,
										idx === 0 ? VIRTUALIZED_TABLE_STICKY_CLASSES : "",
									)}
									key={cell.id}
									style={{
										width: cell.column.getSize(),
									}}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							);
						})}
					</tr>
				);
			})}
		</tbody>
	);
}
