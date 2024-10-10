import type { ParseResult } from "papaparse";
import {
	forwardRef,
	useImperativeHandle,
	useRef,
	type ChangeEvent,
	type MouseEvent,
} from "react";
import toast from "react-hot-toast";
import Papa from "papaparse";
import type { SupportedFormats } from "../features/home/components/headline-file-picker";

const ONE_BYTE = 1048576;

export type OnFileImportProps = {
	file: File;
	result: ParseResult<unknown>;
};

export type FilePickerCoreProps = {
	onFileImport: (props: OnFileImportProps) => void;
	fileSizeLimit?: { size: number; unit: "MB" };
	accept?: Partial<Record<SupportedFormats, boolean>>;
};

export type FilePickerCoreRef = {
	showFilePicker: (event: MouseEvent<HTMLButtonElement>) => void;
};

export const FilePickerCore = forwardRef<
	FilePickerCoreRef,
	FilePickerCoreProps
>(function MyInput({ accept, onFileImport, fileSizeLimit }, ref) {
	const inputRef = useRef<HTMLInputElement>(null);

	useImperativeHandle(
		ref,
		() => {
			return {
				showFilePicker: (e: MouseEvent<HTMLButtonElement>) => {
					e.preventDefault();
					inputRef.current?.click();
				},
			};
		},
		[],
	);

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		const firstFile = event?.target.files?.[0];

		if (!firstFile) {
			toast.error(
				"Cannot open provided file!\n\nTry again with a different file.",
				{
					className: "text-sm",
					duration: 5000,
				},
			);
			return;
		}

		if (fileSizeLimit && firstFile.size > ONE_BYTE * fileSizeLimit.size) {
			toast.error(
				`File "${firstFile.name}" is too big!\n\nTry again with a different file.`,
				{
					className: "text-sm",
					duration: 5000,
				},
			);

			return;
		}

		Papa.parse(firstFile, {
			skipEmptyLines: true,
			complete: (props) => {
				onFileImport({
					file: firstFile,
					result: props,
				});
			},
		});

		// Reset the input value to trigger onChange again for the same file
		event.target.value = ""; // This will trigger onChange on the next selection
	}

	const acceptConcat = accept ? Object.keys(accept).join(",") : undefined;

	return (
		<input
			ref={inputRef}
			type="file"
			accept={acceptConcat}
			hidden
			onChange={handleInputChange}
		/>
	);
});
