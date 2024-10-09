import type { ColumnDef } from "@tanstack/react-table";
import type { FilePickerRow } from "@/features/home/components/headline-file-picker";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

// Give our default column cell renderer editing superpowers!
export const tableDefaultColumn: Partial<ColumnDef<FilePickerRow>> = {
	cell: ({ row, column, table }) => {
		const initialValue =
			typeof column.columnDef.header === "string"
				? row.original[column.columnDef.header]
				: "";

		// We need to keep and update the state of the cell normally
		const [value, setValue] = useState(initialValue);

		// When the input is blurred, we'll call our table meta's updateData function
		const onBlur = () => {
			table.options.meta?.updateData(row.index, column.id, value);
		};

		// If the initialValue is changed external, sync it up with our state
		useEffect(() => {
			setValue(initialValue);
		}, [initialValue]);

		return (
			<Textarea
				value={value as string}
				onChange={(e) => setValue(e.target.value)}
				onBlur={onBlur}
				className="bg-inherit rounded-none border-white/0 focus:border-blue-700 px-2 w-full resize-none min-h-0 tabular-nums overflow-hidden hover:overflow-auto focus:overflow-auto" //border-white/0 to avoid double borders and layout shifts in other cells
			/>
		);
	},
};
