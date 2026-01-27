import { type Cell, flexRender } from "@tanstack/react-table";
import { TableCell as UITableCell } from "@/components/ui/table";
import type { TableRow } from "@/lib/imports/types/table";
import { cn } from "@/lib/utils";
import type { MouseEvent } from "react";
import { DATA_TABLE_ROW_NUMBER_COLUMN_ID } from "../useDataTable";
import type { ActiveCell } from "./types";

interface TableCellProps {
  cell: Cell<TableRow, unknown>;
  rowIndex: number;
  className?: string;
  onContextMenu?: (e: MouseEvent, activeCell: ActiveCell) => void;
}

export function TableCell({ cell, rowIndex, className, onContextMenu }: TableCellProps) {
  "use no memo"; // mandatory for tanstack table v8 https://github.com/TanStack/table/issues/5567
  const isEvenRow = rowIndex % 2 === 0;

  return (
    <UITableCell
      data-row-index={rowIndex}
      data-col-id={cell.column.id}
      onContextMenu={(e) => onContextMenu?.(e, { type: "cell", ...cell })}
      className={cn(
        "flex p-0 border-r h-11 w-full bg-gray-50",
        isEvenRow ? "bg-background" : "bg-muted",
        cell.column.id === DATA_TABLE_ROW_NUMBER_COLUMN_ID && "sticky z-10 left-0",
        className,
      )}
      style={{ width: cell.column.getSize() }}
    >
      <div className="flex-1 relative overflow-hidden">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    </UITableCell>
  );
}
