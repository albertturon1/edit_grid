import type { Row } from "@tanstack/react-table";
import { useEventListener } from "usehooks-ts";
import { Checkbox } from "@/components/ui/checkbox";
import type { TableRow } from "@/lib/imports/types/table";
import { cn } from "@/lib/utils";
import { useTableData } from "./virtualized-table-context";

type TableNumericalCellProps = {
	row: Row<TableRow>;
	anchorRow: Row<TableRow> | null;
	onAnchorRowChange: (row: Row<TableRow> | null) => void;
	isModifierActive: boolean;
	onModifierStateChange: (state: boolean) => void;
};

const KEY_SHIFT = "Shift";

export function TableNumericalCell({
	row,
	anchorRow,
	onAnchorRowChange,
	isModifierActive,
	onModifierStateChange,
}: TableNumericalCellProps) {
	const { table, rowSelectionMode } = useTableData();

	useAnchorMode(onModifierStateChange);

	function handleSelectionWithModifier() {
		if (!isModifierActive) {
			return;
		}

		const allRows = table.getRowModel().flatRows;

		if (!anchorRow) {
			onAnchorRowChange(row);
			return;
		}

		if (row.id === anchorRow.id) {
			onAnchorRowChange(null);
			return;
		}

		const { firstRowId, secondRowId } = calculateRowRange({ anchorRow, row });

		for (let i = firstRowId; i < secondRowId; i++) {
			const loopedRow = allRows[i];

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

	function handleOnClick() {
		if (!rowSelectionMode) {
			return;
		}

		row.toggleSelected();
		handleSelectionWithModifier();
	}

	return (
		<div
			onClick={handleOnClick}
			onKeyDown={handleOnClick}
			className={cn(
				"w-full h-full flex gap-x-2 px-[7px] pt-[9px] border border-white/0 group",
				isModifierActive && rowSelectionMode
					? "hover:border hover:border-primary hover:rounded"
					: "",
				isCurrentRowAnchor ? "border border-primary rounded" : "",
				rowSelectionMode ? "hover:cursor-pointer" : "cursor-default",
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

			<h1 className={"mt-[1px] text-xs sm:text-sm"}>
				{(table
					.getSortedRowModel()
					?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1}
			</h1>
		</div>
	);
}

function useAnchorMode(onModifierStateChange: (state: boolean) => void) {
	const noSelectElements = document.querySelector("body");

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== KEY_SHIFT) {
			return;
		}

		onModifierStateChange(true);

		if (noSelectElements) {
			noSelectElements.style.userSelect = "none";
		}
	};

	const handleKeyUp = (event: KeyboardEvent) => {
		if (event.key !== KEY_SHIFT) {
			return;
		}

		onModifierStateChange(false);
		if (noSelectElements) {
			noSelectElements.style.userSelect = "";
		}
	};

	useEventListener("keydown", handleKeyDown);
	useEventListener("keyup", handleKeyUp);
}

function calculateRowRange({
	anchorRow,
	row,
}: {
	anchorRow: Row<TableRow>;
	row: Row<TableRow>;
}) {
	const selectedRowsFirstId = Number(anchorRow.id);
	const currentRowId = Number(row.id);

	const firstRowId =
		selectedRowsFirstId < currentRowId
			? selectedRowsFirstId + 1
			: currentRowId + 1;

	const secondRowId =
		selectedRowsFirstId < currentRowId ? currentRowId : selectedRowsFirstId;

	return { firstRowId, secondRowId };
}
