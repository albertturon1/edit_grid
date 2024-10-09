import { useState, type RefObject } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import type { ParseResult } from "papaparse";
import {
	FilePickerCore,
	type FilePickerCoreProps,
	type FilePickerCoreRef,
} from "@/features/home/components/filepicker/file-picker-core";
import { mapHeadersToRows } from "@/features/home/utils/mapHeadersToRows";
import type {
	OnFileImport,
	TemporalFileData,
} from "@/features/home/components/headline-picker";
import {
	ImportSettingsDialog,
	type ImportSettingsFormSchema,
} from "@/features/home/components/filepicker/import-settings-dialog";

const dataSchema = z.array(z.array(z.string())).min(1);

export type FilePickerImportSettingsProps = Omit<
	FilePickerCoreProps,
	"onFileImport"
> & {
	onFileImport: (props: OnFileImport) => void;
	inputRef: RefObject<FilePickerCoreRef>;
};

export function FilePickerImportSettings({
	inputRef,
	...props
}: FilePickerImportSettingsProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [imported, setImported] = useState<TemporalFileData | null>(null);

	function onFileImport({
		file,
		result,
	}: { file: File; result: ParseResult<unknown> }) {
		const parsedResult = dataSchema.safeParse(result.data);

		if (!parsedResult.success) {
			toast.error(
				"Cannot use provided file!\n\nTry again with a different file.",
				{ className: "text-sm", duration: 5000 },
			);
			return;
		}

		setImported({
			file,
			result: {
				...result,
				data: parsedResult.data,
			},
		});
		setDialogOpen(true);
	}

	function onSubmitSetData(
		file: File,
		data: string[][],
		fromRow: number,
		firstRowAsHeaders: boolean,
	) {
		const { headers, rows } = mapHeadersToRows(
			data,
			firstRowAsHeaders,
			fromRow,
		);

		props.onFileImport({
			file,
			headers,
			rows,
		});

		setDialogOpen(false);
	}

	function handleImportDialogSubmit(importSettings: ImportSettingsFormSchema) {
		if (imported) {
			onSubmitSetData(
				imported.file,
				imported.result.data,
				importSettings.fromRow,
				importSettings.firstRowAsHeaders,
			);
		}
	}

	function onCancel() {
		setDialogOpen(false);
	}

	return (
		<>
			<FilePickerCore
				ref={inputRef}
				onFileImport={onFileImport}
				accept={props.accept}
			/>
			{imported ? (
				<ImportSettingsDialog
					dataLength={imported.result.data.length}
					open={dialogOpen}
					onOpenChange={setDialogOpen}
					onCancel={onCancel}
					onSubmit={handleImportDialogSubmit}
				/>
			) : null}
		</>
	);
}
