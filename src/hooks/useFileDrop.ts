import { useState, useCallback, type DragEvent } from "react";
import { toast } from "sonner";
import { parseFile } from "@/lib/imports";
import { validateFile, type FileSizeLimit } from "@/lib/imports/file-validation";
import type { RawTableData } from "@/lib/imports/parsers/types";

export type UseFileDropOptions = {
  onFileImport: (file: File, rawData: RawTableData) => void;
  options: {
    fileSizeLimit: FileSizeLimit;
    accept: string[];
  };
};

export type UseFileDropReturn = {
  isDragging: boolean;
  handlers: {
    onDragOver: (e: DragEvent<HTMLElement>) => void;
    onDragLeave: (e: DragEvent<HTMLElement>) => void;
    onDrop: (e: DragEvent<HTMLElement>) => void;
  };
};

export function useFileDrop({ onFileImport, options }: UseFileDropOptions): UseFileDropReturn {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      const firstFile = files?.[0];

      if (!firstFile) {
        toast.error("No file detected.", {
          description: "Try dragging a file again.",
        });
        return;
      }

      // Validate file size and extension
      const validationError = validateFile(firstFile, {
        fileSizeLimit: options.fileSizeLimit,
        accept: options.accept,
      });

      if (validationError) {
        toast.error(validationError, {
          description: "Try again with a different file.",
        });
        return;
      }

      // Parse the file
      const parsedFile = await parseFile(firstFile);

      if (!parsedFile.success) {
        toast.error(`Unsupported file format: ${firstFile.name}`, {
          description: "Try again with a supported format.",
        });
        return;
      }

      onFileImport(firstFile, parsedFile.data);
    },
    [onFileImport, options.fileSizeLimit, options.accept],
  );

  return {
    isDragging,
    handlers: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  };
}
