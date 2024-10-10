import {
	createColumnHelper,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type Row,
	type RowSelectionState,
} from "@tanstack/react-table";
import { useMemo, useState, type Dispatch } from "react";
import { tableDefaultColumn } from "@/components/virtualized-table/default-column";
import { TableNumericalCell } from "@/components/virtualized-table/table-numerical-cell";
import { TableNumericalHeader } from "@/components/virtualized-table/table-numerical-header";
import type { FilePickerRow } from "@/features/home/components/headline-file-picker";
import { useWindowDimensions } from "@/lib/useWindowDimensions";

const columnHelper = createColumnHelper<FilePickerRow>();

export const ___INTERNAL_ID_COLUMN_ID = "___INTERNAL_ID___000";
export const ___INTERNAL_ID_COLUMN_NAME = "___000___";

export function useVirtualizedTable({
	headers,
	rows,
	onRowsChange,
}: {
	rows: FilePickerRow[];
	headers: string[];
	onRowsChange: Dispatch<React.SetStateAction<FilePickerRow[]>>;
}) {
	const [anchorRow, setAnchorRow] = useState<Row<FilePickerRow> | null>(null);
	const [isModifierActive, setIsModifierActive] = useState(false);
	const { width: screenWidth } = useWindowDimensions();

	// rowSelection return an object with selected rows as {indexNumber: true} (only for already selected rows)
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	// rowSelectionMode is boolean value that determines if row selection mode is active
	const [rowSelectionMode, setRowSelectionMode] = useState(false);

	const columns = useMemo(() => {
		const headersIds = headers.map((e) => e);
		const mappedHeaders = getMappedHeaders(headersIds);

		return [
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
				size: getNoCellSize({ dataLength: rows.length, screenWidth }), //starting column size
				meta: {
					className: "sticky left-0 w-10", //sticky first column
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

	const table = useReactTable({
		data: rows,
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
				onRowsChange((old) => {
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
function getNoCellSize({
	dataLength,
	screenWidth,
}: { screenWidth: number; dataLength: number }) {
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
	// Move the Map outside of the reduce function to persist counts across iterations
	const headerCount = new Map<string, number>();

	return headersIds.reduce<string[]>((acc, header, index) => {
		let newId = header;

		// If the current element is empty, assign it a name
		if (!newId) {
			newId = `Column${index + 1}`;
		}

		// Check if the header already exists in the map
		if (headerCount.has(newId)) {
			// biome-ignore lint/style/noNonNullAssertion: checked above
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
