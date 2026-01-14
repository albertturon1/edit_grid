import { CollaborativeAvatars } from "@/components/virtualized-table/controls/collaborative-avatars";
import { FileDropdownMenu } from "@/components/virtualized-table/controls/file-dropdown-menu";
import { RowsSelectionModeToggle } from "@/components/virtualized-table/controls/rows-selection-mode-toggle";
import {
  SelectedRowsIndicator,
  SelectedRowsIndicatorMobile,
} from "@/components/virtualized-table/controls/selected-rows-indicator";
import { TableColumnsSelector } from "@/components/virtualized-table/controls/table-columns-selector";
import { useTableData } from "@/components/virtualized-table/virtualized-table-context";
import { ShareButton } from "@/features/room/components/share-button";
import { cn } from "@/lib/utils";

export function TableManagement() {
  const { table, rowSelectionMode } = useTableData();

  const rowsSelectedNum = table.getFilteredSelectedRowModel().rows.length;
  const totalRowsNum = table.getFilteredRowModel().rows.length;

  const rowProps = {
    message: `${rowsSelectedNum} of ${totalRowsNum} row(s) selected.`,
    rowSelectionMode,
  };

  return (
    <>
      <div className={cn("flex xs:hidden flex-col py-2.5", rowSelectionMode ? "gap-y-2" : "")}>
        <div className="flex gap-x-1 justify-between w-full">
          <FileDropdownMenu />
          <RowsSelectionModeToggle />
          <TableColumnsSelector table={table} />
          <ShareButton />
          <CollaborativeAvatars maxAvatars={1} />
        </div>
        <SelectedRowsIndicatorMobile {...rowProps} />
      </div>
      <div className="hidden xs:flex">
        <div className="flex gap-x-2 py-2.5 justify-between w-full">
          <div className="flex gap-x-2 flex-1">
            <FileDropdownMenu />
            <div className="flex items-center gap-x-2">
              <RowsSelectionModeToggle className="flex-1" />
              <SelectedRowsIndicator {...rowProps} />
            </div>
            <TableColumnsSelector table={table} />
          </div>
          <div className="flex gap-x-2">
            <ShareButton />
            <CollaborativeAvatars maxAvatars={5} />
          </div>
        </div>
      </div>
    </>
  );
}
