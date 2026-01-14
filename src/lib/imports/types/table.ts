import type { CellValue } from "../parsers/types";

export type TableHeaders = string[];
export type TableRow = Record<string, CellValue>;

export interface TableData {
  headers: TableHeaders;
  rows: TableRow[];
}
