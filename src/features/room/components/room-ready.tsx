import type { Table } from "@tanstack/react-table";
import type { TableRow } from "@/lib/imports/types/table";
import type { TableMetadata } from "../hooks/useRoomViewState";
import { VirtualizedTable } from "@/components/virtualized-table/virtualized-table";
import { ReconnectingBanner } from "./reconnecting-banner";

interface RoomReadyProps {
	table: Table<TableRow>;
	metadata: TableMetadata;
	isReconnecting: boolean;
}

export function RoomReady({ table, metadata, isReconnecting }: RoomReadyProps) {
	return (
		<div className="overflow-hidden flex flex-col">
			{isReconnecting && <ReconnectingBanner />}
			<div className="w-full h-full px-2 sm:px-5">
				<VirtualizedTable table={table} metadata={metadata} />
			</div>
		</div>
	);
}
