import type { Table } from "@tanstack/react-table";
import type { RoomError } from "@/hooks/useCollaboration";
import type { TableRow } from "@/lib/imports/types/table";
import { useRoomDataProvider } from "./useRoomDataProvider";
import { useVirtualizedTable } from "@/components/virtualized-table/hooks/useVirtualizedTable";

export interface TableMetadata {
  filename: string;
  firstRowValues: string[];
}

type RoomViewState =
  | { status: "loading" }
  | { status: "error"; error: RoomError }
  | {
      status: "empty";
      onImport: (data: import("@/lib/imports/types/import").FileImportResult) => void;
    }
  | {
      status: "ready";
      table: Table<TableRow>;
      metadata: TableMetadata;
      isReconnecting: boolean;
    };

export function useRoomViewState(roomId: string | undefined): RoomViewState {
  const provider = useRoomDataProvider(roomId);

  const table = useVirtualizedTable({
    tabledata: provider.data,
    mutations: provider.mutations,
  });

  if (provider.status === "loading") {
    return { status: "loading" };
  }

  if (provider.status === "error") {
    return { status: "error", error: provider.error as RoomError };
  }

  if (provider.status === "empty") {
    if (!provider.onImport) {
      return { status: "loading" };
    }
    return { status: "empty", onImport: provider.onImport };
  }

  return {
    status: "ready",
    table,
    metadata: {
      filename: provider.metadata.filename,
      firstRowValues: provider.metadata.firstRowValues,
    },
    isReconnecting: provider.collaboration?.isReconnecting ?? false,
  };
}
