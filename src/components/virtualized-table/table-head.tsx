import type { HeaderGroup, RowData } from "@tanstack/react-table";
import type { HandleOnContextMenuProps } from "./virtualized-table";
import { TableHeadRow } from "./table-head-row";

type TableHeadProps = {
	headerGroups: HeaderGroup<RowData>[];
	onContextMenu: (props: HandleOnContextMenuProps) => void;
};
export function TableHead({ headerGroups, onContextMenu }: TableHeadProps) {
	return (
		<thead className="bg-background grid sticky top-0 z-10 border-b text-xs sm:text-sm">
			{headerGroups.map((headerGroup) => {
				return (
					<TableHeadRow
						key={headerGroup.id}
						headerGroup={headerGroup}
						onContextMenu={onContextMenu}
					/>
				);
			})}
		</thead>
	);
}
