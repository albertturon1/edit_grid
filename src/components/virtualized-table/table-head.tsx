import type { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

const NUMERICAL_COLUMN_ID =
	"text-white/0 cursor-default selection:cursor-default"; // properties to hide the “0” from the first cell - it is rendered to keep the layout stable when no column is visible except the numeric one.

// biome-ignore lint/suspicious/noExplicitAny: generic
type TableHeadProps<T extends Table<any>> = {
	table: T;
};

// biome-ignore lint/suspicious/noExplicitAny: generic
export function TableHead<T extends Table<any>>({ table }: TableHeadProps<T>) {
	return (
		<thead className="bg-background grid sticky top-0 z-10 border-b">
			{table.getHeaderGroups().map((headerGroup) => (
				<tr className="flex" key={headerGroup.id}>
					{headerGroup.headers.map((header, idx) => {
						return (
							<th
								key={header.id}
								colSpan={header.colSpan}
								style={{ width: header.getSize() }}
								className={cn(
									"relative bg-background overflow-hidden font-semibold border-r py-2 flex pl-2",
									idx === 0
										? cn("sticky left-0 z-10", NUMERICAL_COLUMN_ID)
										: "", // sticky first cell
								)}
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
									className={cn(
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
