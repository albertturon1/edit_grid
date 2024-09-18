import type { FilePickerRow } from "@/components/file-picker";
import type { Table } from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ___INTERNAL_ID_COLUMN_ID } from "./useVirtualizedTable";
import { Columns } from "lucide-react";

type TableManagementProps<T extends Table<FilePickerRow>> = {
	table: T;
};

export function TableColumnsSelector<T extends Table<FilePickerRow>>({
	table,
}: TableManagementProps<T>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="flex gap-x-2 font-medium" variant="outline">
					<Columns className="h-4 w-4" />
					{"Select Columns"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>{"Toggle Columns"}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownItems table={table} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function DropdownItems<T extends Table<FilePickerRow>>({
	table,
}: { table: T }) {
	return table.getAllColumns().map((column) => {
		// not displaying numerical column
		if (column.id === ___INTERNAL_ID_COLUMN_ID) {
			return null;
		}

		// omitting numerical column
		return (
			<DropdownMenuCheckboxItem
				onSelect={(event) => {
					// prevent closing dropdown menu after selecting an option
					event.preventDefault();
				}}
				key={column.id}
				checked={column.getCanHide()}
				onCheckedChange={(value) => column.toggleVisibility(!!value)}
			>
				{column.id}
			</DropdownMenuCheckboxItem>
		);
	});
}
