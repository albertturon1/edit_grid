import { useEffect, useRef } from "react";
import type * as Y from "yjs";
import type { ConnectionStatus } from "@/hooks/useCollaboration";
import { parseFile } from "@/lib/imports";
import { normalizeRawTableData } from "@/lib/imports/transformers/normalizeRawTableData";
import type { TableRow } from "@/lib/imports/types/table";

const PLAYGROUND_CSV_PATH = "/customers-1000.csv";

/**
 * Hook that initializes the playground Y.js document from CSV if empty.
 * Runs once when connected and document is empty.
 * Y.js CRDT handles race conditions when multiple users connect simultaneously.
 *
 * @param yjsDoc - Y.js document to populate
 * @param connectionStatus - Current connection status
 */
export function usePlaygroundSync(yjsDoc: Y.Doc, connectionStatus: ConnectionStatus) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (connectionStatus !== "connected" || hasInitialized.current) {
      return;
    }

    const rows = yjsDoc.getArray<TableRow>("rows");

    // Only initialize if empty - first client loads data
    if (rows.length === 0) {
      hasInitialized.current = true;

      void (async () => {
        try {
          const response = await fetch(PLAYGROUND_CSV_PATH);
          if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.status}`);
          }

          const blob = await response.blob();
          const file = new File([blob], "customers-1000.csv", { type: "text/csv" });

          const parsed = await parseFile(file);
          if (!parsed.success) {
            throw new Error("Failed to parse playground CSV");
          }

          const normalized = normalizeRawTableData(parsed.data, {
            firstRowAsHeaders: true,
          });

          if (!normalized) {
            throw new Error("Failed to normalize playground CSV data");
          }

          const yArray = yjsDoc.getArray<TableRow>("rows");
          const yMetadataMap = yjsDoc.getMap("metadata");

          // Check again in case another client populated while we were fetching
          if (yArray.length > 0) {
            return;
          }

          yjsDoc.transact(() => {
            yArray.delete(0, yArray.length);
            yArray.push(normalized.table.rows);
            yMetadataMap.set("headers", normalized.table.headers);
            yMetadataMap.set("filename", "customers-1000.csv");
            yMetadataMap.set("firstRowValues", normalized.firstRowValues);
          });
        } catch {
          hasInitialized.current = false; // Allow retry on next connected state
        }
      })();
    }
  }, [connectionStatus, yjsDoc]);
}
