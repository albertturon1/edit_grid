import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRef, useState } from "react";
import type { Table } from "@tanstack/react-table";
import {
	filePickerAccepts,
	type FilePickerRow,
} from "@/features/home/components/headline-file-picker";
import type { TableHeaders } from "@/components/file-picker-import-dialog/mapHeadersToRows";
import { cn } from "@/lib/utils";
import type { FilePickerCoreRef } from "@/components/file-picker-core";
import type { OnFileImport } from "@/features/home/components/headline-picker";
import { Separator } from "@/components/ui/separator";
import { FilePickerImportDialog } from "../file-picker-import-dialog/file-picker-import-dialog";
import { useDataProperties } from "./hooks/useDataProperties";
import { ExportDialog, type ExportDialogFormSchema } from "./export-dialog";
import { exportBlobPartToFile } from "./utils/exportBlobPartToFile";
import { convertIntoCsv } from "./utils/convertIntoCsv";

type FileDropdownMenuProps<T extends Table<FilePickerRow>> = {
	table: T;
	originalFilename: string;
	rowSelectionMode: boolean;
	headers: TableHeaders;
	onFileImport: (props: OnFileImport) => void;
};

export function FileDropdownMenu<T extends Table<FilePickerRow>>({
	headers,
	onFileImport,
	originalFilename,
	rowSelectionMode,
	table,
}: FileDropdownMenuProps<T>) {
	const [active, setActive] = useState(false);
	const inputRef = useRef<FilePickerCoreRef>(null);
	const { dataStatus, allColumnNames, selectedRows, visibleColumnNames } =
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

	function handleFileDropdownOpening(
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
	) {
		// @ts-expect-error
		inputRef.current?.showFilePicker(e);
	}

	return (
		<DropdownMenu open={active} onOpenChange={setActive}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className={cn("flex gap-x-2 font-medium", active ? "bg-accent" : "")}
				>
					{"File"}
					<ChevronDown className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="ml-5 flex flex-col">
				<DropdownMenuItem
					className="gap-x-2 py-2"
					onClick={handleFileDropdownOpening}
				>
					{"Open"}
				</DropdownMenuItem>
				<Separator />
				<DropdownMenuItem className="gap-x-2 py-2" onClick={handleExportAll}>
					{dataStatus === "full" ? "Export" : "Export all"}
				</DropdownMenuItem>
				{dataStatus === "partial" ? (
					<>
						<Separator />
						<DropdownMenuItem
							className="gap-x-2 py-2"
							onClick={handleExportSelected}
						>
							{"Export selected"}
						</DropdownMenuItem>
					</>
				) : null}
				<Separator />
				<DropdownMenuItem className="gap-x-2 py-2" onClick={handleOpenDialog}>
					{"Export as"}
				</DropdownMenuItem>
			</DropdownMenuContent>
			<FilePickerImportDialog
				inputRef={inputRef}
				onFileImport={(e) => {
					onFileImport(e);
					setActive(false);
				}}
				fileSizeLimit={{ size: 5, unit: "MB" }}
				accept={filePickerAccepts}
			/>
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
