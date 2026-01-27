import type { Row, Table } from "@tanstack/react-table";
import type { TableRow } from "@/lib/imports/types/table";
import { cn } from "@/lib/utils";

interface TableBodyNumericalCellProps {
  row: Row<TableRow>;
  table: Table<TableRow>;
}

export function TableBodyNumericalCell({ row, table }: TableBodyNumericalCellProps) {
  return (
    <div className={cn("w-full h-full flex gap-x-2 px-[7px] pt-[9px] border border-white/0 group")}>
      <h1 className={"mt-[1px] text-xs sm:text-sm"}>
        {(table.getSortedRowModel()?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) +
          1}
      </h1>
    </div>
  );
}
