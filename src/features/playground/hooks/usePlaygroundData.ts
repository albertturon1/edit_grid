import { useCollaboration } from "@/hooks/useCollaboration";
import { documentStore } from "@/lib/stores/documentStore";
import { useYjsMutations } from "@/features/room/hooks/useYjsMutations";
import { useYjsTableDocument } from "@/features/room/hooks/useYjsTableDocument";
import { usePlaygroundSync } from "./usePlaygroundSync";
import type { TableDataSource } from "@/lib/table/types";

export function usePlaygroundData(roomId: string): TableDataSource {
  const yjsDoc = documentStore.getActiveDoc(roomId);
  const tableDoc = useYjsTableDocument(yjsDoc);
  const mutations = useYjsMutations(yjsDoc);
  const collaboration = useCollaboration(roomId, yjsDoc);

  // Initialize from CSV if empty
  usePlaygroundSync(yjsDoc, collaboration?.connectionStatus ?? "idle");

  const hasData = tableDoc.rows.length > 0;

  if (collaboration?.connectionStatus === "loading") {
    return { status: "loading" };
  }

  if (!hasData && collaboration?.connectionStatus === "connected") {
    return { status: "loading" };
  }

  if (!hasData) {
    return { status: "loading" };
  }

  return {
    status: "ready",
    data: {
      rows: tableDoc.rows,
      headers: tableDoc.headers,
    },
    metadata: {
      filename: tableDoc.filename,
      firstRowValues: tableDoc.firstRowValues,
    },
    mutations,
    collaboration: {
      users: {
        local: collaboration?.local,
        remote: collaboration?.remote ?? [],
      },
      connectionStatus: collaboration?.connectionStatus ?? "idle",
    },
  };
}
