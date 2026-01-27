import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { Textarea } from "@/components/ui/textarea";

interface DefaultTableCellProps {
  value: string;
  rowIndex: number;
  columnId: string;
  updateData?: (rowIndex: number, columnId: string, value: string) => void;
}

export function DefaultTableCell({
  value: initialValue,
  rowIndex,
  columnId,
  updateData,
}: DefaultTableCellProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const debouncedUpdateCell = useDebounceCallback((rowIdx: number, colId: string, val: string) => {
    updateData?.(rowIdx, colId, val);
  }, 100);

  if (!updateData) {
    return <span className="px-2 py-2 text-sm">{value}</span>;
  }

  return (
    <Textarea
      value={value}
      onChange={(e) => {
        const newValue = e.target.value;
        setValue(newValue);
        debouncedUpdateCell(rowIndex, columnId, newValue);
      }}
      className="bg-inherit rounded-none border-white/0 focus:border-blue-700 px-2 w-full resize-none min-h-0 tabular-nums overflow-hidden hover:overflow-auto focus:overflow-auto text-xs sm:text-sm h-full"
    />
  );
}
