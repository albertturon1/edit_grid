import type { ParseResult } from "papaparse";
import {
	forwardRef,
	useImperativeHandle,
	useRef,
	type ChangeEvent,
	type MouseEvent,
} from "react";
import Papa from "papaparse";
import type { SupportedFormats } from "../features/home/components/headline-file-picker";
import { useToast } from "@/components/hooks/use-toast";

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
	const { toast } = useToast();
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
			toast({
				title: "Cannot open provided file.",
				description: "Try again with a different file.",
			});

			return;
		}

		if (fileSizeLimit && firstFile.size > ONE_BYTE * fileSizeLimit.size) {
			toast({
				title: `File "${firstFile.name}" is too big.`,
				description: "Try again with a different file.",
			});

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
