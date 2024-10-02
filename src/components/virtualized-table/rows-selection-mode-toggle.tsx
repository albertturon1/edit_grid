import { Toggle } from "@/components/ui/toggle";
import { Rows3 } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectedRowsIndicatorProps = {
	rowSelectionMode: boolean;
	onRowSelectionModeChange: (pressed: boolean) => void;
};

export function RowsSelectionModeToggle({
	rowSelectionMode,
	onRowSelectionModeChange,
}: SelectedRowsIndicatorProps) {
	return (
		<Toggle
			pressed={rowSelectionMode}
			onPressedChange={onRowSelectionModeChange}
			variant={"outline"}
			aria-label="Toggle italic"
		>
			<div
				className={cn("flex items-center gap-x-2 font-medium transition-text")}
			>
				<Rows3
					className={cn("h-4 w-4", rowSelectionMode ? "text-primary" : "")}
				/>
				{"Rows"}
			</div>
		</Toggle>
	);
}
