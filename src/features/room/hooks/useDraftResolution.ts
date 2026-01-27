import { useEffect, useRef, useState } from "react";
import type * as Y from "yjs";
import type { TableRow } from "@/lib/imports/types/table";
import { clearDraft, getDraft } from "@/lib/stores/draftStorage";

interface DraftResolutionState {
  isResolving: boolean;
}

/**
 * Hook that resolves drafts from IndexedDB for local mode only.
 * Populates Y.js document with draft data if found.
 *
 * This is only used when there's no roomId (local mode).
 * In collaborative mode, data comes from PartyKit server.
 *
 * @param yjsDoc - Y.js document to populate with draft (or null to skip)
 * @returns Object with isResolving state
 */
export function useDraftResolution(yjsDoc: Y.Doc | null): DraftResolutionState {
  const [isResolving, setIsResolving] = useState(yjsDoc !== null);
  const hasResolvedDraft = useRef(false);

  useEffect(() => {
    // Skip if no document or already resolved
    if (!yjsDoc || hasResolvedDraft.current) {
      setIsResolving(false);
      return;
    }

    async function resolveDraft() {
      try {
        const draft = await getDraft();
        if (draft && yjsDoc) {
          const yArray = yjsDoc.getArray<TableRow>("rows");
          const yMetadataMap = yjsDoc.getMap("metadata");

          // Clear existing data and populate from draft
          yjsDoc.transact(() => {
            yArray.delete(0, yArray.length);
            yArray.push(draft.table.rows);

            yMetadataMap.set("headers", draft.table.headers);
            yMetadataMap.set("filename", draft.metadata.filename);
            yMetadataMap.set("firstRowValues", draft.metadata.firstRowValues);
          });

          await clearDraft();
        }
      } finally {
        hasResolvedDraft.current = true;
        setIsResolving(false);
      }
    }

    resolveDraft();
  }, [yjsDoc]);

  return { isResolving };
}
