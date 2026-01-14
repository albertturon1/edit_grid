import { useCallback } from "react";
import type * as Y from "yjs";
import type { TableHeaders, TableRow } from "@/lib/imports/types/table";
import type { ExtendedContextMenuPosition } from "../virtualized-table";

type Position = ExtendedContextMenuPosition | null;

export function useTableContextMenu(yjsDoc: Y.Doc) {
	const addRow = useCallback(
		(position: Position) => {
			if (!position) {
				return;
			}

			const index =
				position?.activeCell.type === "header" // user clicked on the header
					? 0
					: position.activeCell.row.index + 1; // +1 to insert new row below active ceel;

			const yArray = yjsDoc.getArray<TableRow>("rows");
			const yMetadataMap = yjsDoc.getMap<TableHeaders>("metadata");
			const headers = yMetadataMap.get("headers") ?? [];

			const newRow = headers.reduce<TableRow>((acc, header) => {
				acc[header] = "";
				return acc;
			}, {});

			yArray.insert(index, [newRow]);
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
			const yMetadataMap = yjsDoc.getMap<TableHeaders>("metadata");
			const headers = yMetadataMap.get("headers") ?? [];

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
			const yMetadataMap = yjsDoc.getMap<TableHeaders>("metadata");
			const headers = yMetadataMap.get("headers") ?? [];

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
		addRow,
		addColumn,
		removeRow,
		removeColumn,
		duplicateRow,
	};
}
