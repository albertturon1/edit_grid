import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useTableData } from "./virtualized-table-context";

export function TableNumericalHeader() {
  const { table, rowSelectionMode } = useTableData();

  function onClick() {
    table.toggleAllPageRowsSelected();
  }

  return (
    <div
      className={cn(
        "w-full h-full flex group items-center pr-[7px] gap-x-2 hover:cursor-pointer",
        rowSelectionMode ? "" : "opacity-0 hidden",
      )}
      onKeyDown={onClick}
      onClick={onClick}
    >
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate") // keep "indeterminate" here
        }
        aria-label="Select all"
        className={cn(
          !table.getIsAllPageRowsSelected() ? "opacity-50 group-hover:opacity-100" : "",
          rowSelectionMode ? "" : "opacity-0",
        )}
      />
      <h1
        className={cn(
          rowSelectionMode ? "" : "opacity-0",
          table.getIsAllPageRowsSelected() ? "text-black" : "text-slate-500",
        )}
      >
        {"All"}
      </h1>
    </div>
  );
}
