import { useCallback } from "react";
import type * as Y from "yjs";
import type { FileImportResult } from "@/lib/imports/types/import";
import type { TableRow } from "@/lib/imports/types/table";

export function useYjsPopulateData(yjsDoc: Y.Doc) {
  const populateData = useCallback(
    (importResult: FileImportResult) => {
      const { table, metadata } = importResult;

      const yArray = yjsDoc.getArray<TableRow>("rows");
      const yMetadataMap = yjsDoc.getMap("metadata");

      yArray.delete(0, yArray.length);
      yArray.push(table.rows);

      yMetadataMap.set("headers", table.headers);
      yMetadataMap.set("filename", metadata.filename);
      yMetadataMap.set("firstRowValues", metadata.firstRowValues);
    },
    [yjsDoc],
  );

  return { populateData };
}
