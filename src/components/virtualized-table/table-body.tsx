import type { RefObject } from "react";
import type { Table, Row } from "@tanstack/react-table";
import type { FilePickerRow } from "@/components/file-picker";
import { flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { VIRTUALIZED_TABLE_STICKY_CLASSES } from "@/components/virtualized-table/virtualized-table";

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
			{rowVirtualizer.getVirtualItems().map((virtualRow, rowIdx) => {
				const row = rows[virtualRow.index] as Row<FilePickerRow>;

				const background = rowIdx % 2 === 0 ? "bg-gray-50" : "bg-background"; // from the first row, every second row has a backgroundColor to make the table easier to read

				return (
					<tr
						data-index={virtualRow.index} //needed for dynamic row height measurement
						ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
						key={row.id}
						className={cn(
							"flex absolute w-full border-b border-r",
							background, // needed when no column is selected (none of the <td /> are rendered)
						)}
						style={{
							transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
						}}
					>
						{row.getVisibleCells().map((cell, cellIdx) => {
							return (
								<td
									key={cell.id}
									className={cn(
										"flex overflow-hidden p-0 border-r min-h-[42px]", // min-h-42 to keep stable height when none of the columns is visible (border issues)
										background, // needed to hide elements when scrolling horizontally
										cellIdx === 0
											? cn(
													VIRTUALIZED_TABLE_STICKY_CLASSES,
													"p-2  pt-[9px] flex text-slate-500",
												) // first, sticky cell; pt-[9px] to align with textarea additional border
											: "",
									)}
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
