import {
	forwardRef,
	useImperativeHandle,
	useRef,
	type ChangeEvent,
	type MouseEvent,
} from "react";
import { useToast } from "@/components/hooks/use-toast";
import { parseFile } from "@/lib/imports";
import type { RawTableData } from "@/lib/imports/parsers/types";

const ONE_BYTE = 1048576;

export type FilePickerCoreProps = {
	onFileImport: (file: File, result: RawTableData) => void;
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
