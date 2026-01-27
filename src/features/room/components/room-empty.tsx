import { ButtonFileUploader } from "@/components/button-file-uploader";
import type { FileImportResult } from "@/lib/imports/types/import";
import { DragDropFileUploader } from "@/components/dragdrop-file-uploader";
import { FILE_UPLOAD_OPTIONS } from "@/constants";

interface RoomEmptyStateProps {
  onImport: (result: FileImportResult) => void;
}

export function RoomEmpty({ onImport }: RoomEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8 flex-1">
      <ButtonFileUploader onFileImport={onImport} options={FILE_UPLOAD_OPTIONS} />

      <div className="flex items-center gap-3 w-full max-w-lg">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <DragDropFileUploader onFileImport={onImport} options={FILE_UPLOAD_OPTIONS} />
    </div>
  );
}
