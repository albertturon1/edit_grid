import type { Table } from "@tanstack/react-table";
import { ArrowBigDown, ArrowBigRight, ChevronsDown, Trash } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/context-menu/context-menu";
import { ___INTERNAL_ID_COLUMN_ID } from "@/components/virtualized-table/hooks/useVirtualizedTable";
import type { ExtendedContextMenuPosition } from "@/components/virtualized-table/virtualized-table";
import type { TableRow } from "@/lib/imports/types/table";

type Position = ExtendedContextMenuPosition | null;
type Action = (position: Position) => void;
interface TableContextMenuProps {
  onClose: () => void;
  position: Position;
  table: Table<TableRow>;
}

export function TableContextMenu({ onClose, position, table }: TableContextMenuProps) {
  const showColumnOnly = position?.activeCell.column.id !== ___INTERNAL_ID_COLUMN_ID;

  const showRowOnly = position?.activeCell.type !== "header";

  if (!table.options.meta?.contextMenu || !position) {
    return null;
  }
  const createAction = (action: Action) => () => {
    action(position);
    onClose();
  };

  const { addColumn, addRow, duplicateRow, removeColumn, removeRow } =
    table.options.meta.contextMenu;

  return (
    <ContextMenu position={position} onClose={onClose}>
      <ContextMenuContent className="[&>*]:gap-x-8 z-50">
        <ContextMenuItem onClick={createAction(addRow)}>
          {"Add Row"}
          <ArrowBigDown className="w-5 h-5" strokeWidth={1.5} />
        </ContextMenuItem>
        {showRowOnly ? (
          <>
            <ContextMenuItem onClick={createAction(duplicateRow)}>
              {"Duplicate Row"}
              <ChevronsDown className="w-5 h-5" strokeWidth={1.5} />
            </ContextMenuItem>
            <ContextMenuItem onClick={createAction(removeRow)} className="text-red-600">
              {"Delete Row"}
              <Trash className="w-5 h-[17px]" strokeWidth={1.5} />
            </ContextMenuItem>
          </>
        ) : null}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={createAction(addColumn)} className="justify-between">
          {"Add Column"}
          <ArrowBigRight className="w-5 h-5" strokeWidth={1.5} />
        </ContextMenuItem>
        {showColumnOnly ? (
          <ContextMenuItem onClick={createAction(removeColumn)} className="text-red-600">
            {"Delete Column"}
            <Trash className="w-5 h-[17px]" strokeWidth={1.5} />
          </ContextMenuItem>
        ) : null}
      </ContextMenuContent>
    </ContextMenu>
  );
}
