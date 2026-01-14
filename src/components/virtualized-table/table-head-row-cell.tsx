import type { Header } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import type { MouseEvent } from "react";
import type { TableRow } from "@/lib/imports/types/table";
import { cn } from "@/lib/utils";
import { useTableData } from "./virtualized-table-context";

const NUMERICAL_COLUMN_ID = "text-white/0 cursor-default selection:cursor-default"; // properties to hide the “0” from the first cell - it is rendered to keep the layout stable when no column is visible except the numeric one.

export type TableHeadRowCellProps = {
  header: Header<TableRow, unknown>;
  idx: number;
};

export function TableHeadRowCell({ header, idx }: TableHeadRowCellProps) {
  const { onContextMenu } = useTableData();
  function handleOnContextMenu(mouseEvent: MouseEvent<HTMLTableCellElement>) {
    onContextMenu({
      //@ts-expect-error unknown vs TableRow
      activeCell: {
        type: "header",
        ...header,
      },
      mouseEvent,
    });
  }

  return (
    <th
      onContextMenu={handleOnContextMenu}
      key={header.id}
      colSpan={header.colSpan}
      style={{ width: header.getSize() }}
      className={cn(
        "relative bg-background overflow-hidden font-semibold border-r py-2 flex pl-2",
        idx === 0 ? cn("sticky left-0 z-10", NUMERICAL_COLUMN_ID) : "", // sticky first cell
      )}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      <button
        role="button"
        aria-label="Resize column"
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={cn(
          "absolute right-0 top-0 h-full w-[5px] cursor-col-resize select-none touch-none",
          header.column.getIsResizing() ? "bg-blue-300 opacity-100" : "",
        )}
      />
    </th>
  );
}
