import { useEffect, useRef, useState } from "react";
import { documentStore } from "@/lib/stores/documentStore";
import { getDraft, clearDraft } from "@/lib/stores/draftStorage";
import { useCollaboration } from "@/hooks/useCollaboration";
import { useYjsTableDocument } from "@/components/virtualized-table/hooks/useYjsTableDocument";
import { useYjsMutations } from "@/components/virtualized-table/hooks/useYjsMutations";
import { useYjsPopulateData } from "@/components/virtualized-table/hooks/useYjsPopulateData";
import type { TableDataSource } from "@/lib/table/types";

export function useRoomDataProvider(roomId: string | undefined): TableDataSource {
  const yjsDoc = documentStore.getActiveDoc(roomId);

  const collaboration = useCollaboration(roomId, yjsDoc);
  const { data, metadata, isLoading: isDocLoading } = useYjsTableDocument(yjsDoc);
  const mutations = useYjsMutations(yjsDoc);
  const { populateData } = useYjsPopulateData(yjsDoc);

  const [isResolvingDraft, setIsResolvingDraft] = useState(!roomId);
  const hasResolvedDraft = useRef(false);

  useEffect(() => {
    if (roomId || hasResolvedDraft.current) {
      setIsResolvingDraft(false);
      return;
    }

    async function resolveDraft() {
      try {
        const draft = await getDraft();
        if (draft) {
          const yArray = yjsDoc.getArray("rows");
          const yMetadataMap = yjsDoc.getMap("metadata");

          yArray.delete(0, yArray.length);
          yArray.push(draft.table.rows);

          yMetadataMap.set("headers", draft.table.headers);
          yMetadataMap.set("filename", draft.metadata.filename);
          yMetadataMap.set("firstRowValues", draft.metadata.firstRowValues);

          await clearDraft();
        }
      } finally {
        hasResolvedDraft.current = true;
        setIsResolvingDraft(false);
      }
    }

    resolveDraft();
  }, [roomId, yjsDoc]);

  const hasData = data.rows.length > 0;
  const isLoading = isDocLoading || isResolvingDraft;

  if (collaboration?.roomError) {
    return {
      status: "error",
      error: {
        type: collaboration.roomError.type,
        message: collaboration.roomError.message,
      },
    };
  }

  if (roomId && collaboration?.connectionStatus === "loading") {
    return { status: "loading" };
  }

  if (isLoading) {
    return { status: "loading" };
  }

  if (!hasData && !roomId) {
    return { status: "empty", onImport: populateData };
  }

  const collaborationInfo = roomId
    ? {
        isReconnecting: collaboration?.connectionStatus === "reconnecting",
        users: collaboration?.remote ?? [],
      }
    : undefined;

  return {
    status: "ready",
    data,
    metadata,
    mutations,
    collaboration: collaborationInfo,
  };
}
