import {
	FilePickerCore,
	type FilePickerCoreRef,
} from "@/components/file-picker-core";
import { useToast } from "@/components/hooks/use-toast";
import {
	ImportSettingsDialog,
	type ImportSettingsFormSchema,
} from "@/components/import-settings-dialog";
import { parseFile } from "@/lib/imports";
import { normalizeRawTableData } from "@/lib/imports/transformers/normalizeRawTableData";
import type { RawTableData } from "@/lib/imports/parsers/types";
import type { FileImportResult } from "@/lib/imports/types/import";
import { useRef, useState } from "react";

interface RoomImportFormProps {
	onFileImport: (props: FileImportResult) => void;
	height: number;
}

interface PendingImport {
	file: File;
	rawData: RawTableData;
}

export function RoomImportForm({ onFileImport, height }: RoomImportFormProps) {
	const { toast } = useToast();
	const inputRef = useRef<FilePickerCoreRef>(null);

	const [pendingImport, setPendingImport] = useState<PendingImport | null>(
		null,
	);

	async function handleFileSelected(file: File) {
		const result = await parseFile(file);

		if (!result.success) {
			toast({ title: "Cannot use this file" });
			return;
		}

		setPendingImport({
			file,
			rawData: result.data,
		});
	}

	function commitImport(
		pending: PendingImport,
		options: ImportSettingsFormSchema,
	): FileImportResult | void {
		const normalized = normalizeRawTableData(pending.rawData, {
			firstRowAsHeaders: options.firstRowAsHeaders,
		});

		if (!normalized) {
			toast({ title: "Cannot use this file" });
			return;
		}

		return {
			file: pending.file,
			table: normalized.table,
			metadata: {
				filename: pending.file.name,
				firstRowValues: options.firstRowAsHeaders
					? normalized.firstRowValues
					: [],
			},
		};
	}

	function handleImportDialogSubmit(options: ImportSettingsFormSchema) {
		if (!pendingImport) return;

		const result = commitImport(pendingImport, options);

		if (!result) {
			toast({ title: "Cannot import file" });
			return;
		}

		onFileImport(result);
		setPendingImport(null);
	}

	function handleCancel() {
		setPendingImport(null);
	}

	const isDialogOpen = pendingImport !== null;

	return (
		<div
			className="flex flex-col items-center justify-center"
			style={{ height }}
		>
			<div className="w-full max-w-md px-4">
				<h2 className="text-2xl font-bold text-center mb-8">Import CSV File</h2>

				<button
					type="button"
					onClick={(e) => inputRef.current?.showFilePicker(e)}
					className="flex flex-col bg-picker-secondary p-1 rounded-2xl w-full cursor-pointer"
				>
					<div className="flex flex-col gap-y-4 justify-center items-center w-full px-2 py-6 sm:py-8 rounded-2xl bg-picker-primary border border-dashed border-gray-400 font-medium text-[0.9rem]">
						<div className="flex justify-center items-center bg-picker-icon-background p-3 rounded-full">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								className="text-purple-400"
							>
								<title>Upload</title>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="17 8 12 3 7 8" />
								<line x1="12" y1="3" x2="12" y2="15" />
							</svg>
						</div>

						<div className="flex flex-col gap-y-2 text-center">
							<h1>Click here to upload your file</h1>
							<div className="text-muted-foreground text-sm text-slate-400">
								Supported formats: .csv
							</div>
						</div>
					</div>
				</button>
			</div>

			<FilePickerCore
				ref={inputRef}
				options={{
					fileSizeLimit: { size: 5, unit: "MB" },
				}}
				onFileImport={handleFileSelected}
			/>

			<ImportSettingsDialog
				open={isDialogOpen}
				dataLength={pendingImport?.rawData.length ?? 0}
				onOpenChange={(open) => {
					if (!open) handleCancel();
				}}
				onCancel={handleCancel}
				onSubmit={handleImportDialogSubmit}
			/>
		</div>
	);
}
