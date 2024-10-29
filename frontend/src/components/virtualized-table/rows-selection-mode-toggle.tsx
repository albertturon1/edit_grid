import { Toggle } from "@/components/ui/toggle";
import { Rows3 } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectedRowsIndicatorProps = {
	rowSelectionMode: boolean;
	onRowSelectionModeChange: (pressed: boolean) => void;
	className?: string;
};

export function RowsSelectionModeToggle({
	rowSelectionMode,
	onRowSelectionModeChange,
	className,
}: SelectedRowsIndicatorProps) {
	return (
		<Toggle
			pressed={rowSelectionMode}
			onPressedChange={onRowSelectionModeChange}
			variant={"outline"}
			aria-label="Toggle italic"
			className={cn(
				"justify-start flex items-center gap-x-2 sm:gap-x-3 transition-text bg-background",
				className,
			)}
		>
			<Rows3
				className={cn("h-4 w-4", rowSelectionMode ? "text-primary" : "")}
			/>
			{"Rows"}
		</Toggle>
	);
}
