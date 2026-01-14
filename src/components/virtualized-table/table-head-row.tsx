import type { HeaderGroup } from "@tanstack/react-table";
import { TableHeadRowCell } from "@/components/virtualized-table/table-head-row-cell";
import type { TableRow } from "@/lib/imports/types/table";

export type TableHeadRowProps = {
  headerGroup: HeaderGroup<TableRow>;
};
export function TableHeadRow({ headerGroup }: TableHeadRowProps) {
  return (
    <tr className="flex" key={headerGroup.id}>
      {headerGroup.headers.map((header, idx) => {
        return <TableHeadRowCell key={header.id} header={header} idx={idx} />;
      })}
    </tr>
  );
}
