import { flexRender, type Table } from "@tanstack/react-table";
import type { MouseEvent } from "react";
import { TableHead, TableHeader as UITableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TableRow as TRow } from "@/lib/imports/types/table";
import type { ActiveCell } from "./types";

interface TableHeaderProps {
  table: Table<TRow>;
  onContextMenu?: (e: MouseEvent, activeCell: ActiveCell) => void;
}

export function TableHeader({ table, onContextMenu }: TableHeaderProps) {
  "use no memo"; // mandatory for tanstack table v8 https://github.com/TanStack/table/issues/5567
  return (
    <UITableHeader className="bg-background grid sticky top-0 z-10 border-b text-xs sm:text-sm">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="flex border-b-0">
          {headerGroup.headers.map((header, idx) => (
            <TableHead
              key={header.id}
              onContextMenu={(e) => onContextMenu?.(e, { type: "header", ...header })}
              colSpan={header.colSpan}
              style={{ width: header.getSize() }}
              className={cn(
                "relative bg-background overflow-hidden font-semibold border-r py-2 flex pl-2 h-auto",
                idx === 0 &&
                  "sticky left-0 z-10 text-white/0 cursor-default selection:cursor-default",
              )}
            >
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
              <button
                type="button"
                aria-label="Resize column"
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
                className={cn(
                  "absolute right-0 top-0 h-full w-[5px] cursor-col-resize select-none touch-none",
                  header.column.getIsResizing() ? "bg-blue-300 opacity-100" : "",
                )}
              />
            </TableHead>
          ))}
        </TableRow>
      ))}
    </UITableHeader>
  );
}
