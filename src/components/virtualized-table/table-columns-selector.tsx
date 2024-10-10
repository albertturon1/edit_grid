import { useState } from "react";
import type { FilePickerRow } from "@/features/home/components/headline-file-picker";
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
import { ChevronDown, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";

type TableManagementProps<T extends Table<FilePickerRow>> = {
	table: T;
	className?: string;
};

export function TableColumnsSelector<T extends Table<FilePickerRow>>({
	table,
	className,
}: TableManagementProps<T>) {
	const [columnSelectionMode, setColumnSelectionMode] = useState(false);

	return (
		<DropdownMenu
			open={columnSelectionMode}
			onOpenChange={setColumnSelectionMode}
		>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"flex gap-x-2 sm:gap-x-3 font-medium justify-between",
						columnSelectionMode ? "bg-accent" : "",
						className,
					)}
				>
					<div className="flex gap-x-2 sm:gap-x-3 items-center">
						<Columns3
							className={cn(
								"h-4 w-4",
								columnSelectionMode ? "text-primary" : "",
							)}
						/>
						{"Columns"}
					</div>
					<ChevronDown className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>{"Toggle columns"}</DropdownMenuLabel>
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
		if (typeof column.columnDef.header !== "string") {
			return null;
		}

		// omitting numerical column
		return (
			<DropdownMenuCheckboxItem
				onSelect={(event) => {
					// prevent closing dropdown menu after selecting an option
					event.preventDefault();
				}}
				key={column.columnDef.header}
				checked={column.getIsVisible()}
				onCheckedChange={(value) => column.toggleVisibility(!!value)}
			>
				{column.columnDef.header}
			</DropdownMenuCheckboxItem>
		);
	});
}
