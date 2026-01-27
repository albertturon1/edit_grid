import { useCallback } from "react";
import type * as Y from "yjs";
import type { TableHeaders, TableRow } from "@/lib/imports/types/table";
import type { TableMutations } from "@/lib/table/types";

/**
 * Hook that creates Y.js-backed mutations for table operations.
 * Returns TableMutations interface with simple arguments (no Position objects).
 *
 * @param yjsDoc - Y.js document to mutate
 * @returns TableMutations object for cell, row, and column operations
 */
export function useYjsMutations(yjsDoc: Y.Doc): TableMutations {
  const updateCell = useCallback(
    (rowIndex: number, columnId: string, value: string) => {
      const yArray = yjsDoc.getArray<TableRow>("rows");
      const rows = yArray.toArray();
      if (rows[rowIndex]) {
        const updatedRow = { ...rows[rowIndex], [columnId]: value };
        yArray.doc?.transact(() => {
          yArray.delete(rowIndex, 1);
          yArray.insert(rowIndex, [updatedRow]);
        }, "cell-update");
      }
    },
    [yjsDoc],
  );

  const addRow = useCallback(
    (atIndex: number) => {
      const yArray = yjsDoc.getArray<TableRow>("rows");
      const yMetadataMap = yjsDoc.getMap<TableHeaders>("metadata");
      const headers = yMetadataMap.get("headers") ?? [];

      const newRow = headers.reduce<TableRow>((acc, header) => {
        acc[header] = "";
        return acc;
      }, {});

      yArray.insert(atIndex, [newRow]);
    },
    [yjsDoc],
  );

  const removeRow = useCallback(
    (index: number) => {
      const yArray = yjsDoc.getArray<TableRow>("rows");
      if (index >= 0 && index < yArray.length) {
        yArray.delete(index, 1);
      }
    },
    [yjsDoc],
  );

  const duplicateRow = useCallback(
    (index: number) => {
      const yArray = yjsDoc.getArray<TableRow>("rows");
      const rows = yArray.toArray();
      if (rows[index]) {
        const rowToDuplicate = { ...rows[index] };
        yArray.insert(index + 1, [rowToDuplicate]);
      }
    },
    [yjsDoc],
  );

  const addColumn = useCallback(
    (afterColumnId: string) => {
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

  const removeColumn = useCallback(
    (columnId: string) => {
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

  return {
    updateCell,
    rows: {
      add: addRow,
      remove: removeRow,
      duplicate: duplicateRow,
    },
    columns: {
      add: addColumn,
      remove: removeColumn,
    },
  };
}
