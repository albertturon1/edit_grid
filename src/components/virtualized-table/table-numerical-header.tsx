import type { HeaderContext } from "@tanstack/react-table";
import type { FilePickerRow } from "../file-picker";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";

type TableNumericalHeaderProps = HeaderContext<FilePickerRow, string>;

export function TableNumericalHeader({ table }: TableNumericalHeaderProps) {
	function onClick() {
		table.toggleAllPageRowsSelected();
	}

	return (
		<div
			className={cn(
				"w-full h-full flex group items-center pr-[7px] gap-x-2 hover:cursor-pointer",
			)}
			onKeyDown={onClick}
			onClick={onClick}
		>
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate") // keep "indeterminate" here
				}
				aria-label="Select all"
				className={cn(
					!table.getIsAllPageRowsSelected()
						? "opacity-50 group-hover:opacity-100"
						: "",
				)}
			/>
			<h1
				className={cn(
					table.getIsAllPageRowsSelected() ? "text-black" : "text-slate-500",
				)}
			>
				{"All"}
			</h1>
		</div>
	);
}
