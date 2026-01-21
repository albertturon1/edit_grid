import { ArrowBigDown, ArrowBigRight, ChevronsDown, Trash } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/context-menu/context-menu";
import { ___INTERNAL_ID_COLUMN_ID } from "@/components/virtualized-table/hooks/useVirtualizedTable";
import type { ExtendedContextMenuPosition } from "@/components/virtualized-table/virtualized-table";
import type { TableMutations } from "@/lib/table/types";

type Position = ExtendedContextMenuPosition | null;

interface TableContextMenuProps {
  onClose: () => void;
  position: Position;
  mutations?: TableMutations;
}

export function TableContextMenu({ onClose, position, mutations }: TableContextMenuProps) {
  const showColumnOnly = position?.activeCell.column.id !== ___INTERNAL_ID_COLUMN_ID;

  const showRowOnly = position?.activeCell.type !== "header";

  if (!mutations || !position) {
    return null;
  }

  const { rows, columns } = mutations;

  const rowIndex = "row" in position.activeCell ? position.activeCell.row.index : null;
  const columnId = "column" in position.activeCell ? position.activeCell.column.id : null;

  const addRow = rows?.add;
  const duplicateRow = showRowOnly && rows?.duplicate && rowIndex !== null ? rows.duplicate : null;
  const removeRow = showRowOnly && rows?.remove && rowIndex !== null ? rows.remove : null;
  const addColumn = columns?.add;
  const removeColumn = showColumnOnly && columns?.remove && columnId ? columns.remove : null;

  const createAction = (action: () => void) => () => {
    action();
    onClose();
  };

  return (
    <ContextMenu position={position} onClose={onClose}>
      <ContextMenuContent className="[&>*]:gap-x-8 z-50">
        {addRow ? (
          <ContextMenuItem
            onClick={createAction(() => {
              const insertIndex = rowIndex !== null ? rowIndex + 1 : 0;
              addRow(insertIndex);
            })}
          >
            {"Add Row"}
            <ArrowBigDown className="w-5 h-5" strokeWidth={1.5} />
          </ContextMenuItem>
        ) : null}
        {duplicateRow ? (
          <ContextMenuItem onClick={createAction(() => duplicateRow(rowIndex!))}>
            {"Duplicate Row"}
            <ChevronsDown className="w-5 h-5" strokeWidth={1.5} />
          </ContextMenuItem>
        ) : null}
        {removeRow ? (
          <ContextMenuItem
            onClick={createAction(() => removeRow(rowIndex!))}
            className="text-red-600"
          >
            {"Delete Row"}
            <Trash className="w-5 h-[17px]" strokeWidth={1.5} />
          </ContextMenuItem>
        ) : null}
        {addColumn ? (
          <ContextMenuItem
            onClick={createAction(() => {
              const afterColumnId = columnId ?? "";
              addColumn(afterColumnId);
            })}
            className="justify-between"
          >
            {"Add Column"}
            <ArrowBigRight className="w-5 h-5" strokeWidth={1.5} />
          </ContextMenuItem>
        ) : null}
        {removeColumn ? (
          <ContextMenuItem
            onClick={createAction(() => removeColumn(columnId!))}
            className="text-red-600"
          >
            {"Delete Column"}
            <Trash className="w-5 h-[17px]" strokeWidth={1.5} />
          </ContextMenuItem>
        ) : null}
      </ContextMenuContent>
    </ContextMenu>
  );
}
