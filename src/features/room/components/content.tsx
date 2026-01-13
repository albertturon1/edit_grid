import { useNavigate } from "@tanstack/react-router";
import { Loader2, WifiOff } from "lucide-react";
import { useWindowSize } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { useTableDocument } from "@/components/virtualized-table/hooks/useTableDocument";
import { useVirtualizedTable } from "@/components/virtualized-table/hooks/useVirtualizedTable";
import { VirtualizedTable } from "@/components/virtualized-table/virtualized-table";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { useCollaborationSession } from "./collaborative-provider";
import { RoomImportForm } from "./import-form";

function LoadingState({ message }: { message: string }) {
	const { height } = useWindowSize();
	return (
		<div
			className="flex flex-col items-center justify-center gap-y-3"
			style={{ height: height - NAVBAR_HEIGHT }}
		>
			<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			<p className="text-muted-foreground">{message}</p>
		</div>
	);
}

function ReconnectingBanner() {
	return (
		<div className="fixed top-14 left-0 right-0 z-50 flex items-center justify-center gap-x-2 bg-yellow-500/90 text-yellow-950 py-1.5 px-4 text-sm">
			<WifiOff className="h-4 w-4" />
			<span>Reconnecting... Your changes are saved locally.</span>
		</div>
	);
}

interface RoomPageContentProps {
	roomId: string | undefined;
}
export function RoomPageContent({ roomId }: RoomPageContentProps) {
	const { height } = useWindowSize();
	const navigate = useNavigate();

	const { roomError, connectionStatus } = useCollaborationSession();
	const { tabledata, metadata, populateData, meta } = useTableDocument(roomId);

	const table = useVirtualizedTable({ tabledata, meta });
	const hasData = table.getRowModel().rows.length > 0;

	if (roomError) {
		const title =
			roomError.type === "invalid_room_id"
				? "Invalid Link"
				: "Document Not Found";

		return (
			<div
				className="flex flex-col items-center justify-center gap-y-4"
				style={{ height: height - NAVBAR_HEIGHT }}
			>
				<h1 className="text-xl font-semibold">{title}</h1>
				<p className="text-muted-foreground text-center max-w-md">
					{roomError.message}
				</p>
				<Button onClick={() => navigate({ to: "/room" })}>
					Start New Document
				</Button>
			</div>
		);
	}

	if (roomId && connectionStatus === "loading") {
		return <LoadingState message="Loading..." />;
	}

	if (!hasData && !roomId) {
		return (
			<RoomImportForm
				onFileImport={populateData}
				height={height - NAVBAR_HEIGHT}
			/>
		);
	}

	return (
		<div
			className="overflow-hidden flex flex-col"
			style={{ height: height - NAVBAR_HEIGHT }}
		>
			{connectionStatus === "reconnecting" && <ReconnectingBanner />}
			<div className="w-full h-full px-2 sm:px-5">
				<VirtualizedTable table={table} metadata={metadata} />
			</div>
		</div>
	);
}
