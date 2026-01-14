import type { Table } from "@tanstack/react-table";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import type { ImportedSourceMetadata } from "@/lib/imports/types/import";
import type { TableRow } from "@/lib/imports/types/table";
import type { HandleOnContextMenuProps } from "./virtualized-table";

type VirtualizedTableContextValue = {
  table: Table<TableRow>;
  metadata: ImportedSourceMetadata;
  rowSelectionMode: boolean;
  onRowSelectionModeChange: (state: boolean) => void;
  onContextMenu: (props: HandleOnContextMenuProps) => void;
};

const VirtualizedTableContext = createContext<VirtualizedTableContextValue | null>(null);

type VirtualizedTableProviderProps = VirtualizedTableContextValue & {
  children: ReactNode;
};

export function VirtualizedTableProvider({
  children,
  onContextMenu,
  rowSelectionMode,
  table,
  metadata,
  onRowSelectionModeChange,
}: VirtualizedTableProviderProps) {
  const value = useMemo(
    () => ({
      table,
      metadata,
      onContextMenu,
      rowSelectionMode,
      onRowSelectionModeChange,
    }),
    [table, onContextMenu, rowSelectionMode, metadata, onRowSelectionModeChange],
  );

  return (
    <VirtualizedTableContext.Provider value={value}>{children}</VirtualizedTableContext.Provider>
  );
}

export function useTableData() {
  const ctx = useContext(VirtualizedTableContext);
  if (!ctx) {
    throw new Error("useTableData must be used within VirtualizedTableProvider");
  }
  return ctx;
}
