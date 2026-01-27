import { ArrowBigDown, ArrowBigRight, ChevronsDown, Trash } from "lucide-react";
import type { Cell, Header } from "@tanstack/react-table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/context-menu/context-menu";
import { DATA_TABLE_ROW_NUMBER_COLUMN_ID } from "@/components/table/useDataTable";
import type { TableMutations } from "@/lib/table/types";
import type { TableRow } from "@/lib/imports/types/table";

type ActiveCell =
  | ({ type: "cell" } & Cell<TableRow, unknown>)
  | ({ type: "header" } & Header<TableRow, unknown>);

interface TableContextMenuProps {
  position: { x: number; y: number };
  activeCell: ActiveCell;
  mutations: TableMutations;
  onClose: () => void;
}

export function TableContextMenu({
  position,
  activeCell,
  mutations,
  onClose,
}: TableContextMenuProps) {
  const hasRowActions = mutations.rows?.add || mutations.rows?.remove || mutations.rows?.duplicate;
  const hasColumnActions = mutations.columns?.add || mutations.columns?.remove;

  if (!hasRowActions && !hasColumnActions) return null;

  const showColumnOnly = activeCell.column.id !== DATA_TABLE_ROW_NUMBER_COLUMN_ID;
  const showRowOnly = activeCell.type !== "header";
  const rowIndex = activeCell.type === "cell" ? activeCell.row.index : undefined;
  const columnId = activeCell.column.id;

  const createAction = (action: () => void) => () => {
    action();
    onClose();
  };

  return (
    <ContextMenu position={position} onClose={onClose}>
      <ContextMenuContent className="*:gap-x-8 z-50">
        {mutations.rows?.add && (
          <ContextMenuItem
            onClick={createAction(() =>
              mutations.rows?.add?.(rowIndex !== undefined ? rowIndex + 1 : 0),
            )}
          >
            {"Add Row"}
            <ArrowBigDown className="w-5 h-5" strokeWidth={1.5} />
          </ContextMenuItem>
        )}
        {showRowOnly && mutations.rows?.duplicate && rowIndex !== undefined && (
          <ContextMenuItem onClick={createAction(() => mutations.rows?.duplicate?.(rowIndex))}>
            {"Duplicate Row"}
            <ChevronsDown className="w-5 h-5" strokeWidth={1.5} />
          </ContextMenuItem>
        )}
        {showRowOnly && mutations.rows?.remove && rowIndex !== undefined && (
          <ContextMenuItem
            onClick={createAction(() => mutations.rows?.remove?.(rowIndex))}
            className="text-red-600"
          >
            {"Delete Row"}
            <Trash className="w-5 h-[17px]" strokeWidth={1.5} />
          </ContextMenuItem>
        )}
        {hasRowActions && hasColumnActions && <ContextMenuSeparator />}
        {mutations.columns?.add && (
          <ContextMenuItem
            onClick={createAction(() => mutations.columns?.add?.(columnId))}
            className="justify-between"
          >
            {"Add Column"}
            <ArrowBigRight className="w-5 h-5" strokeWidth={1.5} />
          </ContextMenuItem>
        )}
        {showColumnOnly && mutations.columns?.remove && (
          <ContextMenuItem
            onClick={createAction(() => mutations.columns?.remove?.(columnId))}
            className="text-red-600"
          >
            {"Delete Column"}
            <Trash className="w-5 h-[17px]" strokeWidth={1.5} />
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
