import { FileUploader } from "@/components/file-uploader";
import { ALLOWED_FILE_EXTENSIONS } from "@/lib/imports";
import type { FileImportResult } from "@/lib/imports/types/import";

interface RoomEmptyStateProps {
	onImport: (result: FileImportResult) => void;
}

export function RoomEmpty({ onImport }: RoomEmptyStateProps) {
	return (
		<div className="max-w-md px-4 gap-8 flex flex-1 flex-col items-center justify-center">
			<h2 className="text-2xl font-bold text-center">Import CSV File</h2>

			<FileUploader
				onFileImport={onImport}
				options={{
					fileSizeLimit: { size: 5, unit: "MB" },
					accept: ALLOWED_FILE_EXTENSIONS,
				}}
			/>
		</div>
	);
}
