import type {
	TableHeaders,
	TableRows,
} from "@/components/file-picker-import-dialog/mapHeadersToRows";
import type { ExtendedContextMenuPosition } from "./virtualized-table";
import { toast } from "../hooks/use-toast";
import type { Row } from "@tanstack/react-table";
import type { FilePickerRow } from "@/features/home/components/headline-file-picker";

type ContextMenuMethodsProps = {
	tableRows: Row<FilePickerRow>[];
	headers: TableHeaders;
	position: ExtendedContextMenuPosition;
};

export function useContextMenuMethods({
	headers,
	position,
	tableRows,
	onDataUpdate,
	onClose,
}: Omit<ContextMenuMethodsProps, "position"> & {
	onDataUpdate: (props: {
		headers: TableHeaders;
		rows: TableRows;
	}) => void;
	position: ExtendedContextMenuPosition | null;
	onClose: () => void;
}) {
	function showCriticalToast() {
		toast({
			title: "CRITICAL ERROR!",
			description: "Please report it to the creator of EditGrid",
			variant: "destructive",
		});
	}

	function handleAddRow() {
		if (!position) {
			showCriticalToast();
			return;
		}

		const { newHeaders, newRows } = addRow({
			headers,
			position,
			tableRows,
		});

		onDataUpdate({
			headers: newHeaders,
			rows: newRows,
		});

		onClose();
	}

	function handleAddColumn() {
		if (!position) {
			showCriticalToast();
			return;
		}

		const { newHeaders, newRows } = addColumn({
			headers,
			position,
			tableRows,
		});

		onDataUpdate({
			headers: newHeaders,
			rows: newRows,
		});

		onClose();
	}

	function handleRemoveColumn() {
		if (!position) {
			showCriticalToast();
			return;
		}

		const { newHeaders, newRows } = removeColumn({
			headers,
			position,
			tableRows,
		});

		onDataUpdate({
			headers: newHeaders,
			rows: newRows,
		});

		onClose();
	}

	function handleRemoveRow() {
		if (!position) {
			showCriticalToast();
			return;
		}

		const { newHeaders, newRows } = removeRow({
			headers,
			position,
			tableRows,
		});

		onDataUpdate({
			headers: newHeaders,
			rows: newRows,
		});

		onClose();
	}

	return {
		handleAddColumn,
		handleAddRow,
		handleRemoveColumn,
		handleRemoveRow,
	};
}

function addRow({ tableRows, headers, position }: ContextMenuMethodsProps) {
	const newRow = headers.values.reduce<TableRows[number]>((acc, header) => {
		acc[header] = "";
		return acc;
	}, {});
	const {
		row: { index },
	} = position.cell;

	const rows = tableRows.map((e) => e.original);
	const newRows = insertNewRow(rows, index + 1, newRow);

	return {
		newRows: newRows,
		newHeaders: headers,
	};
}

function addColumn({ tableRows, headers, position }: ContextMenuMethodsProps) {
	const {
		column: { id: columnId },
	} = position.cell;
	const { newColumnName, newHeaders } = insertNewHeader(
		headers.values,
		columnId,
	);

	const rowsWithNewColumn = tableRows.map((row) => {
		return {
			...row.original,
			[newColumnName]: "",
		};
	});

	return {
		newRows: rowsWithNewColumn,
		newHeaders: {
			isOriginal: headers.isOriginal,
			values: newHeaders,
		},
	};
}

function removeColumn({
	tableRows,
	headers,
	position,
}: ContextMenuMethodsProps) {
	const {
		column: { id: columnId },
	} = position.cell;

	const newHeadersValues = headers.values.filter((e) => e !== columnId);
	const newRows = tableRows.map((row) => {
		const copy = structuredClone(row.original);
		delete copy[columnId];

		return copy;
	});

	return {
		newRows,
		newHeaders: {
			isOriginal: headers.isOriginal,
			values: newHeadersValues,
		},
	};
}

function removeRow({ tableRows, headers, position }: ContextMenuMethodsProps) {
	const {
		row: { index },
	} = position.cell;
	const newRows = tableRows.reduce<TableRows>((acc, row) => {
		if (row.index !== index) {
			acc.push(row.original);
		}
		return acc;
	}, []);

	return {
		newRows,
		newHeaders: headers,
	};
}

function insertNewHeader(headers: TableHeaders["values"], columnId: string) {
	// Find the index of the columnId in the headers array
	const index = headers.indexOf(columnId);

	// Start generating new column names with Column1
	let newColumnIndex = 1;
	let newColumnName = `Column${newColumnIndex}`;

	// Ensure the new column name doesn't already exist
	while (headers.includes(newColumnName)) {
		newColumnIndex++;
		newColumnName = `Column${newColumnIndex}`;
	}

	// Create a copy of the headers array and insert the new column
	const newHeaders = [...headers];
	const insertIndex = index === -1 ? 0 : index + 1;

	newHeaders.splice(insertIndex, 0, newColumnName);

	return { newHeaders, newColumnName };
}

function insertNewRow(
	rows: TableRows,
	index: number,
	newItem: TableRows[number],
) {
	// Ensure the index is within bounds
	if (index < 0 || index > rows.length) {
		throw new Error("Index out of bounds");
	}

	// Insert new item at the specified index
	rows.splice(index, 0, newItem);

	// Increment the index property for all elements after the inserted item
	for (let i = index + 1; i < rows.length; i++) {
		const c = rows[i];
		if (!c) {
			throw new Error("Index out of bounds");
		}
	}

	return rows;
}
