import { Button } from "../ui/button";
import { Download } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ExportDialog, type ExportDialogFormSchema } from "./export-dialog";
import { useDataProperties } from "./useDataProperties";
import { useState } from "react";
import { convertIntoCsv } from "./convertIntoCsv";
import type { Table } from "@tanstack/react-table";
import type { FilePickerRow } from "../file-picker";
import { exportBlobPartToFile } from "./exportBlobPartToFile";

type ExportDataDropdownProps<T extends Table<FilePickerRow>> = {
	table: T;
	originalFilename: string;
};

export function ExportDataDropdown<T extends Table<FilePickerRow>>({
	table,
	originalFilename,
}: ExportDataDropdownProps<T>) {
	const { dataStatus, filteredRows } = useDataProperties(table);
	const [isExportAsDialogOpen, setIsExportAsDialogOpen] = useState(false);

	function exportAll(fn: string) {
		const rows = table.getRowModel().flatRows.map((row) => row.original);
		const content = convertIntoCsv(rows);

		exportBlobPartToFile({
			content,
			filename: fn,
		});
	}

	function exportSelected(fn: string) {
		const content = convertIntoCsv(filteredRows);

		exportBlobPartToFile({
			content,
			filename: fn,
		});
	}

	const handleOpenDialog = () => {
		setIsExportAsDialogOpen(true);
	};

	function handleExportAll() {
		exportAll(originalFilename);
	}

	function handleExportSelected() {
		exportSelected(originalFilename);
	}

	function onExportDialogCancel() {
		setIsExportAsDialogOpen(false);
	}

	function exportAs({ exportType, filename }: ExportDialogFormSchema) {
		switch (exportType) {
			case "all": {
				exportAll(filename);
				break;
			}
			case "selected": {
				exportSelected(filename);
				break;
			}
			case undefined: {
				break;
			}
			default: {
				throw new Error(
					"Reached code that wasn't supposed to be executed. Please report this bug to the author!",
				);
			}
		}
	}

	function onSubmit(data: ExportDialogFormSchema) {
		switch (dataStatus) {
			case "full": {
				exportAll(data.filename);
				break;
			}
			case "partial": {
				exportAs(data);
				break;
			}
		}

		setIsExportAsDialogOpen(false);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="flex gap-x-2 font-medium">
					<Download className="h-4 w-4" />
					{"Export"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="ml-5 flex flex-col">
				<DropdownMenuItem className="gap-x-2 py-2" onClick={handleExportAll}>
					{dataStatus === "full" ? "Export" : "Export all"}
				</DropdownMenuItem>
				{dataStatus === "full" ? null : (
					<>
						<Separator />
						<DropdownMenuItem
							className="gap-x-2 py-2"
							onClick={handleExportSelected}
						>
							{"Export selected"}
						</DropdownMenuItem>
					</>
				)}
				<Separator />
				<DropdownMenuItem className="gap-x-2 py-2" onClick={handleOpenDialog}>
					{"Export as"}
				</DropdownMenuItem>
			</DropdownMenuContent>
			<ExportDialog
				dataStatus={dataStatus}
				open={isExportAsDialogOpen}
				onOpenChange={setIsExportAsDialogOpen}
				onCancel={onExportDialogCancel}
				onSubmit={onSubmit}
			/>
		</DropdownMenu>
	);
}
