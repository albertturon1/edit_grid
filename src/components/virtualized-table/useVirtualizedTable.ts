import {
	createColumnHelper,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import type { FilePickerRow } from "@/components/file-picker";

const columnHelper = createColumnHelper<FilePickerRow>();

export const ___INTERNAL_ID_COLUMN_NAME = "___INTERNAL_ID___000";

export function useVirtualizedTable<Data extends Record<PropertyKey, string>[]>(
	data: Data,
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
					cell: (info) => info.getValue(),
				});
			}),
		],
		[firstElement, data.length],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		columnResizeMode: "onChange",
		enableColumnResizing: true,
		debugTable: true,
		debugHeaders: true,
		debugColumns: true,
	});

	return table;
}

// function used to determine width of numeral column
function getNoCellSize(dataLenth: number) {
	const baseSize = 23;
	const unitSize = 8;
	const stringifiedLength = dataLenth.toString().length;

	return baseSize + (stringifiedLength - 1) * unitSize;
}
