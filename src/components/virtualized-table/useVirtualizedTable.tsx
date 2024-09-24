import {
	createColumnHelper,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type Row,
	type RowSelectionState,
} from "@tanstack/react-table";
import { useMemo, useState, type Dispatch } from "react";
import type { FilePickerRow } from "@/components/file-picker";
import { tableDefaultColumn } from "./default-column";
import { TableNumericalCell } from "./table-numerical-cell";
import { TableNumericalHeader } from "./table-numerical-header";

const columnHelper = createColumnHelper<FilePickerRow>();

export const ___INTERNAL_ID_COLUMN_ID = "___INTERNAL_ID___000";
export const ___INTERNAL_ID_COLUMN_NAME = "___000___";

export function useVirtualizedTable<Data extends Record<PropertyKey, string>[]>(
	data: Data,
	onDataChange: Dispatch<React.SetStateAction<Data>>,
) {
	const [anchorRow, setAnchorRow] = useState<Row<FilePickerRow> | null>(null);
	const [isModifierActive, setIsModifierActive] = useState(false);

	// rowSelection return an object with selected rows as {indexNumber: true} (only for already selected rows)
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	// rowSelectionMode is boolean value that determines if row selection mode is active
	const [rowSelectionMode, setRowSelectionMode] = useState(false);

	const firstElement = useMemo(() => ({ ...(data[0] ?? {}) }), [data[0]]);

	const columns = useMemo(
		() => [
			columnHelper.accessor(___INTERNAL_ID_COLUMN_NAME, {
				// rendering 0 to keep the layout stable when no column is visible except the numeric one - should be hidden using CSS
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
				size: getNoCellSize(data.length), //starting column size
				meta: {
					className: "sticky left-0", //sticky first column
				},
			}),
			...Object.keys(firstElement).map((header) => {
				return columnHelper.accessor(header, {
					header,
				});
			}),
		],
		[firstElement, data.length, anchorRow, isModifierActive, rowSelectionMode],
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
		onRowSelectionChange: setRowSelection, //hoist up the row selection state to your own scope
		state: {
			rowSelection, //pass the row selection state back to the table instance
		},
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

	return { table, anchorRow, rowSelectionMode, setRowSelectionMode };
}

// function used to determine width of numeral column
function getNoCellSize(dataLength: number) {
	const doublePadding = 17; //px-2 + 1
	const checkboxWidth = 24; // 16 + padding
	const unitSize = 9;
	const stringifiedLength = dataLength.toString().length;

	return doublePadding + checkboxWidth + stringifiedLength * unitSize;
}
