import {
	forwardRef,
	useImperativeHandle,
	useRef,
	type ChangeEvent,
	type MouseEvent,
} from "react";
import type { ParsedData } from "@/lib/file-parsers";
import { getParser } from "@/lib/file-parsers";
import { useToast } from "@/components/hooks/use-toast";

const ONE_BYTE = 1048576;

export type FilePickerCoreProps = {
	onFileImport: (file: File, result: ParsedData) => void;
	options?: {
		fileSizeLimit?: { size: number; unit: "MB" };
	};
};

export type FilePickerCoreRef = {
	showFilePicker: (event: MouseEvent<HTMLButtonElement>) => void;
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
			showFilePicker: (e: MouseEvent<HTMLButtonElement>) => {
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

		if (fileSizeLimit && firstFile.size > ONE_BYTE * fileSizeLimit.size) {
			toast({
				title: `File "${firstFile.name}" is too big.`,
				description: "Try again with a different file.",
			});

			return;
		}

		const parser = getParser(firstFile);

		if (!parser) {
			toast({
				title: `Unsupported file format: ${firstFile.name}`,
				description: "Try again with a supported format.",
			});
			return;
		}

		try {
			const result = await parser.parse(firstFile);
			onFileImport(firstFile, result);
			event.target.value = "";
		} catch {
			toast({
				title: "Failed to parse file.",
				description: "Try again with a different file.",
			});
		}
	}

	return (
		<input ref={inputRef} type="file" hidden onChange={handleInputChange} />
	);
});
