import {
  type ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { useWindowSize } from "usehooks-ts";
import { TableBodyNumericalCell } from "@/components/table/table-numerical-cell";
import { TableHeaderNumericalCell } from "@/components/table/table-header-numerical-cell";
import type { TableData, TableRow } from "@/lib/imports/types/table";
import type { TableMutations } from "@/lib/table/types";
import { DefaultTableCell } from "@/components/table/compound/default-table-cell";

const columnHelper = createColumnHelper<TableRow>();

export const DATA_TABLE_ROW_NUMBER_COLUMN_ID = "___INTERNAL_ID___000";
export const DATA_TABLE_ROW_NUMBER_COLUMN_NAME = "___000___";

const dataTableDefaultColumn: Partial<ColumnDef<TableRow>> = {
  cell: ({ getValue, row, column, table }) => {
    return (
      <DefaultTableCell
        value={getValue() as string}
        rowIndex={row.index}
        columnId={column.id}
        updateData={table.options.meta?.updateData}
      />
    );
  },
};

interface UseDataTableProps {
  data: TableData;
  mutations?: Pick<TableMutations, "updateCell">;
}

export function useDataTable({ data, mutations }: UseDataTableProps) {
  const { width: screenWidth } = useWindowSize();

  const { headers, rows } = data;

  const columns = useMemo(() => {
    const headersIds = headers.map((e) => e);
    const mappedHeaders = getMappedHeaders(headersIds);

    return [
      columnHelper.accessor(DATA_TABLE_ROW_NUMBER_COLUMN_NAME, {
        id: DATA_TABLE_ROW_NUMBER_COLUMN_ID,
        header: ({ table }) => <TableHeaderNumericalCell table={table} />,
        cell: (props) => <TableBodyNumericalCell row={props.row} table={props.table} />,
        size: getRowNumberCellSize({ dataLength: rows.length, screenWidth }),
      }),
      ...mappedHeaders.map((header) => {
        return columnHelper.accessor(header, {
          header,
        });
      }),
    ];
  }, [headers, rows.length, screenWidth]);

  const reactTable = useReactTable<TableRow>({
    data: rows,
    columns,
    defaultColumn: dataTableDefaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
    state: {
      columnOrder: [DATA_TABLE_ROW_NUMBER_COLUMN_ID, ...headers],
    },
    meta: {
      updateData: mutations?.updateCell,
    },
  });

  return reactTable;
}

function getRowNumberCellSize({
  dataLength,
  screenWidth,
}: {
  screenWidth: number;
  dataLength: number;
}) {
  const doublePadding = 17;
  const checkboxWidth = 24;
  const unitSize = 9;
  const stringifiedLength = dataLength.toString().length;

  const multi = screenWidth > 640 ? 1 : 0.83;

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
