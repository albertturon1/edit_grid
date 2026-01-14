import { FileUploader } from "@/components/file-uploader";
import { ALLOWED_FILE_EXTENSIONS } from "@/lib/imports";
import type { FileImportResult } from "@/lib/imports/types/import";

interface RoomEmptyStateProps {
	onImport: (result: FileImportResult) => void;
}

export function RoomEmpty({ onImport }: RoomEmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className="w-full max-w-md px-4">
				<h2 className="text-2xl font-bold text-center mb-8">Import CSV File</h2>
				<FileUploader
					onFileImport={onImport}
					options={{
						fileSizeLimit: { size: 5, unit: "MB" },
						accept: ALLOWED_FILE_EXTENSIONS,
					}}
				/>
			</div>
		</div>
	);
}
