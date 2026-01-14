import { useVirtualizer } from "@tanstack/react-virtual";
import { type RefObject, useEffect, useState } from "react";
import { TableBodyRow } from "@/components/virtualized-table/table-body-row";
import { useTableData } from "./virtualized-table-context";

type TableBodyProps = {
  tableContainerRef: RefObject<HTMLDivElement>;
};

export function TableBody({ tableContainerRef }: TableBodyProps) {
  const { table } = useTableData();
  const rows = table.getRowModel().rows;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 60, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 10,
  });

  if (!isMounted) {
    // Wait for client-side rendering
    return null;
  }

  return (
    <tbody
      className="relative grid"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => (
        <TableBodyRow
          key={virtualRow.index}
          virtualRow={virtualRow}
          rowVirtualizer={rowVirtualizer}
          rowIdx={virtualRow.index}
        />
      ))}
    </tbody>
  );
}
