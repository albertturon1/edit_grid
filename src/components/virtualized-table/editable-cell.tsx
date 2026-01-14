import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { Textarea } from "@/components/ui/textarea";

interface EditableCellProps {
  value: string;
  onUpdate: (rowIndex: number, columnId: string, value: string) => void;
  rowIndex: number;
  columnId: string;
}

/**
 * Editable cell component with local state + Y.js sync pattern.
 *
 * Why local state:
 * - Immediate UI feedback during typing (no network latency)
 * - Debounced updates to Y.js (performance)
 *
 * Why useEffect syncs from props:
 * - When remote user edits same cell, Y.js updates -> new value prop
 * - useEffect catches this and updates local state
 * - Without this, remote changes would be invisible until blur
 *
 */
export function EditableCell({
  value: initialValue,
  onUpdate,
  rowIndex,
  columnId,
}: EditableCellProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const debouncedUpdateCell = useDebounceCallback(
    (rowIndex: number, columnId: string, val: string) => {
      onUpdate(rowIndex, columnId, val);
    },
    100,
  );

  return (
    <Textarea
      value={value}
      onChange={(e) => {
        const newValue = e.target.value;
        setValue(newValue);
        debouncedUpdateCell(rowIndex, columnId, newValue);
      }}
      className="bg-inherit rounded-none border-white/0 focus:border-blue-700 px-2 w-full resize-none min-h-0 tabular-nums overflow-hidden hover:overflow-auto focus:overflow-auto text-xs sm:text-sm"
    />
  );
}
