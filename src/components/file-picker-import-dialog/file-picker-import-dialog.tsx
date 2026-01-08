import { useState, type RefObject } from "react";
import { z } from "zod";
import type { ParsedData } from "@/lib/file-parsers";
import {
	FilePickerCore,
	type FilePickerCoreProps,
	type FilePickerCoreRef,
} from "@/components/file-picker-core";
import { mapHeadersToRows } from "@/components/file-picker-import-dialog/mapHeadersToRows";
import type { OnFileImport } from "@/features/home/components/headline-picker";
import {
	ImportSettingsDialog,
	type ImportSettingsFormSchema,
} from "@/components/import-settings-dialog";
import { useToast } from "@/components/hooks/use-toast";

type Imported = {
	file: File;
	result: ParsedData;
};

export type FilePickerImportSettingsProps = Omit<
	FilePickerCoreProps,
	"onFileImport"
> & {
	onFileImport: (props: OnFileImport) => void;
	inputRef: RefObject<FilePickerCoreRef>;
};

export function FilePickerImportDialog({
	inputRef,
	onFileImport,
	...props
}: FilePickerImportSettingsProps) {
	const { toast } = useToast();

	const [dialogOpen, setDialogOpen] = useState(false);
	const [imported, setImported] = useState<Imported | null>(null);

	function handleOnFileImport(
		...[file, result]: Parameters<FilePickerCoreProps["onFileImport"]>
	) {
		setImported({
			file,
			result: {
				...result,
				rows: result.rows,
			},
		});

		setDialogOpen(true);
	}

	function handleImportDialogSubmit({
		firstRowAsHeaders,
		fromRow,
	}: ImportSettingsFormSchema) {
		if (imported) {
			const { headers, rows } = mapHeadersToRows(
				imported.result.rows,
				firstRowAsHeaders,
				fromRow,
			);

			onFileImport({
				file: imported.file,
				headers,
				rows,
			});

			handleOnCancel();
		}
	}

	function handleOnCancel() {
		setImported(null);
		setDialogOpen(false);
	}

	return (
		<>
			<FilePickerCore
				{...props}
				ref={inputRef}
				onFileImport={handleOnFileImport}
			/>
			<ImportSettingsDialog
				dataLength={imported?.result.rows.length ?? 0}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onCancel={handleOnCancel}
				onSubmit={handleImportDialogSubmit}
			/>
		</>
	);
}
