import type { FilePickerRow } from "@/components/file-picker";
import type { Table } from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ___INTERNAL_ID_COLUMN_NAME } from "./useVirtualizedTable";

type TableManagementProps<T extends Table<FilePickerRow>> = {
	table: T;
};

export function TableColumnsSelector<T extends Table<FilePickerRow>>({
	table,
}: TableManagementProps<T>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="ml-auto bg-slate-100 text-slate-900"
				>
					{"Columns"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" aria-modal={false}>
				{table.getAllColumns().reduce((acc, column) => {
					// omitting numeral column
					if (column.getCanHide() && column.id !== ___INTERNAL_ID_COLUMN_NAME) {
						acc.push(
							<DropdownMenuCheckboxItem
								onSelect={(event) => event.preventDefault()} //prevent closing dropdown menu after selecting an option
								key={column.id}
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
							>
								{column.id}
							</DropdownMenuCheckboxItem>,
						);
					}
					return acc;
				}, [] as JSX.Element[])}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
