import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRef, useState } from "react";
import type { Row, Table } from "@tanstack/react-table";
import {
	filePickerAccepts,
	type FilePickerRow,
} from "@/features/home/components/headline-file-picker";
import type { TableHeaders } from "@/components/file-picker-import-dialog/mapHeadersToRows";
import { cn } from "@/lib/utils";
import type { FilePickerCoreRef } from "@/components/file-picker-core";
import type { OnFileImport } from "@/features/home/components/headline-picker";
import { Separator } from "@/components/ui/separator";
import { FilePickerImportDialog } from "@/components/file-picker-import-dialog/file-picker-import-dialog";
import { useDataProperties } from "@/components/virtualized-table/hooks/useDataProperties";
import {
	ExportDialog,
	type ExportDialogFormSchema,
} from "@/components/virtualized-table/export-dialog";
import { exportBlobPartToFile } from "@/components/virtualized-table/utils/exportBlobPartToFile";
import { convertIntoCsv } from "@/components/virtualized-table/utils/convertIntoCsv";

export type FileDropdownMenuProps = {
	table: Table<FilePickerRow>;
	originalFilename: string;
	rowSelectionMode: boolean;
	headers: TableHeaders;
	onFileImport: (props: OnFileImport) => void;
	className?: string;
};

export function FileDropdownMenu({
	headers,
	onFileImport,
	originalFilename,
	rowSelectionMode,
	table,
	className,
}: FileDropdownMenuProps) {
	const [active, setActive] = useState(false);
	const inputRef = useRef<FilePickerCoreRef>(null);
	const { selectedRows, visibleColumnNames } = useDataProperties(
		table,
		rowSelectionMode,
	);
	const [isExportAsDialogOpen, setIsExportAsDialogOpen] = useState(false);

	const handleOpenDialog = () => {
		setIsExportAsDialogOpen(true);
	};

	function handleExportDialogCancel() {
		setIsExportAsDialogOpen(false);
	}

	function handleFileDropdownOpening(
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
	) {
		// @ts-expect-error
		inputRef.current?.showFilePicker(e);
	}

	function handleOnFileImport(e: OnFileImport) {
		onFileImport(e);
		setActive(false);
	}

	function exportData(
		rows: Row<FilePickerRow>[],
		filename: string,
		includeHeaders: boolean,
	) {
		const content = getDataIntoCsv({
			rows,
			includeHeaders,
			visibleColumnNames,
		});

		exportBlobPartToFile({
			content,
			filename,
		});
	}

	const handleExport = (
		filename: string,
		includeHeaders: boolean,
		exportType: "selected" | "all",
	) => {
		const rows = {
			selected: selectedRows,
			all: table.getRowModel().flatRows,
		} as const satisfies Record<typeof exportType, Row<FilePickerRow>[]>;

		exportData(rows[exportType], filename, includeHeaders);
	};

	function handleExportDialogSubmit(formData: ExportDialogFormSchema) {
		handleExport(
			formData.filename,
			formData.includeHeaders,
			rowSelectionMode ? formData.exportType : "all",
		);
		setIsExportAsDialogOpen(false);
	}

	function handleExportAll() {
		handleExport(originalFilename, headers.isOriginal, "all");
	}

	function handleExportSelected() {
		handleExport(originalFilename, headers.isOriginal, "selected");
	}

	return (
		<DropdownMenu open={active} onOpenChange={setActive}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"flex gap-x-2 sm:gap-x-3 sm:w-max justify-between",
						active ? "bg-accent" : "",
						className,
					)}
				>
					{"File"}
					<ChevronDown className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="flex flex-col" align="start">
				<DropdownMenuItem
					className="gap-x-2 py-2"
					onClick={handleFileDropdownOpening}
				>
					{"Open"}
				</DropdownMenuItem>
				<Separator />
				<DropdownMenuItem className="gap-x-2 py-2" onClick={handleExportAll}>
					{rowSelectionMode ? "Export all" : "Export"}
				</DropdownMenuItem>
				{rowSelectionMode ? (
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
				onFileImport={handleOnFileImport}
				fileSizeLimit={{ size: 5, unit: "MB" }}
				accept={filePickerAccepts}
			/>
			<ExportDialog
				originalFilename={originalFilename}
				rowSelectionMode={rowSelectionMode}
				open={isExportAsDialogOpen}
				onOpenChange={setIsExportAsDialogOpen}
				onCancel={handleExportDialogCancel}
				onSubmit={handleExportDialogSubmit}
				headers={headers}
			/>
		</DropdownMenu>
	);
}

function getDataIntoCsv({
	includeHeaders,
	rows,
	visibleColumnNames,
}: {
	includeHeaders: boolean;
	visibleColumnNames: string[];
	rows: Row<FilePickerRow>[];
}) {
	const mappedRows = mapRowsIntoStringArrays(rows);
	const headers = includeHeaders ? visibleColumnNames : [];

	return convertIntoCsv(headers, mappedRows);
}

function mapRowsIntoStringArrays(rows: Row<FilePickerRow>[]) {
	return rows.map((row) => {
		return row.getAllCells().reduce<string[]>((acc, e) => {
			const value = e.getValue();
			if (e.column.getIsVisible() && typeof value === "string") {
				acc.push(value);
			}
			return acc;
		}, []);
	});
}
