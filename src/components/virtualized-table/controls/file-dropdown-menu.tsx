import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ExportDialog } from "@/components/virtualized-table/export-dialog";
import { useExport } from "@/components/virtualized-table/hooks/useExport";
import { useTableData } from "@/components/virtualized-table/virtualized-table-context";
import { TableDropdownButton } from "./table-dropdown-button";

export function FileDropdownMenu() {
	const { rowSelectionMode } = useTableData();
	const [active, setActive] = useState(false);
	const [exportOpen, setExportOpen] = useState(false);
	const { exportAll, exportSelected } = useExport();

	return (
		<DropdownMenu open={active} onOpenChange={setActive}>
			<DropdownMenuTrigger asChild>
				<TableDropdownButton active={active}>
					{"File"}
					<ChevronDown className="h-4 w-4" />
				</TableDropdownButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="flex flex-col" align="start">
				<DropdownMenuItem className="gap-x-2 py-2" onClick={exportAll}>
					{rowSelectionMode ? "Export all" : "Export"}
				</DropdownMenuItem>
				{rowSelectionMode ? (
					<>
						<Separator />
						<DropdownMenuItem className="gap-x-2 py-2" onClick={exportSelected}>
							{"Export selected"}
						</DropdownMenuItem>
					</>
				) : null}
				<Separator />
				<DropdownMenuItem
					className="gap-x-2 py-2"
					onClick={() => {
						setExportOpen(true);
					}}
				>
					{"Export as"}
				</DropdownMenuItem>
			</DropdownMenuContent>
			<ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
		</DropdownMenu>
	);
}
