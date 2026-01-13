import {
	type ChangeEvent,
	forwardRef,
	type MouseEvent,
	useImperativeHandle,
	useRef,
} from "react";
import { useToast } from "@/components/hooks/use-toast";
import { parseFile } from "@/lib/imports";
import type { RawTableData } from "@/lib/imports/parsers/types";

const MB_IN_BYTES = 1024 * 1024;

export type FilePickerCoreProps = {
	onFileImport: (file: File, result: RawTableData) => void;
	options?: {
		fileSizeLimit?: { size: number; unit: "MB" };
	};
};

function validateFile(file: File, limit?: { size: number }): string | null {
	if (limit && file.size > MB_IN_BYTES * limit.size) {
		return `File "${file.name}" is too big. Max size is ${limit.size}MB.`;
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
	const { fileSizeLimit } = options ?? {};
	const { toast } = useToast();
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
			toast({
				title: "Cannot open provided file.",
				description: "Try again with a different file.",
			});
			return;
		}

		const validationError = validateFile(firstFile, fileSizeLimit);
		if (validationError) {
			toast({
				title: validationError,
				description: "Try again with a different file.",
			});
			return;
		}

		const parsedFile = await parseFile(firstFile);

		if (!parsedFile.success) {
			toast({
				title: `Unsupported file format: ${firstFile.name}`,
				description: "Try again with a supported format.",
			});
			return;
		}

		onFileImport(firstFile, parsedFile.data);
		event.target.value = "";
	}

	return (
		<input ref={inputRef} type="file" hidden onChange={handleInputChange} />
	);
});
