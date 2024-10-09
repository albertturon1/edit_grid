import type { CellContext, Row } from "@tanstack/react-table";
import type { FilePickerRow } from "@/features/home/components/headline-file-picker";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnKeyboardButtonChange } from "@/lib/useOnKeyboardButtonChange";

type TableNumericalCellProps = CellContext<FilePickerRow, string> & {
	anchorRow: Row<FilePickerRow> | null;
	onAnchorRowChange: (row: Row<FilePickerRow> | null) => void;
	isModifierActive: boolean;
	onModifierStateChange: (state: boolean) => void;
	rowSelectionMode: boolean;
};

export function TableNumericalCell({
	row,
	table,
	anchorRow,
	onAnchorRowChange,
	isModifierActive,
	onModifierStateChange,
	rowSelectionMode,
}: TableNumericalCellProps) {
	const noSelectElements = document.querySelector("body");

	useOnKeyboardButtonChange({
		key: "Shift",
		os: ["mac", "linux", "windows"],
		onKeyDown: () => {
			onModifierStateChange(true);

			// disable text selection
			if (noSelectElements) {
				noSelectElements.style.userSelect = "none";
			}
		},
		onKeyUp: () => {
			onModifierStateChange(false);
			if (noSelectElements) {
				noSelectElements.style.userSelect = "";
			}
		},
	});

	function handleSelectionWithModifier() {
		if (!isModifierActive) {
			return;
		}

		const allRows = table.getRowModel().flatRows;

		if (!anchorRow) {
			onAnchorRowChange(row);
			return;
		}

		// same row selected - uncheck and reset state
		if (row.id === anchorRow.id) {
			onAnchorRowChange(null);
			return;
		}

		const selectedRowsFirstId = Number(anchorRow.id);
		const currentRowId = Number(row.id);

		const firstRowId =
			selectedRowsFirstId < currentRowId
				? selectedRowsFirstId + 1 // +1 because selectedRowsFirstId has already been toggled
				: currentRowId + 1; // +1 because next checkbox toggled this action

		const secondRowId =
			selectedRowsFirstId < currentRowId
				? currentRowId // without +1 because next checkbox toggled this action
				: selectedRowsFirstId;

		if (typeof firstRowId !== "number") {
			return;
		}

		for (let i = firstRowId; i < secondRowId; i++) {
			const loopedRow = allRows[i];

			// comparison if loopedRow is in opposite state that current row - it means this row should NOT be toggled as they will end up in the same state at the end
			const isLoopedRowInOpposition =
				loopedRow?.getIsSelected() !== row.getIsSelected();

			if (!loopedRow || isLoopedRowInOpposition) {
				continue;
			}

			loopedRow.toggleSelected();
		}

		onAnchorRowChange(null);
	}

	const isCurrentRowAnchor = anchorRow?.id === row.id;

	function onClick() {
		if (!rowSelectionMode) {
			return;
		}

		row.toggleSelected();
		handleSelectionWithModifier();
	}

	return (
		<div
			onClick={onClick}
			onKeyDown={onClick}
			className={cn(
				"w-full flex gap-x-2 px-[7px] pt-[9px] border border-white/0 group hover:cursor-pointer",
				isModifierActive
					? "hover:border hover:border-primary hover:rounded"
					: "",
				isCurrentRowAnchor ? "border border-primary rounded" : "",
				rowSelectionMode ? "" : "cursor-default",
				row.getIsSelected() ? "" : "text-slate-500",
			)}
		>
			{rowSelectionMode ? (
				<Checkbox
					checked={row.getIsSelected()}
					className={cn(
						"mt-[3px] opacity-50 group-hover:opacity-100",
						row.getIsSelected() || isCurrentRowAnchor ? "opacity-100" : "",
					)}
				/>
			) : null}

			<h1 className={"mt-[1px]"}>
				{(table
					.getSortedRowModel()
					?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1}
			</h1>
		</div>
	);
}
