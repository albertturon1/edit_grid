import type { ConnectionStatus } from "@/hooks/useCollaboration";
import type { RemoteUser, SelectedCell, UserState } from "@/lib/collaboration/types";
import type { FileImportResult } from "@/lib/imports/types/import";
import type { TableData } from "@/lib/imports/types/table";

/**
 * Mutations interface for table operations.
 * All fields are optional - absence means read-only for that operation.
 */
export interface TableMutations {
  updateCell?: (rowIndex: number, columnId: string, value: string) => void;
  rows?: {
    add?: (atIndex: number) => void;
    remove?: (index: number) => void;
    duplicate?: (index: number) => void;
  };
  columns?: {
    add?: (afterColumnId: string) => void;
    remove?: (columnId: string) => void;
  };
}

/**
 * Collaboration information for real-time features.
 * Passed as props to enable remote user highlighting and share functionality.
 */
export interface CollaborationInfo {
  users: { local?: UserState; remote: RemoteUser[] };
  connectionStatus: ConnectionStatus;
  onShare?: () => void;
  setSelectedCell?: (cell: SelectedCell | null) => void;
}

/**
 * Metadata about the table source (imported file).
 */
export interface TableSourceMetadata {
  filename: string;
  firstRowValues: string[];
}

/**
 * Union type representing all possible states of a table data source.
 * Used by data provider hooks to communicate loading/error/ready states.
 */
export type TableDataSource =
  | { status: "loading" }
  | { status: "error"; error: { type: string; message: string } }
  | { status: "empty"; onImport: (data: FileImportResult) => void }
  | {
      status: "ready";
      data: TableData;
      metadata: TableSourceMetadata;
      mutations: TableMutations;
      collaboration?: CollaborationInfo;
    };
