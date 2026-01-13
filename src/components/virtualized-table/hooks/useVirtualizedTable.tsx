import { useMemo, useState } from "react";
import {
	createColumnHelper,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type Row,
	type RowSelectionState,
} from "@tanstack/react-table";
import { tableDefaultColumn } from "@/components/virtualized-table/default-column";
import { TableNumericalCell } from "@/components/virtualized-table/table-numerical-cell";
import { TableNumericalHeader } from "@/components/virtualized-table/table-numerical-header";
import type { TableData, TableRow } from "@/lib/imports/types/table";
import type { ExtendedContextMenuPosition } from "@/components/virtualized-table/virtualized-table";
import { useWindowSize } from "usehooks-ts";

const columnHelper = createColumnHelper<TableRow>();

export const ___INTERNAL_ID_COLUMN_ID = "___INTERNAL_ID___000";
export const ___INTERNAL_ID_COLUMN_NAME = "___000___";

export interface Callbacks {
	updateCell?: (rowIndex: number, columnId: string, value: string) => void;
	addRow?: (afterIndex: number) => void;
	addColumn?: (afterColumnId: string) => void;
	removeRow?: (index: number) => void;
	removeColumn?: (columnId: string) => void;
	duplicateRow?: (index: number) => void;
}

interface UseVirtualizedTableProps extends Callbacks {
	data: TableData;
	rowSelectionMode: boolean;
}

export function useVirtualizedTable({
	data,
	rowSelectionMode,
	updateCell,
	addRow,
	addColumn,
	removeRow,
	removeColumn,
	duplicateRow,
}: UseVirtualizedTableProps) {
	const [anchorRow, setAnchorRow] = useState<Row<TableRow> | null>(null);
	const [isModifierActive, setIsModifierActive] = useState(false);
	const { width: screenWidth } = useWindowSize();
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const { headers, rows } = data;

	const columns = useMemo(() => {
		const headersIds = headers.map((e) => e);
		const mappedHeaders = getMappedHeaders(headersIds);

		return [
			columnHelper.accessor(___INTERNAL_ID_COLUMN_NAME, {
				id: ___INTERNAL_ID_COLUMN_ID,
				header: (props) => (
					<TableNumericalHeader
						{...props}
						rowSelectionMode={rowSelectionMode}
					/>
				),
				cell: (props) => (
					<TableNumericalCell
						{...props}
						anchorRow={anchorRow}
						onAnchorRowChange={setAnchorRow}
						isModifierActive={isModifierActive}
						onModifierStateChange={setIsModifierActive}
						rowSelectionMode={rowSelectionMode}
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
	}, [
		headers,
		rows.length,
		anchorRow,
		isModifierActive,
		rowSelectionMode,
		screenWidth,
	]);

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
		meta: {
			updateCell,
			addRow: (position: ExtendedContextMenuPosition | null) => {
				if (!position || !addRow) {
					return;
				}
				const index =
					position.activeCell.type === "cell"
						? position.activeCell.row.index
						: -1;

				addRow(index);
			},
			addColumn: (position: ExtendedContextMenuPosition | null) => {
				if (!position || !addColumn) {
					return;
				}
				const columnId = position.activeCell.column.id;
				addColumn(columnId);
			},
			removeRow: (position: ExtendedContextMenuPosition | null) => {
				if (position?.activeCell.type !== "cell" || !removeRow) {
					return;
				}

				const index = position.activeCell.row.index;
				removeRow(index);
			},
			removeColumn: (position: ExtendedContextMenuPosition | null) => {
				if (!position || !removeColumn) {
					return;
				}
				const columnId = position.activeCell.column.id;
				removeColumn(columnId);
			},
			duplicateRow: (position: ExtendedContextMenuPosition | null) => {
				if (position?.activeCell.type !== "cell" || !duplicateRow) {
					return;
				}

				const index = position.activeCell.row.index;
				duplicateRow(index);
			},
		},
	});

	return { table: reactTable, anchorRow };
}

function getNoCellSize({
	dataLength,
	screenWidth,
}: {
	screenWidth: number;
	dataLength: number;
}) {
	const doublePadding = 17;
	const checkboxWidth = 24;
	const unitSize = 9;
	const stringifiedLength = dataLength.toString().length;

	const multi = screenWidth > 640 ? 1 : 0.83;

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

		if (headerCount.has(newId)) {
			const count = headerCount.get(newId)! + 1;
			headerCount.set(newId, count);
			newId = `${newId}_${count}`;
		} else {
			headerCount.set(newId, 1);
		}

		acc.push(newId);
		return acc;
	}, []);
}
