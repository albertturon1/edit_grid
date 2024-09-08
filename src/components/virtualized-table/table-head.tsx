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
		<thead className="bg-background grid sticky top-0 z-10 py-2 ">
			{table.getHeaderGroups().map((headerGroup) => (
				<tr className="flex w-full" key={headerGroup.id}>
					{headerGroup.headers.map((header, idx) => {
						return (
							<th
								className={cx(
									"",
									VIRTUALIZED_TABLE_CELL_CLASSES,
									idx === 0 ? VIRTUALIZED_TABLE_STICKY_CLASSES : "",
								)}
								key={header.id}
								style={{
									display: "flex",
									width: header.getSize(),
								}}
							>
								<div
									onMouseDown={header.getResizeHandler()}
									onTouchStart={header.getResizeHandler()}
									className="absolute top-0 right-0 h-full w-[5px] hover:bg-gray-300 cursor-col-resize"
								/>
								<div
									className={
										header.column.getCanSort()
											? ""
											: // ? "cursor-pointer select-none"
												""
									}
									// onClick={header.column.getToggleSortingHandler()}
									// onKeyUp={header.column.getToggleSortingHandler()}
								>
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
									{/*  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                  */}
								</div>
							</th>
						);
					})}
				</tr>
			))}
		</thead>
	);
}
