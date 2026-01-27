import type { CellValue } from "@/lib/imports/parsers/types";

type TableRow = Record<string, CellValue>;

// https://tanstack.com/table/v8/docs/framework/react/examples/editable-data
declare module "@tanstack/react-table" {
  export type UpdateData = (rowIndex: number, columnId: string, value: string) => void;

  export interface TableMeta<TData extends TableRow = TableRow> {
    updateData?: UpdateData;
  }

  interface ColumnMeta {
    className?: string;
  }
}
