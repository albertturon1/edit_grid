import type { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
	VIRTUALIZED_TABLE_CELL_CLASSES,
	VIRTUALIZED_TABLE_STICKY_CLASSES,
} from "@/components/virtualized-table/virtualized-table";
import cx from "clsx";

// biome-ignore lint/suspicious/noExplicitAny: generic
type TableHeadProps<T extends Table<any>> = {
	table: T;
};

// biome-ignore lint/suspicious/noExplicitAny: generic
export function TableHead<T extends Table<any>>({ table }: TableHeadProps<T>) {
	return (
		<thead className="bg-background grid sticky top-0 z-10">
			{table.getHeaderGroups().map((headerGroup) => (
				<tr className="flex" key={headerGroup.id}>
					{headerGroup.headers.map((header, idx) => {
						return (
							<th
								className={cx(
									"relative bg-background py-2 border-b border-r overflow-hidden",
									VIRTUALIZED_TABLE_CELL_CLASSES,
									idx === 0 ? VIRTUALIZED_TABLE_STICKY_CLASSES : "", //?width: cell.column.getSize()
								)}
								style={{ width: header.getSize() }}
								key={header.id}
								colSpan={header.colSpan}
							>
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
								<div
									onMouseDown={header.getResizeHandler()}
									onTouchStart={header.getResizeHandler()}
									className={cx(
										"absolute right-0 top-0 h-full w-[5px] cursor-col-resize select-none touch-none",
										header.column.getIsResizing()
											? "bg-blue-300 opacity-100"
											: "",
									)}
								/>
							</th>
						);
					})}
				</tr>
			))}
		</thead>
	);
}
