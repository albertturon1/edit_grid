import type { MouseEvent } from "react";
import { FileUp } from "lucide-react";
import type { FilePickerCoreProps } from "@/components/file-picker-core";
import {
	FilePickerImportDialog,
	type FilePickerImportSettingsProps,
} from "@/components/file-picker-import-dialog/file-picker-import-dialog";

export const filePickerAccepts: FilePickerAccept = {
	".csv": true,
};

export type FilePickerRow = Record<string, string>;

export type SupportedFormats = ".csv" | ".json";
export type FilePickerAccept = Partial<Record<SupportedFormats, boolean>>;

export type FilePickerProps = Omit<FilePickerImportSettingsProps, "options"> & {
	className?: string;
	onClick: (event: MouseEvent<HTMLButtonElement>) => void;
	filePickerOptions?: FilePickerCoreProps["options"];
};

export function HeadlineFilePicker({
	onClick,
	filePickerOptions,
	...props
}: FilePickerProps) {
	const acceptConcat = filePickerAccepts
		? Object.keys(filePickerAccepts).join(",")
		: null;

	return (
		<>
			<button
				type="button"
				onClick={onClick}
				className="flex flex-col bg-picker-secondary p-1 rounded-2xl w-full"
			>
				<div className="flex flex-col gap-y-4 justify-center items-center w-full px-2 py-6 sm:py-8 rounded-2xl bg-picker-primary border border-dashed border-gray-400 font-medium text-[0.9rem]">
					<div className="flex justify-center items-center bg-picker-icon-background p-3 rounded-full">
						<FileUp size={32} strokeWidth={1.5} className="text-purple-400" />
					</div>
					<div className="flex flex-col gap-y-2">
						<h1 className="">
							{"Click here to upload your file."}
							{/* {"Click here to upload your file or drag and drop"} */}
						</h1>
						<div className="text-muted-foreground">
							{acceptConcat ? (
								<div className="text-slate-400 text-sm">{`Supported formats: ${acceptConcat}`}</div>
							) : null}
							{filePickerOptions?.fileSizeLimit ? (
								<div className="text-slate-400 text-sm">{`File size limit: ${filePickerOptions.fileSizeLimit.size}${filePickerOptions.fileSizeLimit.unit}`}</div>
							) : null}
						</div>
					</div>
				</div>
			</button>
			<FilePickerImportDialog
				{...props}
				options={{
					fileSizeLimit: filePickerOptions?.fileSizeLimit,
					accept: filePickerAccepts,
				}}
			/>
		</>
	);
}
