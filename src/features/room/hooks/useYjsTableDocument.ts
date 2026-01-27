import { useEffect, useState } from "react";
import type * as Y from "yjs";
import type { TableHeaders, TableRow } from "@/lib/imports/types/table";

interface TableState {
  rows: TableRow[];
  headers: TableHeaders;
  filename: string;
  firstRowValues: string[];
}

/**
 * Hook that subscribes to Y.js document changes and returns table state.
 * This hook is Y.js-aware and should only be used in feature layers.
 *
 * @param yjsDoc - Y.js document to observe
 * @returns Current table state (rows, headers, metadata)
 */
export function useYjsTableDocument(yjsDoc: Y.Doc): TableState {
  const [tableState, setTableState] = useState<TableState>({
    rows: [],
    headers: [],
    filename: "",
    firstRowValues: [],
  });

  useEffect(() => {
    const yArray = yjsDoc.getArray<TableRow>("rows");
    const yMetadataMap = yjsDoc.getMap("metadata");

    const update = (e: Y.YArrayEvent<TableRow> | Y.YMapEvent<unknown>) => {
      // Skip local cell updates (handled optimistically in UI)
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

    // Initial state
    update({
      transaction: { local: false, origin: null },
    } as Y.YArrayEvent<TableRow>);

    return () => {
      yArray.unobserve(update);
      yMetadataMap.unobserve(update);
    };
  }, [yjsDoc]);

  return tableState;
}
