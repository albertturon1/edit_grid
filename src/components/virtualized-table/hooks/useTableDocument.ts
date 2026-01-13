import { useCallback, useEffect, useState } from "react";
import type * as Y from "yjs";
import type { FileImportResult } from "@/lib/imports/types/import";
import type { TableHeaders, TableRow } from "@/lib/imports/types/table";
import { documentStore } from "@/lib/stores/documentStore";
import type { ExtendedContextMenuPosition } from "../virtualized-table";

type Position = ExtendedContextMenuPosition | null;

interface TableState {
	rows: TableRow[];
	headers: TableHeaders;
	filename: string;
	firstRowValues: string[];
}

export function useTableDocument(roomId: string | undefined) {
	const yjsDoc = documentStore.getActiveDoc(roomId);

	const [tableState, setTableState] = useState<TableState>({
		rows: [],
		headers: [],
		filename: "",
		firstRowValues: [],
	});

	// Initialize observers
	useEffect(() => {
		const setupYjsObservers = () => {
			const yArray = yjsDoc.getArray<TableRow>("rows");
			const yMetadataMap = yjsDoc.getMap("metadata");

			const update = (e: Y.YArrayEvent<TableRow> | Y.YMapEvent<unknown>) => {
				updateState(e, yArray, yMetadataMap, setTableState);
			};

			yArray.observe(update);
			yMetadataMap.observe(update);

			return () => {
				yArray.unobserve(update);
				yMetadataMap.unobserve(update);
			};
		};

		const cleanup = setupYjsObservers();
		return cleanup;
	}, [yjsDoc]);

	// populateData - ALWAYS works with Y.js documents (local and collaborative)
	const populateData = useCallback(
		(importResult: FileImportResult) => {
			const { table, metadata } = importResult;

			const yArray = yjsDoc.getArray<TableRow>("rows");
			const yMetadataMap = yjsDoc.getMap("metadata");

			// Clear and populate rows
			yArray.delete(0, yArray.length);
			yArray.push(table.rows);

			// Set metadata (headers, filename, firstRowValues)
			yMetadataMap.set("headers", table.headers);
			yMetadataMap.set("filename", metadata.filename);
			yMetadataMap.set("firstRowValues", metadata.firstRowValues);
		},
		[yjsDoc],
	);

	const updateData = useCallback(
		(rowIndex: number, colId: string, value: string) => {
			const yArray = yjsDoc.getArray<TableRow>("rows");
			const rows = yArray.toArray();
			if (rows[rowIndex]) {
				const updatedRow = { ...rows[rowIndex], [colId]: value };
				yArray.doc?.transact(() => {
					yArray.delete(rowIndex, 1);
					yArray.insert(rowIndex, [updatedRow]);
				}, "cell-update");
			}
		},
		[yjsDoc],
	);

	const addRow = useCallback(
		(position: Position) => {
			if (position?.activeCell.type !== "cell") {
				return;
			}

			const afterIndex = position.activeCell.row.index;

			const yArray = yjsDoc.getArray<TableRow>("rows");
			const yMetadataMap = yjsDoc.getMap("metadata");
			const headers = (yMetadataMap.get("headers") as TableHeaders) ?? [];

			const newRow = headers.reduce<TableRow>((acc, header) => {
				acc[header] = "";
				return acc;
			}, {});

			yArray.insert(afterIndex + 1, [newRow]);
		},
		[yjsDoc],
	);

	const addColumn = useCallback(
		(position: Position) => {
			if (!position) {
				return;
			}

			const afterColumnId = position.activeCell.column.id;
			const yArray = yjsDoc.getArray<TableRow>("rows");
			const yMetadataMap = yjsDoc.getMap("metadata");
			const headers = (yMetadataMap.get("headers") as TableHeaders) ?? [];

			// Generate new column name
			let newColumnName = "Column1";
			let columnIndex = 1;
			while (headers.includes(newColumnName)) {
				columnIndex++;
				newColumnName = `Column${columnIndex}`;
			}

			// Find insertion index
			const index = headers.indexOf(afterColumnId);
			const insertIndex = index === -1 ? headers.length : index + 1;

			// Update headers
			const newHeaders = [...headers];
			newHeaders.splice(insertIndex, 0, newColumnName);
			yMetadataMap.set("headers", newHeaders);

			// Update all rows to include new column
			const rows = yArray.toArray();
			yArray.delete(0, rows.length);
			const updatedRows = rows.map((row) => ({
				...row,
				[newColumnName]: "",
			}));
			yArray.push(updatedRows);
		},
		[yjsDoc],
	);

	const removeRow = useCallback(
		(position: Position) => {
			if (position?.activeCell.type !== "cell") {
				return;
			}

			const index = position.activeCell.row.index;

			const yArray = yjsDoc.getArray<TableRow>("rows");
			if (index >= 0 && index < yArray.length) {
				yArray.delete(index, 1);
			}
		},
		[yjsDoc],
	);

	const removeColumn = useCallback(
		(position: Position) => {
			if (!position) {
				return;
			}
			const columnId = position.activeCell.column.id;
			const yArray = yjsDoc.getArray<TableRow>("rows");
			const yMetadataMap = yjsDoc.getMap("metadata");
			const headers = (yMetadataMap.get("headers") as TableHeaders) ?? [];

			// Update headers
			const newHeaders = headers.filter((h) => h !== columnId);
			yMetadataMap.set("headers", newHeaders);

			// Update all rows to remove column
			const rows = yArray.toArray();
			yArray.delete(0, rows.length);
			const updatedRows = rows.map((row) => {
				const newRow = { ...row };
				delete newRow[columnId];
				return newRow;
			});
			yArray.push(updatedRows);
		},
		[yjsDoc],
	);

	const duplicateRow = useCallback(
		(position: Position) => {
			if (position?.activeCell.type !== "cell") {
				return;
			}

			const index = position.activeCell.row.index;

			const yArray = yjsDoc.getArray<TableRow>("rows");
			const rows = yArray.toArray();
			if (rows[index]) {
				const rowToDuplicate = { ...rows[index] };
				yArray.insert(index + 1, [rowToDuplicate]);
			}
		},
		[yjsDoc],
	);

	return {
		tabledata: {
			headers: tableState.headers,
			rows: tableState.rows,
		},
		metadata: {
			filename: tableState.filename,
			firstRowValues: tableState.firstRowValues,
		},
		populateData,
		meta: {
			updateData,
			contextMenu: {
				addRow,
				addColumn,
				removeRow,
				removeColumn,
				duplicateRow,
			},
		},
	};
}

const updateState = (
	event: Y.YArrayEvent<TableRow> | Y.YMapEvent<unknown>,
	yArray: Y.Array<TableRow>,
	yMetadataMap: Y.Map<unknown>,
	onUpdate: (state: TableState) => void,
) => {
	if (event.transaction.local && event.transaction.origin === "cell-update") {
		return;
	}

	const headers = (yMetadataMap.get("headers") as TableHeaders) ?? [];
	const filename = (yMetadataMap.get("filename") as string) ?? "";
	const firstRowValues = (yMetadataMap.get("firstRowValues") as string[]) ?? [];
	const rows = yArray.toArray();

	onUpdate({
		rows,
		headers,
		filename,
		firstRowValues,
	});
};
