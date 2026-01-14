import type { Table } from "@tanstack/react-table";
import { ChevronDown, Columns3 } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TableRow } from "@/lib/imports/types/table";
import { cn } from "@/lib/utils";
import { TableDropdownButton } from "./table-dropdown-button";

type TableManagementProps<T extends Table<TableRow>> = {
  table: T;
};

export function TableColumnsSelector<T extends Table<TableRow>>({
  table,
}: TableManagementProps<T>) {
  const [columnSelectionMode, setColumnSelectionMode] = useState(false);

  return (
    <DropdownMenu open={columnSelectionMode} onOpenChange={setColumnSelectionMode}>
      <DropdownMenuTrigger asChild>
        <TableDropdownButton active={columnSelectionMode}>
          <div className="flex gap-x-2 sm:gap-x-3 items-center">
            <Columns3 className={cn("h-4 w-4", columnSelectionMode ? "text-primary" : "")} />
            {"Columns"}
          </div>
          <ChevronDown className="h-4 w-4" />
        </TableDropdownButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{"Toggle columns"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownItems table={table} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DropdownItems<T extends Table<TableRow>>({ table }: { table: T }) {
  return table.getAllColumns().map((column) => {
    // not displaying numerical column
    if (typeof column.columnDef.header !== "string") {
      return null;
    }

    // omitting numerical column
    return (
      <DropdownMenuCheckboxItem
        onSelect={(event) => {
          // prevent closing dropdown menu after selecting an option
          event.preventDefault();
        }}
        key={column.columnDef.header}
        checked={column.getIsVisible()}
        onCheckedChange={(value) => column.toggleVisibility(!!value)}
      >
        {column.columnDef.header}
      </DropdownMenuCheckboxItem>
    );
  });
}
