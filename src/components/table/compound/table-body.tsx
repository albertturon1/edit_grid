import { useVirtualizer } from "@tanstack/react-virtual";
import { type RefObject, useEffect, useState, type ReactNode } from "react";
import { TableBody as UITableBody } from "@/components/ui/table";
import type { Table, Row } from "@tanstack/react-table";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import type { TableRow } from "@/lib/imports/types/table";

export interface VirtualRow {
  id: string;
  index: number;
  data: Row<TableRow>;
  virtualItem: VirtualItem;
  virtualizer: Virtualizer<HTMLElement, Element>;
}

interface TableBodyProps {
  table: Table<TableRow>;
  containerRef: RefObject<HTMLElement | null>;
  children: (rows: VirtualRow[]) => ReactNode;
  overscan?: number;
  estimateRowSize?: number;
}

export function TableBody({
  table,
  containerRef,
  children,
  overscan = 10,
  estimateRowSize = 60,
}: TableBodyProps) {
  const [isMounted, setIsMounted] = useState(false);
  const rows = table.getRowModel().rows;

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const virtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => estimateRowSize,
    getScrollElement: () => containerRef.current,
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan,
  });

  if (!isMounted) return null;

  const virtualRows: VirtualRow[] = virtualizer.getVirtualItems().map((virtualItem) => ({
    id: `row-${virtualItem.index}`,
    index: virtualItem.index,
    data: rows[virtualItem.index]!,
    virtualItem,
    virtualizer,
  }));

  return (
    <UITableBody className="relative grid" style={{ height: `${virtualizer.getTotalSize()}px` }}>
      {children(virtualRows)}
    </UITableBody>
  );
}
