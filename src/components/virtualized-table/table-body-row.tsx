import type { Row } from "@tanstack/react-table";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import type { FilePickerRow } from "@/features/home/components/headline-file-picker";
import { cn } from "@/lib/utils";
import { useTheme, getValueFromSystemTheme } from "@/components/theme-provider";
import {
	TableBodyRowCell,
	type TableBodyRowCellProps,
} from "@/components/virtualized-table/table-body-row-cell";

export type TableBodyRowProps = Pick<TableBodyRowCellProps, "onContextMenu"> & {
	virtualRow: VirtualItem;
	rows: Row<FilePickerRow>[];
	rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
	rowIdx: number;
};

export function TableBodyRow({
	rows,
	rowVirtualizer,
	virtualRow,
	rowIdx,
	onContextMenu,
}: TableBodyRowProps) {
	virtualRow;
	const row = rows[virtualRow.index] as Row<FilePickerRow>;
	const { theme } = useTheme();
	const currentTheme = theme === "system" ? getValueFromSystemTheme() : theme;

	//TODO: fix color schema for dark mode
	const oddCellBgColor =
		currentTheme === "light" ? "bg-gray-50" : "bg-picker-primary";

	const background = rowIdx % 2 === 0 ? oddCellBgColor : "bg-background"; // from the first row, every second row has a backgroundColor to make the table easier to read

	return (
		<tr
			data-index={virtualRow.index} //needed for dynamic row height measurement
			ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
			key={row.id}
			className={cn(
				"flex absolute w-full border-b",
				background, // needed when no column is selected (none of the <td /> are rendered)
			)}
			style={{
				transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
			}}
		>
			{row.getVisibleCells().map((cell) => {
				return (
					<TableBodyRowCell
						key={cell.id}
						cell={cell}
						className={background}
						onContextMenu={onContextMenu}
					/>
				);
			})}
		</tr>
	);
}
