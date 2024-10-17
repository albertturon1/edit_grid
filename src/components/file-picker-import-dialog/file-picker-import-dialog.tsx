import { useState, type RefObject } from "react";
import { z } from "zod";
import type { ParseResult } from "papaparse";
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

const dataSchema = z.array(z.array(z.string())).min(1);

type Imported = {
	file: File;
	result: Pick<ParseResult<unknown>, "errors" | "meta"> & {
		data: string[][];
	};
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
		const parsedResult = dataSchema.safeParse(result.data);

		if (!parsedResult.success) {
			toast({
				title: "Cannot use provided file.",
				description: "Try again with a different file.",
			});

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
				dataLength={imported?.result.data.length ?? 0}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onCancel={handleOnCancel}
				onSubmit={handleImportDialogSubmit}
			/>
		</>
	);
}
