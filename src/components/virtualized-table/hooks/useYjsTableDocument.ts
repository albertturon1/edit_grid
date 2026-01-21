import { useEffect, useState } from "react";
import type * as Y from "yjs";
import type { TableHeaders, TableRow, TableData } from "@/lib/imports/types/table";
import type { TableSourceMetadata } from "@/lib/table/types";

interface TableState {
  headers: TableHeaders;
  rows: TableRow[];
  filename: string;
  firstRowValues: string[];
}

export function useYjsTableDocument(yjsDoc: Y.Doc) {
  const [tableState, setTableState] = useState<TableState>({
    headers: [],
    rows: [],
    filename: "",
    firstRowValues: [],
  });

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
          headers,
          rows,
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

  const data: TableData = {
    headers: tableState.headers,
    rows: tableState.rows,
  };

  const metadata: TableSourceMetadata = {
    filename: tableState.filename,
    firstRowValues: tableState.firstRowValues,
  };

  const isLoading =
    tableState.rows.length === 0 && tableState.headers.length === 0 && tableState.filename === "";

  return { data, metadata, isLoading };
}
