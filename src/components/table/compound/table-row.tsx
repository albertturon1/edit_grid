import type { ReactNode } from "react";
import type { Cell } from "@tanstack/react-table";
import { TableRow as UITableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { type VirtualRow } from "./table-body";
import type { TableRow as TRow } from "@/lib/imports/types/table";

interface TableRowProps {
  row: VirtualRow;
  children: (cells: Cell<TRow, unknown>[]) => ReactNode;
}

export function TableRow({ row, children }: TableRowProps) {
  const cells = row.data.getVisibleCells();

  return (
    <UITableRow
      role="row"
      data-index={row.virtualItem.index}
      aria-rowindex={row.virtualItem.index}
      data-testid={`row-${row.virtualItem.index}`}
      ref={row.virtualizer.measureElement}
      className={cn("flex absolute w-full border-b hover:bg-inherit")}
      style={{ transform: `translateY(${row.virtualItem.start}px)` }}
    >
      {children(cells)}
    </UITableRow>
  );
}
