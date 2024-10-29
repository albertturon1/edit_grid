import type { HeaderGroup } from "@tanstack/react-table";
import type { HandleOnContextMenuProps } from "@/components/virtualized-table/virtualized-table";
import { TableHeadRowCell } from "@/components/virtualized-table/table-head-row-cell";

export type TableHeadRowProps = {
	onContextMenu: (props: HandleOnContextMenuProps) => void;
	headerGroup: HeaderGroup<unknown>;
};
export function TableHeadRow({
	headerGroup,
	onContextMenu,
}: TableHeadRowProps) {
	return (
		<tr className="flex" key={headerGroup.id}>
			{headerGroup.headers.map((header, idx) => {
				return (
					<TableHeadRowCell
						key={header.id}
						header={header}
						idx={idx}
						onContextMenu={onContextMenu}
					/>
				);
			})}
		</tr>
	);
}
