import type { Table } from "@tanstack/react-table";
import type { RoomError } from "@/hooks/useCollaboration";
import type { FileImportResult } from "@/lib/imports/types/import";
import type { TableRow } from "@/lib/imports/types/table";
import { useTableDocument } from "@/components/virtualized-table/hooks/useTableDocument";
import { useVirtualizedTable } from "@/components/virtualized-table/hooks/useVirtualizedTable";
import { useCollaborationSession } from "../components/collaborative-provider";

export interface TableMetadata {
  filename: string;
  firstRowValues: string[];
}

type RoomViewState =
  | { status: "loading" }
  | { status: "error"; error: RoomError }
  | {
      status: "empty";
      onImport: (data: FileImportResult) => void;
    }
  | {
      status: "ready";
      table: Table<TableRow>;
      metadata: TableMetadata;
      isReconnecting: boolean;
    };

export function useRoomViewState(roomId: string | undefined): RoomViewState {
  const { roomError, connectionStatus } = useCollaborationSession();
  const { isResolving, tabledata, metadata, populateData, meta } = useTableDocument(roomId);
  const table = useVirtualizedTable({ tabledata, meta });

  const hasData = table.getRowModel().rows.length > 0;

  // Priority 1: Error state
  if (roomError) {
    return { status: "error", error: roomError };
  }

  // Priority 2: Loading collaborative room
  if (roomId && connectionStatus === "loading") {
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
    table,
    metadata,
    isReconnecting: connectionStatus === "reconnecting",
  };
}
