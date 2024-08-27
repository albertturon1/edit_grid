import { useRef, type ChangeEvent } from "react";
import Papa from "papaparse";
import { FileUp } from "lucide-react";

export type FilePickerRow = Record<string, string>;

export type SupportedFormats = ".csv" | ".json";

type FilePickerProps = {
	onFileChange: (values: FilePickerRow[]) => void;
	accept: Partial<Record<SupportedFormats, boolean>>;
	className?: string;
};

export function FilePicker({ onFileChange, accept }: FilePickerProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		if (!inputRef || !inputRef.current) return;

		inputRef.current.click();
	}

	function handleFilePicker(event: ChangeEvent<HTMLInputElement> | undefined) {
		const firstFile = event?.target.files?.[0];

		if (!firstFile) {
			return;
		}

		Papa.parse(firstFile, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				onFileChange(results.data as FilePickerRow[]);
			},
		});
	}

	const acceptConcat = Object.keys(accept).join(",");

	return (
		<>
			<button
				type="button"
				onClick={handleButtonClick}
				className="flex flex-col bg-picker-secondary p-1 rounded-2xl"
			>
				<div className="flex flex-col gap-y-4 justify-center items-center max-w-max px-14 py-8 rounded-2xl bg-picker-primary border border-dashed border-gray-400 text-slate-700 font-medium text-[0.9rem]">
					<div className="flex justify-center items-center bg-picker-icon-background p-3 rounded-full">
						<FileUp size={32} strokeWidth={1.5} className="text-purple-400" />
					</div>
					<div className="flex flex-col gap-y-2">
						<div>{"Click here to upload your file or drag and drop"}</div>
						<div className="text-slate-400 text-sm">{`Supported formats: ${acceptConcat}`}</div>
					</div>
				</div>
			</button>
			<input
				ref={inputRef}
				type="file"
				accept={acceptConcat}
				hidden
				onChange={handleFilePicker}
			/>
		</>
	);
}
