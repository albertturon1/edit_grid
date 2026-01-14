import { useCallback, useEffect, useRef, useState } from "react";
import type * as Y from "yjs";
import type { FileImportResult } from "@/lib/imports/types/import";
import type { TableHeaders, TableRow } from "@/lib/imports/types/table";
import { documentStore } from "@/lib/stores/documentStore";
import { clearDraft, getDraft } from "@/lib/stores/draftStorage";
import { useTableContextMenu } from "./useTableContextMenu";

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

  const [isResolving, setIsResolving] = useState(!roomId);
  const hasResolvedDraft = useRef(false);

  const contextMenu = useTableContextMenu(yjsDoc);

  // Resolve draft from IndexedDB (only in local mode, only once)
  useEffect(() => {
    if (roomId || hasResolvedDraft.current) {
      setIsResolving(false);
      return;
    }

    async function resolveDraft() {
      try {
        const draft = await getDraft();
        if (draft) {
          const yArray = yjsDoc.getArray<TableRow>("rows");
          const yMetadataMap = yjsDoc.getMap("metadata");

          // Clear existing data and populate from draft
          yArray.delete(0, yArray.length);
          yArray.push(draft.table.rows);

          yMetadataMap.set("headers", draft.table.headers);
          yMetadataMap.set("filename", draft.metadata.filename);
          yMetadataMap.set("firstRowValues", draft.metadata.firstRowValues);

          await clearDraft();
        }
      } finally {
        hasResolvedDraft.current = true;
        setIsResolving(false);
      }
    }

    resolveDraft();
  }, [roomId, yjsDoc]);

  // Initialize observers
  useEffect(() => {
    const setupYjsObservers = () => {
      const yArray = yjsDoc.getArray<TableRow>("rows");
      const yMetadataMap = yjsDoc.getMap("metadata");

      const update = (e: Y.YArrayEvent<TableRow> | Y.YMapEvent<unknown>) => {
        if (e.transaction.local && e.transaction.origin === "cell-update") {
          return;
        }

        const headers = (yMetadataMap.get("headers") as TableHeaders) ?? [];
        const filename = (yMetadataMap.get("filename") as string) ?? "";
        const firstRowValues = (yMetadataMap.get("firstRowValues") as string[]) ?? [];
        const rows = yArray.toArray();

        setTableState({
          rows,
          headers,
          filename,
          firstRowValues,
        });
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

  return {
    isResolving,
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
      contextMenu,
    },
  };
}
