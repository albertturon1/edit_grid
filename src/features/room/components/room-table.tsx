import type { CollaborationInfo, TableMutations, TableSourceMetadata } from "@/lib/table/types";
import type { TableData } from "@/lib/imports/types/table";
import { ReconnectingBanner } from "./reconnecting-banner";
import { useWindowSize } from "usehooks-ts";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { Padding } from "@/components/padding";
import { useRef } from "react";
import { Table } from "@/components/ui/table";
import { useDataTable } from "@/components/table/useDataTable";
import { useTableContextMenu } from "@/components/table/compound/hooks/useTableContextMenu";
import { TableToolbar } from "@/components/table/compound/table-toolbar";
import { TableHeader } from "@/components/table/compound/table-header";
import { TableBody } from "@/components/table/compound/table-body";
import { TableRow } from "@/components/table/compound/table-row";
import { TableContextMenu } from "@/components/table/compound/table-context-menu";
import { TableCell } from "@/components/table/compound/table-cell";

interface RoomReadyProps {
  roomData: {
    data: TableData;
    metadata: TableSourceMetadata;
    mutations: TableMutations;
    collaboration?: CollaborationInfo;
  };
}

export function RoomTable({ roomData }: RoomReadyProps) {
  "use no memo"; // mandatory for tanstack table v8 https://github.com/TanStack/table/issues/5567
  const { height } = useWindowSize();
  const { data, metadata, mutations, collaboration } = roomData;
  const isReconnecting = collaboration?.connectionStatus === "reconnecting";

  const tableContainerRef = useRef<HTMLTableElement>(null);

  const table = useDataTable({ data, mutations });

  const { menuState, handleContextMenu, closeMenu } = useTableContextMenu();

  return (
    <div className="overflow-hidden flex flex-col">
      {isReconnecting && <ReconnectingBanner />}
      <Padding>
        <div className="w-full h-full" style={{ height: height - NAVBAR_HEIGHT }}>
          <TableToolbar table={table} metadata={metadata} collaboration={collaboration} />
          <Table
            className="overflow-auto relative h-full border rounded"
            ref={tableContainerRef}
            onContextMenu={(e) => e.preventDefault()}
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
        </div>
      </Padding>
    </div>
  );
}
