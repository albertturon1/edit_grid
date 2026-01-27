import { Loader2 } from "lucide-react";
import { usePlaygroundData } from "@/features/playground/hooks/usePlaygroundData";
import { useRef } from "react";
import { useDataTable } from "@/components/table/useDataTable";
import { Table } from "@/components/ui/table";
import { PLAYGROUND_ROOM_ID } from "../constants";
import type { TableDataSource } from "@/lib/table/types";
import { TableBody } from "@/components/table/compound/table-body";
import { TableHeader } from "@/components/table/compound/table-header";
import { TableRow } from "@/components/table/compound/table-row";
import { TableCell } from "@/components/table/compound/table-cell";
import { useTableContextMenu } from "@/components/table/compound/hooks/useTableContextMenu";
import { TableContextMenu } from "@/components/table/compound/table-context-menu";

export function Playground() {
  const playgroundData = usePlaygroundData(PLAYGROUND_ROOM_ID);

  if (playgroundData.status !== "ready") {
    return <PlaygroundLoading />;
  }

  return <PlaygroundContent playgroundData={playgroundData} />;
}

interface PlaygroundContentProps {
  playgroundData: Extract<TableDataSource, { status: "ready" }>;
}

function PlaygroundContent({ playgroundData }: PlaygroundContentProps) {
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

function PlaygroundLoading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-1 flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading playground...</p>
      </div>
    </div>
  );
}
