import { useRef } from "react";
import { useDataTable } from "@/components/table/useDataTable";
import { Table } from "@/components/ui/table";
import type { TableDataSource } from "@/lib/table/types";
import { TableBody } from "@/components/table/compound/table-body";
import { TableHeader } from "@/components/table/compound/table-header";
import { TableRow } from "@/components/table/compound/table-row";
import { TableCell } from "@/components/table/compound/table-cell";
import { useTableContextMenu } from "@/components/table/compound/hooks/useTableContextMenu";
import { TableContextMenu } from "@/components/table/compound/table-context-menu";

interface PlaygroundTableProps {
  playgroundData: Extract<TableDataSource, { status: "ready" }>;
}

export default function PlaygroundTable({ playgroundData }: PlaygroundTableProps) {
  "use no memo"; // mandatory for tanstack table v8 https://github.com/TanStack/table/issues/5567
  const { data, mutations } = playgroundData;

  const tableContainerRef = useRef<HTMLTableElement | null>(null);
  const table = useDataTable({ data, mutations });

  const { menuState, handleContextMenu, closeMenu } = useTableContextMenu();

  return (
    <>
      <Table
        className="overflow-auto relative h-full rounded"
        ref={tableContainerRef}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <TableHeader table={table} onContextMenu={handleContextMenu} />
        <TableBody table={table} containerRef={tableContainerRef}>
          {(rows) =>
            rows.map((row) => (
              <TableRow key={row.id} row={row}>
                {(cells) =>
                  cells.map((cell) => (
                    <TableCell
                      key={cell.id}
                      cell={cell}
                      rowIndex={row.index}
                      onContextMenu={handleContextMenu}
                    />
                  ))
                }
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      {menuState && (
        <TableContextMenu
          position={menuState.position}
          activeCell={menuState.activeCell}
          mutations={mutations}
          onClose={closeMenu}
        />
      )}
    </>
  );
}
