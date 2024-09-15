import {
	createColumnHelper,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, type Dispatch } from "react";
import type { FilePickerRow } from "@/components/file-picker";
import { tableDefaultColumn } from "./default-column";

const columnHelper = createColumnHelper<FilePickerRow>();

export const ___INTERNAL_ID_COLUMN_NAME = "___INTERNAL_ID___000";

export function useVirtualizedTable<Data extends Record<PropertyKey, string>[]>(
	data: Data,
	onDataChange: Dispatch<React.SetStateAction<Data>>,
) {
	const firstElement = data[0] ?? [];

	const columns = useMemo(
		() => [
			columnHelper.accessor("0", {
				// rendering 0 to keep the layout stable when no column is visible except the numeric one - should be hidden using CSS
				id: ___INTERNAL_ID_COLUMN_NAME,
				cell: ({ row, table }) => {
					return (
						(table
							.getSortedRowModel()
							?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) +
						1
					);
				},
				size: getNoCellSize(data.length), //starting column size
			}),
			...Object.keys(firstElement).map((header) => {
				return columnHelper.accessor(header, {
					header,
				});
			}),
		],
		[firstElement, data.length],
	);

	const table = useReactTable({
		data,
		columns,
		defaultColumn: tableDefaultColumn,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		columnResizeMode: "onChange",
		enableColumnResizing: true,
		debugTable: true,
		debugHeaders: true,
		debugColumns: true,
		// Provide our updateData function to our table meta
		meta: {
			updateData: (rowIndex, columnId, value) => {
				//@ts-expect-error generic type conversion
				onDataChange((old) => {
					return old.map((row, index) => {
						if (index === rowIndex && typeof value === "string") {
							return {
								...old[rowIndex],
								[columnId]: value,
							};
						}
						return row;
					});
				});
			},
		},
	});

	return table;
}

// function used to determine width of numeral column
function getNoCellSize(dataLength: number) {
	const doublePadding = 17; //px-2 + 1
	const unitSize = 9;
	const stringifiedLength = dataLength.toString().length;

	return doublePadding + stringifiedLength * unitSize;
}
