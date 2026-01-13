import { Rows3 } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTableData } from "@/components/virtualized-table/virtualized-table-context";
import { cn } from "@/lib/utils";

type RowsSelectionModeToggleProps = {
	className?: string;
};

export function RowsSelectionModeToggle({
	className,
}: RowsSelectionModeToggleProps) {
	const { rowSelectionMode, onRowSelectionModeChange } = useTableData();

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
