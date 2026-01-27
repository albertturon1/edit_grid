import type { Table } from "@tanstack/react-table";
import type { CollaborationInfo, TableSourceMetadata } from "@/lib/table/types";
import type { TableRow } from "@/lib/imports/types/table";
import { CollaborativeAvatars } from "@/components/table/toolbar/collaborating-avatars";
import { ShareButton } from "@/components/table/toolbar/share-button";
import { TableColumnsSelector } from "@/components/table/toolbar/table-columns-selector";
import { FileDropdownMenu } from "@/components/table/toolbar/export-dropdown/file-dropdown-menu";

interface TableToolbarProps {
  table: Table<TableRow>;
  metadata: TableSourceMetadata;
  collaboration?: CollaborationInfo;
}

export function TableToolbar({ table, metadata, collaboration }: TableToolbarProps) {
  "use no memo"; // mandatory for tanstack table v8 https://github.com/TanStack/table/issues/5567
  const showShareButton = collaboration?.connectionStatus === "idle" && collaboration?.onShare;
  const hasRemoteUsers = (collaboration?.users.remote.length ?? 0) > 0;

  return (
    <div className="flex py-2.5 w-full">
      {/* Mobile layout */}
      <div className="flex sm:hidden gap-x-1 w-full">
        <FileDropdownMenu table={table} metadata={metadata} />
        <TableColumnsSelector table={table} />
        {showShareButton && <ShareButton onShare={collaboration.onShare} />}
        {hasRemoteUsers && (
          <CollaborativeAvatars users={collaboration?.users.remote} maxAvatars={1} />
        )}
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex">
        <div className="flex gap-x-2 justify-between w-full">
          <FileDropdownMenu table={table} metadata={metadata} />
          <TableColumnsSelector table={table} />
          {showShareButton && <ShareButton onShare={collaboration.onShare} />}
          {hasRemoteUsers && (
            <CollaborativeAvatars users={collaboration?.users.remote} maxAvatars={5} />
          )}
        </div>
      </div>
    </div>
  );
}
