import { FileUp } from "lucide-react";
import { useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";

interface DragDropFileProps {
  title: string;
  subtitle?: string;
  className?: string;
  isDragging?: boolean;
  onDragOver?: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: DragEvent<HTMLDivElement>) => void;
}

export function DragDropFile({
  title,
  subtitle,
  className,
  isDragging: externalIsDragging,
  onDragOver,
  onDragLeave,
  onDrop,
}: DragDropFileProps) {
  const [internalIsDragging, setInternalIsDragging] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isDragging = externalIsDragging ?? internalIsDragging;

  return (
    <div
      aria-label={title}
      className={cn(
        "relative max-w-2xl w-full mx-auto rounded-xl border-2 border-dashed transition-all duration-300",
        isDragging
          ? "border-accent bg-accent/5 scale-[1.02]"
          : "border-border hover:border-muted-foreground/50",
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        if (externalIsDragging === undefined) {
          setInternalIsDragging(true);
        }
        onDragOver?.(e);
      }}
      onDragLeave={(e) => {
        if (externalIsDragging === undefined) {
          setInternalIsDragging(false);
        }
        onDragLeave?.(e);
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (externalIsDragging === undefined) {
          setInternalIsDragging(false);
        }
        onDrop?.(e);
      }}
    >
      <div className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
          <FileUp className="w-8 h-8 text-accent" />
        </div>
        <p className="text-lg text-foreground font-medium mb-2">{title}</p>
        {!!subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}
