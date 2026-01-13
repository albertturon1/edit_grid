import { useState, type RefObject } from "react";
import {
	FilePickerCore,
	type FilePickerCoreProps,
	type FilePickerCoreRef,
} from "@/components/file-picker-core";
import {
	ImportSettingsDialog,
	type ImportSettingsFormSchema,
} from "@/components/import-settings-dialog";
import type { FileImportResult } from "@/lib/imports/types/import";
import { normalizeRawTableData } from "@/lib/imports/transformers/normalizeRawTableData";
import type { RawTableData } from "@/lib/imports/parsers/types";

type Imported = {
	file: File;
	rawData: RawTableData;
};

export type FilePickerImportSettingsProps = Omit<
	FilePickerCoreProps,
	"onFileImport"
> & {
	onFileImport: (data: FileImportResult) => void;
	inputRef: RefObject<FilePickerCoreRef>;
};

export function FilePickerImportDialog({
	inputRef,
	onFileImport,
	...props
}: FilePickerImportSettingsProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [imported, setImported] = useState<Imported | null>(null);

	function handleOnFileImport(
		...[file, rawData]: Parameters<FilePickerCoreProps["onFileImport"]>
	) {
		setImported({
			file,
			rawData,
		});

		setDialogOpen(true);
	}

	function handleImportDialogSubmit({
		firstRowAsHeaders,
	}: ImportSettingsFormSchema) {
		if (!imported) {
			return;
		}
		const data = normalizeRawTableData(imported.rawData, {
			firstRowAsHeaders,
		});

		if (data) {
			onFileImport({
				file: imported.file,
				table: data.table,
				metadata: {
					filename: imported.file.name,
					firstRowValues: data.firstRowValues,
				},
			});
		}

		handleOnCancel();
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
				dataLength={imported?.rawData.length ?? 0}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onCancel={handleOnCancel}
				onSubmit={handleImportDialogSubmit}
			/>
		</>
	);
}
