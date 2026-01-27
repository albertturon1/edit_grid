import { ChevronDown, Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Table } from "@tanstack/react-table";
import type { TableRow } from "@/lib/imports/types/table";

interface TableColumnsSelectorProps {
  className?: string;
  table: Table<TableRow>;
}

export function TableColumnsSelector({ className, table }: TableColumnsSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("gap-x-2 transition-colors", className)}>
          <div className="flex gap-x-2 sm:gap-x-3 items-center">
            <Columns3 className="h-4 w-4" />
            Columns
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table.getAllColumns().map((column) => {
          // Skip numerical column
          if (typeof column.columnDef.header !== "string") {
            return null;
          }

          return (
            <DropdownMenuCheckboxItem
              onSelect={(event) => {
                event.preventDefault();
              }}
              key={column.columnDef.header}
              checked={column.getIsVisible()}
              onCheckedChange={() => column.toggleVisibility()}
            >
              {column.columnDef.header}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
