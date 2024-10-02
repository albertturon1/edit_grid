import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	ExportDialog,
	type ExportDialogFormSchema,
} from "@/components/virtualized-table/export-dialog";
import { useDataProperties } from "@/components/virtualized-table/hooks/useDataProperties";
import { useState } from "react";
import type { Table } from "@tanstack/react-table";
import type { FilePickerRow } from "@/features/home/components/filepicker/file-picker";
import { convertIntoCsv } from "@/components/virtualized-table/utils/convertIntoCsv";
import { exportBlobPartToFile } from "@/components/virtualized-table/utils/exportBlobPartToFile";
import type { TableHeaders } from "@/features/home/utils/mapHeadersToRows";

type ExportDataDropdownProps<T extends Table<FilePickerRow>> = {
	table: T;
	originalFilename: string;
	rowSelectionMode: boolean;
	headers: TableHeaders;
};

export function ExportDataDropdown<T extends Table<FilePickerRow>>({
	table,
	originalFilename,
	rowSelectionMode,
	headers,
}: ExportDataDropdownProps<T>) {
	const { dataStatus, selectedRows, allColumnNames, visibleColumnNames } =
		useDataProperties(table, rowSelectionMode);
	const [isExportAsDialogOpen, setIsExportAsDialogOpen] = useState(false);

	const handleOpenDialog = () => {
		setIsExportAsDialogOpen(true);
	};

	function handleExportAll() {
		exportAll({
			filename: originalFilename,
			includeHeaders: headers.isOriginal,
		});
	}

	function handleExportSelected() {
		exportSelected({
			filename: originalFilename,
			includeHeaders: headers.isOriginal,
		});
	}

	function handleExportDialogCancel() {
		setIsExportAsDialogOpen(false);
	}

	function exportAll({
		filename,
		includeHeaders,
	}: { filename: string; includeHeaders: boolean }) {
		const rows = table
			.getRowModel()
			.flatRows.map((row) => Object.values(row.original));
		const headers = includeHeaders ? allColumnNames : [];

		const content = convertIntoCsv(headers, rows);

		exportBlobPartToFile({
			content,
			filename,
		});
	}

	function exportSelected({
		filename,
		includeHeaders,
	}: { filename: string; includeHeaders: boolean }) {
		const rows = selectedRows.map((row) => Object.values(row.original));
		const headers = includeHeaders ? visibleColumnNames : [];

		const content = convertIntoCsv(headers, rows);

		exportBlobPartToFile({
			content,
			filename,
		});
	}

	function exportAs({
		exportType,
		filename,
		includeHeaders,
	}: ExportDialogFormSchema) {
		switch (exportType) {
			case "all": {
				exportAll({ filename, includeHeaders });
				break;
			}
			case "selected": {
				exportSelected({ filename, includeHeaders });
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

	function handleExportDialogSubmit(formData: ExportDialogFormSchema) {
		switch (dataStatus) {
			case "full": {
				exportAll({
					filename: formData.filename,
					includeHeaders: formData.includeHeaders,
				});
				break;
			}
			case "partial": {
				exportAs(formData);
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
				originalFilename={originalFilename}
				dataStatus={dataStatus}
				open={isExportAsDialogOpen}
				onOpenChange={setIsExportAsDialogOpen}
				onCancel={handleExportDialogCancel}
				onSubmit={handleExportDialogSubmit}
				headers={headers}
			/>
		</DropdownMenu>
	);
}
