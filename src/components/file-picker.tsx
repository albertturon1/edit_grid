import { useRef, type ChangeEvent } from "react";
import Papa from "papaparse";
import { FileUp } from "lucide-react";
import toast from "react-hot-toast";

export type FilePickerRow = Record<string, string>;

export type SupportedFormats = ".csv" | ".json";

export type FilePickerProps = {
	onFileChange: (props: { filename: string; values: FilePickerRow[] }) => void;
	accept: Partial<Record<SupportedFormats, boolean>>;
	fileSizeLimit?: { size: number; unit: "MB" };
	className?: string;
};

const ONE_BYTE = 1048576;

export function FilePicker({
	onFileChange,
	accept,
	fileSizeLimit,
}: FilePickerProps) {
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
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				onFileChange({
					filename: firstFile.name,
					values: results.data as FilePickerRow[],
				});
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
						<div>
							<div className="text-slate-400 text-sm">{`Supported formats: ${acceptConcat}`}</div>
							{fileSizeLimit ? (
								<div className="text-slate-400 text-sm">{`File size limit: ${fileSizeLimit.size}${fileSizeLimit.unit}`}</div>
							) : null}
						</div>
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
