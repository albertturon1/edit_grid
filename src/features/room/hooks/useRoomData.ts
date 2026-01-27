import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCollaboration } from "@/hooks/useCollaboration";
import type { FileImportResult } from "@/lib/imports/types/import";
import type { TableRow } from "@/lib/imports/types/table";
import { documentStore } from "@/lib/stores/documentStore";
import type { TableDataSource } from "@/lib/table/types";
import { useDraftResolution } from "./useDraftResolution";
import { useYjsMutations } from "./useYjsMutations";
import { useYjsTableDocument } from "./useYjsTableDocument";

/**
 * Main orchestrator hook for room feature.
 * Combines Y.js document state, mutations, collaboration, and draft resolution.
 *
 * Returns a TableDataSource union type representing all possible states:
 * - loading: Initial sync or draft resolution in progress
 * - error: Room error (invalid ID, not found)
 * - empty: Local mode with no data (waiting for import)
 * - ready: Table data available with mutations and collaboration info
 *
 * @param roomId - Optional room ID for collaborative mode
 * @returns TableDataSource union type
 */
export function useRoomData(roomId?: string): TableDataSource {
  const [isSharing, setIsSharing] = useState(false);
  const navigate = useNavigate();

  // Get active Y.js document
  const yjsDoc = documentStore.getActiveDoc(roomId);

  // Y.js table state (rows, headers, metadata)
  const tableState = useYjsTableDocument(yjsDoc);

  // Mutations for table operations
  const mutations = useYjsMutations(yjsDoc);

  // Collaboration (PartyKit connection, awareness, remote users)
  const collaboration = useCollaboration(roomId, yjsDoc);

  // Draft resolution (only for local mode)
  const { isResolving } = useDraftResolution(roomId ? null : yjsDoc);

  const hasData = tableState.rows.length > 0;

  // Populate Y.js doc with imported data
  const populateData = useCallback(
    (importResult: FileImportResult) => {
      const { table, metadata } = importResult;

      const yArray = yjsDoc.getArray<TableRow>("rows");
      const yMetadataMap = yjsDoc.getMap("metadata");

      yjsDoc.transact(() => {
        // Clear and populate rows
        yArray.delete(0, yArray.length);
        yArray.push(table.rows);

        // Set metadata
        yMetadataMap.set("headers", table.headers);
        yMetadataMap.set("filename", metadata.filename);
        yMetadataMap.set("firstRowValues", metadata.firstRowValues);
      });
    },
    [yjsDoc],
  );

  // Share handler - migrate local to collaborative
  const handleShare = useCallback(() => {
    if (isSharing || roomId) {
      return;
    }
    setIsSharing(true);

    try {
      const newRoomId = crypto.randomUUID();
      documentStore.migrateLocalToCollaborative(newRoomId);

      navigate({
        to: "/room",
        search: { id: newRoomId },
      });
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again",
      });
    } finally {
      setIsSharing(false);
    }
  }, [isSharing, navigate, roomId]);

  // Build collaboration info
  const collaborationInfo = useMemo(() => {
    if (!collaboration && !roomId) {
      // Local mode - provide share capability
      return {
        users: { local: undefined, remote: [] },
        connectionStatus: "idle" as const,
        onShare: handleShare,
        setSelectedCell: undefined,
      };
    }

    if (!collaboration) {
      return undefined;
    }

    return {
      users: { local: collaboration.local, remote: collaboration.remote },
      connectionStatus: collaboration.connectionStatus,
      setSelectedCell: collaboration.setSelectedCell,
      onShare: !roomId ? handleShare : undefined,
    };
  }, [collaboration, roomId, handleShare]);

  // Priority 1: Error state
  if (collaboration?.roomError) {
    return {
      status: "error",
      error: {
        type: collaboration.roomError.type,
        message: collaboration.roomError.message,
      },
    };
  }

  // Priority 2: Loading collaborative room
  if (roomId && collaboration?.connectionStatus === "loading") {
    return { status: "loading" };
  }

  // Priority 3: Resolving draft from IndexedDB
  if (isResolving) {
    return { status: "loading" };
  }

  // Priority 4: No data in local mode
  if (!hasData && !roomId) {
    return { status: "empty", onImport: populateData };
  }

  // Priority 5: Ready to render table
  return {
    status: "ready",
    data: {
      headers: tableState.headers,
      rows: tableState.rows,
    },
    metadata: {
      filename: tableState.filename,
      firstRowValues: tableState.firstRowValues,
    },
    mutations,
    collaboration: collaborationInfo,
  };
}
