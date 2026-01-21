import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type Row,
  type RowSelectionState,
  type TableMeta,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { tableDefaultColumn } from "@/components/virtualized-table/default-column";
import { TableNumericalCell } from "@/components/virtualized-table/table-numerical-cell";
import { TableNumericalHeader } from "@/components/virtualized-table/table-numerical-header";
import type { TableData, TableRow } from "@/lib/imports/types/table";
import type { TableMutations } from "@/lib/table/types";
import type { ExtendedContextMenuPosition } from "@/components/virtualized-table/virtualized-table";

const columnHelper = createColumnHelper<TableRow>();

export const ___INTERNAL_ID_COLUMN_ID = "___INTERNAL_ID___000";
export const ___INTERNAL_ID_COLUMN_NAME = "___000___";

interface UseVirtualizedTableProps {
  tabledata: TableData;
  mutations?: TableMutations;
}

type ContextMenuAction = (position: ExtendedContextMenuPosition | null) => void;

export function useVirtualizedTable({ tabledata, mutations }: UseVirtualizedTableProps) {
  const [anchorRow, setAnchorRow] = useState<Row<TableRow> | null>(null);
  const [isModifierActive, setIsModifierActive] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { width: screenWidth } = useWindowSize();

  const { headers, rows } = tabledata;

  const columns = useMemo(() => {
    const headersIds = headers.map((e) => e);
    const mappedHeaders = getMappedHeaders(headersIds);

    return [
      columnHelper.accessor(___INTERNAL_ID_COLUMN_NAME, {
        id: ___INTERNAL_ID_COLUMN_ID,
        header: () => <TableNumericalHeader />,
        cell: (props) => (
          <TableNumericalCell
            {...props}
            anchorRow={anchorRow}
            onAnchorRowChange={setAnchorRow}
            isModifierActive={isModifierActive}
            onModifierStateChange={setIsModifierActive}
          />
        ),
        size: getNoCellSize({ dataLength: rows.length, screenWidth }),
        meta: {
          className: "sticky left-0 w-10",
        },
      }),
      ...mappedHeaders.map((header) => {
        return columnHelper.accessor(header, {
          header,
        });
      }),
    ];
  }, [headers, rows.length, anchorRow, isModifierActive, screenWidth]);

  const meta: TableMeta<TableRow> = useMemo(() => {
    const extractRowIndex = (position: ExtendedContextMenuPosition | null): number | null => {
      if (!position) return null;
      if (position.activeCell.type === "header") return 0;
      return position.activeCell.row.index;
    };

    const extractColumnId = (position: ExtendedContextMenuPosition | null): string | null => {
      if (!position) return null;
      return position.activeCell.column.id;
    };

    const addRow: ContextMenuAction = (position) => {
      if (!mutations?.rows?.add) return;
      const index = extractRowIndex(position);
      if (index === null) return;
      mutations!.rows!.add(index);
    };

    const addColumn: ContextMenuAction = (position) => {
      if (!mutations?.columns?.add) return;
      const afterColumnId = extractColumnId(position);
      if (!afterColumnId) return;
      mutations!.columns!.add(afterColumnId);
    };

    const removeRow: ContextMenuAction = (position) => {
      if (!mutations?.rows?.remove) return;
      if (!position) return;
      if (position.activeCell.type !== "cell") return;
      mutations!.rows!.remove(position.activeCell.row.index);
    };

    const removeColumn: ContextMenuAction = (position) => {
      if (!mutations?.columns?.remove) return;
      const columnId = extractColumnId(position);
      if (!columnId) return;
      mutations!.columns!.remove(columnId);
    };

    const duplicateRow: ContextMenuAction = (position) => {
      if (!mutations?.rows?.duplicate) return;
      if (!position) return;
      if (position.activeCell.type !== "cell") return;
      mutations!.rows!.duplicate(position.activeCell.row.index);
    };

    return {
      updateData: mutations?.updateCell ?? (() => {}),
      contextMenu: {
        addRow,
        addColumn,
        removeRow,
        removeColumn,
        duplicateRow,
      },
    };
  }, [mutations]);

  const reactTable = useReactTable<TableRow>({
    data: rows,
    columns,
    defaultColumn: tableDefaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      columnOrder: [___INTERNAL_ID_COLUMN_ID, ...headers],
    },
    meta,
  });

  return reactTable;
}

function getNoCellSize({ dataLength, screenWidth }: { screenWidth: number; dataLength: number }) {
  const doublePadding = 17; //px-2 + 1
  const checkboxWidth = 24; // 16 + padding
  const unitSize = 9;
  const stringifiedLength = dataLength.toString().length;

  const multi = screenWidth > 640 ? 1 : 0.83; //calculating multiplier for different font sizes. For sm break point

  const baseWidth = doublePadding + checkboxWidth + (stringifiedLength + 1) * unitSize;

  return baseWidth * multi;
}

function getMappedHeaders(headersIds: string[]) {
  const headerCount = new Map<string, number>();

  return headersIds.reduce<string[]>((acc, header, index) => {
    let newId = header;

    if (!newId) {
      newId = `Column${index + 1}`;
    }
    const count = headerCount.get(newId);
    if (count !== undefined) {
      const newCount = count + 1;
      headerCount.set(newId, newCount);
      newId = `${newId}_${newCount}`;
    } else {
      headerCount.set(newId, 1);
    }

    acc.push(newId);
    return acc;
  }, []);
}
