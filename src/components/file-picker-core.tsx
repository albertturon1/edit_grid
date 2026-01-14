import {
	type ChangeEvent,
	forwardRef,
	type MouseEvent,
	useImperativeHandle,
	useRef,
} from "react";
import { toast } from "sonner";
import { parseFile } from "@/lib/imports";
import type { RawTableData } from "@/lib/imports/parsers/types";

const KB_IN_BYTES = 1024;
const MB_IN_BYTES = 1024 * 1024;
const GB_IN_BYTES = 1024 * 1024 * 1024;

function convertToBytes(size: number, unit: "KB" | "MB" | "GB"): number {
	switch (unit) {
		case "KB":
			return size * KB_IN_BYTES;
		case "MB":
			return size * MB_IN_BYTES;
		case "GB":
			return size * GB_IN_BYTES;
	}
}

export type FilePickerCoreProps = {
	onFileImport: (file: File, result: RawTableData) => void;
	options: {
		fileSizeLimit: { size: number; unit: "KB" | "MB" | "GB" };
		accept: string[];
	};
};

function validateFile(file: File, maxSizeInBytes?: number): string | null {
	if (maxSizeInBytes && file.size > maxSizeInBytes) {
		return `File "${file.name}" is too big.`;
	}
	return null;
}

export type FilePickerCoreRef = {
	showFilePicker: (event: MouseEvent<HTMLElement>) => void;
};

export const FilePickerCore = forwardRef<
	FilePickerCoreRef,
	FilePickerCoreProps
>(function MyInput({ onFileImport, options }, ref) {
	const { fileSizeLimit, accept } = options ?? {};

	const acceptExtensions = accept?.join(", ");

	const inputRef = useRef<HTMLInputElement>(null);

	useImperativeHandle(ref, () => {
		return {
			showFilePicker: (e: MouseEvent<HTMLElement>) => {
				e.preventDefault();
				inputRef.current?.click();
			},
		};
	}, []);

	async function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		const firstFile = event?.target.files?.[0];

		if (!firstFile) {
			toast.error("Cannot open provided file.", {
				description: "Try again with a different file.",
			});
			return;
		}

		const maxSizeInBytes = fileSizeLimit
			? convertToBytes(fileSizeLimit.size, fileSizeLimit.unit)
			: undefined;

		const validationError = validateFile(firstFile, maxSizeInBytes);
		if (validationError) {
			toast.error(validationError, {
				description: "Try again with a different file.",
			});
			return;
		}

		const parsedFile = await parseFile(firstFile);

		if (!parsedFile.success) {
			toast.error(`Unsupported file format: ${firstFile.name}`, {
				description: "Try again with a supported format.",
			});
			return;
		}

		onFileImport(firstFile, parsedFile.data);
		event.target.value = "";
	}

	return (
		<input
			ref={inputRef}
			accept={acceptExtensions}
			type="file"
			hidden
			onChange={handleInputChange}
		/>
	);
});
