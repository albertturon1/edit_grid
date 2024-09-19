import type { CellContext } from "@tanstack/react-table";
import type { FilePickerRow } from "../file-picker";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

type TableNumericalCellProps = CellContext<FilePickerRow, string>;

export function TableNumericalCell({ row, table }: TableNumericalCellProps) {
	return (
		<div className={"text-slate-500 w-full flex gap-x-2 pl-2 pt-2.5"}>
			<Checkbox
				className={cn(
					"mt-[3px]",
					!row.getIsSelected() ? "opacity-50 hover:opacity-100" : "",
				)}
				checked={row.getIsSelected()}
				onCheckedChange={() => {
					row.toggleSelected();
				}}
			/>
			<h1 className="mt-[1px]">
				{(table
					.getSortedRowModel()
					?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1}
			</h1>
		</div>
	);
}
