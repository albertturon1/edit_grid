import { ArrowRight, FileUp } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { Button } from "./ui/button";

type UploadFileButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function UploadFileButton(props: UploadFileButtonProps) {
  const title = "Upload your file";
  return (
    <Button
      {...props}
      aria-label={title}
      size="lg"
      className="h-14 px-8 text-base font-medium gap-2 group"
    >
      <FileUp className="w-5 h-5" />
      {title}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </Button>
  );
}
