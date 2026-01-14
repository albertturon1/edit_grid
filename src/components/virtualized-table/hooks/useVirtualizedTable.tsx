import {
	createColumnHelper,
	getCoreRowModel,
	getSortedRowModel,
	type Row,
	type RowSelectionState,
	type TableMeta,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { tableDefaultColumn } from "@/components/virtualized-table/default-column";
import { TableNumericalCell } from "@/components/virtualized-table/table-numerical-cell";
import { TableNumericalHeader } from "@/components/virtualized-table/table-numerical-header";
import type { TableData, TableRow } from "@/lib/imports/types/table";

const columnHelper = createColumnHelper<TableRow>();

export const ___INTERNAL_ID_COLUMN_ID = "___INTERNAL_ID___000";
export const ___INTERNAL_ID_COLUMN_NAME = "___000___";

interface UseVirtualizedTableProps {
	tabledata: TableData;
	meta: TableMeta;
}

export function useVirtualizedTable({
	tabledata,
	meta,
}: UseVirtualizedTableProps) {
	const [anchorRow, setAnchorRow] = useState<Row<TableRow> | null>(null);
	const [isModifierActive, setIsModifierActive] = useState(false);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const { width: screenWidth } = useWindowSize();

	const { headers, rows } = tabledata;

	const columns = useMemo(() => {
		const headersIds = headers.map((e) => e);
		const mappedHeaders = getMappedHeaders(headersIds);

		return [
			columnHelper.accessor(___INTERNAL_ID_COLUMN_NAME, {
				id: ___INTERNAL_ID_COLUMN_ID,
				header: () => <TableNumericalHeader />,
				cell: (props) => (
					<TableNumericalCell
						{...props}
						anchorRow={anchorRow}
						onAnchorRowChange={setAnchorRow}
						isModifierActive={isModifierActive}
						onModifierStateChange={setIsModifierActive}
					/>
				),
				size: getNoCellSize({ dataLength: rows.length, screenWidth }),
				meta: {
					className: "sticky left-0 w-10",
				},
			}),
			...mappedHeaders.map((header) => {
				return columnHelper.accessor(header, {
					header,
				});
			}),
		];
	}, [headers, rows.length, anchorRow, isModifierActive, screenWidth]);

	const reactTable = useReactTable<TableRow>({
		data: rows,
		columns,
		defaultColumn: tableDefaultColumn,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		columnResizeMode: "onChange",
		enableColumnResizing: true,
		debugTable: false,
		debugHeaders: false,
		debugColumns: false,
		onRowSelectionChange: setRowSelection,
		state: {
			rowSelection,
			columnOrder: [___INTERNAL_ID_COLUMN_ID, ...headers],
		},
		meta,
	});

	return reactTable;
}

function getNoCellSize({
	dataLength,
	screenWidth,
}: {
	screenWidth: number;
	dataLength: number;
}) {
	const doublePadding = 17; //px-2 + 1
	const checkboxWidth = 24; // 16 + padding
	const unitSize = 9;
	const stringifiedLength = dataLength.toString().length;

	const multi = screenWidth > 640 ? 1 : 0.83; //calculating multiplier for different font sizes. For sm break point

	const baseWidth =
		doublePadding + checkboxWidth + (stringifiedLength + 1) * unitSize;

	return baseWidth * multi;
}

function getMappedHeaders(headersIds: string[]) {
	const headerCount = new Map<string, number>();

	return headersIds.reduce<string[]>((acc, header, index) => {
		let newId = header;

		if (!newId) {
			newId = `Column${index + 1}`;
		}
		const count = headerCount.get(newId);
		if (count !== undefined) {
			const newCount = count + 1;
			headerCount.set(newId, newCount);
			newId = `${newId}_${newCount}`;
		} else {
			headerCount.set(newId, 1);
		}

		acc.push(newId);
		return acc;
	}, []);
}
