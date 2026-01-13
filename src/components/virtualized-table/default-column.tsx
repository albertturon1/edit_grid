import type { ColumnDef, UpdateData } from "@tanstack/react-table";
import { EditableCell } from "@/components/virtualized-table/editable-cell";
import type { TableRow } from "@/lib/imports/types/table";

export const tableDefaultColumn: Partial<ColumnDef<TableRow>> = {
	cell: ({ getValue, row, column, table }) => {
		return (
			<EditableCell
				value={getValue() as string}
				onUpdate={table.options.meta?.updateData as UpdateData}
				rowIndex={row.index}
				columnId={column.id}
			/>
		);
	},
};
