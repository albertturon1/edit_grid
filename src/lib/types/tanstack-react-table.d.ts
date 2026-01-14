// biome-ignore lint/correctness/noUnusedImports: <explanation>
import type { ExtendedContextMenuPosition } from "@/components/virtualized-table/virtualized-table";
import * as trt from "@tanstack/react-table";
type TableRow = Record<string, CellValue>;

// https://tanstack.com/table/v8/docs/framework/react/examples/editable-data
declare module "@tanstack/react-table" {
	type ContextMenuAction  = (position: ExtendedContextMenuPosition |null) => void;
	export type UpdateData = (rowIndex: number, columnId: string, value: string) => void
	export interface TableMeta<TData extends TableRow = TableRow> {
		updateData: UpdateData;
		contextMenu: {
			addRow: ContextMenuAction;
			addColumn: ContextMenuAction;
			removeRow: ContextMenuAction;
			removeColumn: ContextMenuAction;
			duplicateRow: ContextMenuAction;
		}
	}

	interface ColumnMeta {
		// used to apply in cell.column.columnDef.meta?.className
		className?: string;
	}
}
