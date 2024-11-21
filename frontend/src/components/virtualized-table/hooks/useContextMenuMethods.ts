import type {
	TableHeaders,
	TableRows,
} from "@/components/file-picker-import-dialog/mapHeadersToRows";
import type { ExtendedContextMenuPosition } from "@/components/virtualized-table/virtualized-table";
import { toast } from "@/components/hooks/use-toast";
import type { Row } from "@tanstack/react-table";
import type { FilePickerRow } from "@/features/home/components/headline-file-picker";

type ContextMenuMethodsProps = {
	tableRows: Row<FilePickerRow>[];
	headers: TableHeaders;
	position: ExtendedContextMenuPosition | null;
};

type ContextMenuOperation = (
	headers: TableHeaders,
	position: ExtendedContextMenuPosition,
	tableRows: Row<FilePickerRow>[],
) => { newHeaders: TableHeaders; newRows: TableRows } | null;

// Hook
export function useContextMenuMethods(
	props: ContextMenuMethodsProps & {
		onDataUpdate: (props: { headers: TableHeaders; rows: TableRows }) => void;
		onClose: () => void;
	},
) {
	function handleOperation(operation: ContextMenuOperation) {
		return createContextMenuOperation({
			...props,
			operation,
		});
	}

	return {
		handleAddRow: () => handleOperation(addRow),
		handleAddColumn: () => handleOperation(addColumn),
		handleRemoveRow: () => handleOperation(removeRow),
		handleRemoveColumn: () => handleOperation(removeColumn),
		handleDuplicateRow: () => handleOperation(duplicateRow),
	};
}

export function showCriticalErrorToast() {
	toast({
		title: "CRITICAL ERROR!",
		description: "Please report it to the creator of EditGrid",
		variant: "destructive",
	});
}

function createContextMenuOperation({
	headers,
	onClose,
	onDataUpdate,
	operation,
	position,
	tableRows,
}: {
	operation: ContextMenuOperation;
	headers: TableHeaders;
	position: ExtendedContextMenuPosition | null;
	tableRows: Row<FilePickerRow>[];
	onDataUpdate: (props: { headers: TableHeaders; rows: TableRows }) => void;
	onClose: () => void;
}) {
	if (!position) {
		showCriticalErrorToast();
		return;
	}

	const operationResult = operation(headers, position, tableRows);

	if (!operationResult) {
		showCriticalErrorToast();
		return;
	}

	const { newHeaders, newRows } = operationResult;

	onDataUpdate({
		headers: newHeaders,
		rows: newRows,
	});

	onClose();
}

// Operations
const addRow: ContextMenuOperation = (headers, position, tableRows) => {
	const index =
		position.activeCell.type === "cell" ? position.activeCell.row.index : -1; // setting -1 when using the header to increment it to 0 to add an empty new first line

	const newRowOriginal = headers.values.reduce<TableRows[number]>(
		(acc, header) => {
			acc[header] = "";
			return acc;
		},
		{},
	);

	const newRows = insertNewRow(
		tableRows,
		{ original: newRowOriginal },
		index + 1,
	).map((e) => e.original);

	return {
		newRows,
		newHeaders: headers,
	};
};

const duplicateRow: ContextMenuOperation = (headers, position, tableRows) => {
	if (position.activeCell.type !== "cell") {
		return null;
	}

	const {
		row: { index },
	} = position.activeCell;

	const newRow = tableRows.find((e) => e.index === index);

	if (!newRow) {
		return null;
	}

	const newRows = insertNewRow(tableRows, newRow, index + 1).map(
		(e) => e.original,
	);

	return {
		newRows,
		newHeaders: headers,
	};
};

const addColumn: ContextMenuOperation = (headers, position, tableRows) => {
	const {
		column: { id: columnId },
	} = position.activeCell;
	const { newColumnName, newHeaders } = insertNewHeader(
		headers.values,
		columnId,
	);

	const rowsWithNewColumn = tableRows.map((row) => ({
		...row.original,
		[newColumnName]: "",
	}));

	return {
		newRows: rowsWithNewColumn,
		newHeaders: { isOriginal: headers.isOriginal, values: newHeaders },
	};
};

const removeColumn: ContextMenuOperation = (headers, position, tableRows) => {
	const {
		column: { id: columnId },
	} = position.activeCell;
	const newHeadersValues = headers.values.filter((e) => e !== columnId);
	const newRows = tableRows.map((row) => {
		const copy = structuredClone(row.original);
		delete copy[columnId];
		return copy;
	});

	return {
		newRows,
		newHeaders: { isOriginal: headers.isOriginal, values: newHeadersValues },
	};
};

const removeRow: ContextMenuOperation = (headers, position, tableRows) => {
	if (position.activeCell.type !== "cell") {
		return null;
	}

	const {
		row: { index },
	} = position.activeCell;
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
};

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

type InsertNewRow<T = FilePickerRow> = Pick<Row<T>, "index" | "original">;

function insertNewRow<R extends Pick<InsertNewRow, "original">>(
	rows: (R & { index: number })[],
	newItem: R,
	index: number,
): R[] {
	// Ensure the index is within bounds
	if (index < 0 || index > rows.length) {
		throw new Error("Index out of bounds");
	}

	const highestIndex =
		rows.length > 0 ? Math.max(...rows.map((row) => row.index)) : -1;

	// Add the new item with the highest index + 1
	const newRow = { ...newItem, index: highestIndex + 1 };
	// Insert the new row at the specified position
	rows.splice(index, 0, newRow);

	return rows;
}

if (import.meta.vitest) {
	const { it, expect, describe } = import.meta.vitest;
	type ExampleRow = { firstName: string; lastName: string };

	describe("insertNewRow", () => {
		it("case 1: ", () => {
			const rows: InsertNewRow<ExampleRow>[] = [
				{ index: 0, original: { firstName: "Novak", lastName: "Djoković" } },
				{ index: 1, original: { firstName: "Jannik", lastName: "Sinner" } },
			];
			const newRow: Omit<InsertNewRow<ExampleRow>, "index"> = {
				original: { firstName: "Carlos", lastName: "Alcaraz" },
			};
			const result = insertNewRow(rows, newRow, 1);

			expect(result).toEqual([
				{ index: 0, original: { firstName: "Novak", lastName: "Djoković" } },
				{ index: 2, original: { firstName: "Carlos", lastName: "Alcaraz" } },
				{ index: 1, original: { firstName: "Jannik", lastName: "Sinner" } },
			]);
		});

		it("should handle empty array: ", () => {
			const rows: InsertNewRow<ExampleRow>[] = [];
			const newRow: Omit<InsertNewRow<ExampleRow>, "index"> = {
				original: { firstName: "Carlos", lastName: "Alcaraz" },
			};
			const result = insertNewRow(rows, newRow, 0);

			expect(result).toEqual([
				{ index: 0, original: { firstName: "Carlos", lastName: "Alcaraz" } },
			]);
		});
	});
}
