import { TableHeadRow } from "@/components/virtualized-table/table-head-row";
import { useTableData } from "./virtualized-table-context";

export function TableHead() {
  const { table } = useTableData();
  const headerGroups = table.getHeaderGroups();

  return (
    <thead className="bg-background grid sticky top-0 z-10 border-b text-xs sm:text-sm">
      {headerGroups.map((headerGroup) => {
        return <TableHeadRow key={headerGroup.id} headerGroup={headerGroup} />;
      })}
    </thead>
  );
}
