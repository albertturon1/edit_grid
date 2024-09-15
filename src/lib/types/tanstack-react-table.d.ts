// biome-ignore lint/correctness/noUnusedImports: <explanation>
import * as trt from "@tanstack/react-table";

// https://tanstack.com/table/v8/docs/framework/react/examples/editable-data
declare module "@tanstack/react-table" {
	interface TableMeta<TData extends RowData> {
		updateData: (rowIndex: number, columnId: string, value: unknown) => void;
	}
}
