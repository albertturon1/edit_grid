import { useState, type RefObject } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import type { ParseResult } from "papaparse";
import {
	FilePickerCore,
	type FilePickerCoreProps,
	type FilePickerCoreRef,
} from "@/components/file-picker-core";
import { mapHeadersToRows } from "@/components/file-picker-import-dialog/mapHeadersToRows";
import type {
	OnFileImport,
	TemporalFileData,
} from "@/features/home/components/headline-picker";
import {
	ImportSettingsDialog,
	type ImportSettingsFormSchema,
} from "@/components/import-settings-dialog";

const dataSchema = z.array(z.array(z.string())).min(1);

export type FilePickerImportSettingsProps = Omit<
	FilePickerCoreProps,
	"onFileImport"
> & {
	onFileImport: (props: OnFileImport) => void;
	inputRef: RefObject<FilePickerCoreRef>;
};

export function FilePickerImportDialog({
	inputRef,
	...props
}: FilePickerImportSettingsProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [imported, setImported] = useState<TemporalFileData | null>(null);

	function handleOnFileImport({
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

	function handleImportDialogSubmit({
		firstRowAsHeaders,
		fromRow,
	}: ImportSettingsFormSchema) {
		if (imported) {
			const { headers, rows } = mapHeadersToRows(
				imported.result.data,
				firstRowAsHeaders,
				fromRow,
			);

			props.onFileImport({
				file: imported.file,
				headers,
				rows,
			});
		}
	}

	function handleOnCancel() {
		setImported(null);
		setDialogOpen(false);
	}

	return (
		<>
			<FilePickerCore
				ref={inputRef}
				onFileImport={handleOnFileImport}
				accept={props.accept}
			/>
			{imported ? (
				<ImportSettingsDialog
					dataLength={imported.result.data.length}
					open={dialogOpen}
					onOpenChange={setDialogOpen}
					onCancel={handleOnCancel}
					onSubmit={handleImportDialogSubmit}
				/>
			) : null}
		</>
	);
}
