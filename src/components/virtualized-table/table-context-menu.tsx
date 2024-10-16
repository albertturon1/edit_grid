import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
} from "@/components/context-menu/context-menu";
import { ArrowBigDown, ArrowBigRight, ChevronsDown, Trash } from "lucide-react";
import type { ExtendedContextMenuPosition } from "./virtualized-table";
import { ___INTERNAL_ID_COLUMN_ID } from "./hooks/useVirtualizedTable";

export function TableContextMenu({
	addRow,
	addColumn,
	removeColumn,
	removeRow,
	duplicateRow,
	...props
}: {
	addRow: () => void;
	addColumn: () => void;
	removeColumn: () => void;
	duplicateRow: () => void;
	removeRow: () => void;
	onClose: (() => void) | undefined;
	position: ExtendedContextMenuPosition | null;
}) {
	const showColumnOnly =
		props.position?.activeCell.column.id !== ___INTERNAL_ID_COLUMN_ID;

	const showRowOnly = props.position?.activeCell.type !== "header";

	return (
		<ContextMenu {...props}>
			<ContextMenuContent className="[&>*]:gap-x-8 z-50">
				<ContextMenuItem onClick={addRow} className="justify-between">
					{"Add Row"}
					<ArrowBigDown className="w-5 h-5" strokeWidth={1.5} />
				</ContextMenuItem>
				{showRowOnly ? (
					<>
						<ContextMenuItem onClick={duplicateRow} className="justify-between">
							{"Duplicate Row"}
							<ChevronsDown className="w-5 h-5" strokeWidth={1.5} />
						</ContextMenuItem>
						<ContextMenuItem
							onClick={removeRow}
							className="justify-between text-red-600"
						>
							{"Delete Row"}
							<Trash className="w-5 h-[17px]" strokeWidth={1.5} />
						</ContextMenuItem>
					</>
				) : null}
				<ContextMenuSeparator />
				<ContextMenuItem onClick={addColumn} className="justify-between">
					{"Add Column"}
					<ArrowBigRight className="w-5 h-5" strokeWidth={1.5} />
				</ContextMenuItem>
				{showColumnOnly ? (
					<ContextMenuItem
						onClick={removeColumn}
						className="justify-between text-red-600"
					>
						{"Delete Column"}
						<Trash className="w-5 h-[17px]" strokeWidth={1.5} />
					</ContextMenuItem>
				) : null}
			</ContextMenuContent>
		</ContextMenu>
	);
}
