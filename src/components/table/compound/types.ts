import type { Cell, Header } from "@tanstack/react-table";
import type { TableRow } from "@/lib/imports/types/table";

export type ActiveCell =
  | ({ type: "cell" } & Cell<TableRow, unknown>)
  | ({ type: "header" } & Header<TableRow, unknown>);
