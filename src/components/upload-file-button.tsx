import { FileUp } from "lucide-react";
import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface UploadFileButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  title: string;
  subtitle?: string;
  className?: string;
}

export function UploadFileButton({ onClick, title, subtitle, className }: UploadFileButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      className={cn(
        "flex flex-col bg-picker-secondary p-1 rounded-2xl cursor-pointer w-full max-w-md",
        className,
      )}
    >
      <div className="flex flex-col gap-y-4 justify-center items-center w-full px-2 py-6 sm:py-8 rounded-2xl bg-picker-primary border border-dashed border-gray-400 font-medium text-[0.9rem]">
        <div
          className="flex justify-center items-center bg-picker-icon-background p-3 rounded-full"
          aria-hidden="true"
        >
          <FileUp size={32} strokeWidth={1.5} className="text-purple-400" />
        </div>

        <div className="flex flex-col gap-y-2 text-center">
          <span className="font-medium">{title}</span>
          {subtitle && <span className="text-sm text-slate-400">{subtitle}</span>}
        </div>
      </div>
    </button>
  );
}
