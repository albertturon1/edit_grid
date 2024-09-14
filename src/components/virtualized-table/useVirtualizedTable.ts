import {
	createColumnHelper,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import type { FilePickerRow } from "@/components/file-picker";

const columnHelper = createColumnHelper<FilePickerRow>();

export function useVirtualizedTable<Data extends Record<PropertyKey, string>[]>(
	data: Data,
) {
	const firstElement = data[0] ?? [];

	const columns = useMemo(
		() => [
			columnHelper.accessor("", {
				id: "id",
				cell: ({ row, table }) =>
					(table
						.getSortedRowModel()
						?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
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

function getNoCellSize(dataLenth: number) {
	const baseSize = 23;
	const unitSize = 8;
	const stringifiedLength = dataLenth.toString().length;

	return baseSize + (stringifiedLength - 1) * unitSize;
}
