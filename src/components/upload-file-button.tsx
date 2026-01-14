import { FileUp } from "lucide-react";
import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface UploadFileButtonProps {
	onClick: (e: MouseEvent<HTMLButtonElement>) => void;
	title: string;
	subtitle?: string;
	className?: string;
}

export function UploadFileButton({
	onClick,
	title,
	subtitle,
	className,
}: UploadFileButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex flex-col bg-picker-secondary p-1 rounded-2xl w-full cursor-pointer",
				className,
			)}
		>
			<div className="flex flex-col gap-y-4 justify-center items-center w-full px-2 py-6 sm:py-8 rounded-2xl bg-picker-primary border border-dashed border-gray-400 font-medium text-[0.9rem]">
				<div className="flex justify-center items-center bg-picker-icon-background p-3 rounded-full">
					<FileUp size={32} strokeWidth={1.5} className="text-purple-400" />
				</div>

				<div className="flex flex-col gap-y-2 text-center">
					<h1>{title}</h1>
					{subtitle && (
						<div className="text-muted-foreground text-sm text-slate-400">
							{subtitle}
						</div>
					)}
				</div>
			</div>
		</button>
	);
}
