import type { FileImportResult } from "@/lib/imports/types/import";
import type { TableData } from "@/lib/imports/types/table";
import type { RemoteUser } from "@/lib/collaboration/types";

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

export interface TableSourceMetadata {
  /** Original filename of the imported file */
  filename: string;
  /** Values from the first row (useful for column name suggestions) */
  firstRowValues: string[];
}

export interface CollaborationInfo {
  /** Whether the connection is in a reconnecting state */
  isReconnecting: boolean;
  /** List of other users currently connected to the document */
  users: RemoteUser[];
}

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
