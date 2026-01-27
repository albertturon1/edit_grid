import type { Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import type { TableRow } from "@/lib/imports/types/table";

interface TableHeaderNumericalCellProps {
  table: Table<TableRow>;
}

export function TableHeaderNumericalCell({ table }: TableHeaderNumericalCellProps) {
  return (
    <div
      className={cn("w-full h-full flex group items-center pr-[7px] gap-x-2 hover:cursor-pointer")}
    >
      <h1
        className={cn(
          table.getIsAllPageRowsSelected() ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {"All"}
      </h1>
    </div>
  );
}
