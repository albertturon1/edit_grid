import { useNavigate } from "@tanstack/react-router";
import { Loader2, WifiOff } from "lucide-react";
import { useWindowSize } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { VirtualizedTable } from "@/components/virtualized-table/virtualized-table";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { useRoomViewState } from "../hooks/useRoomViewState";
import { RoomImportForm } from "./import-form";

function LoadingState() {
	const { height } = useWindowSize();
	return (
		<div
			className="flex flex-col items-center justify-center gap-y-3"
			style={{ height: height - NAVBAR_HEIGHT }}
		>
			<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			<p className="text-muted-foreground">Loading...</p>
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
	const viewState = useRoomViewState(roomId);

	switch (viewState.status) {
		case "loading":
			return <LoadingState />;

		case "error": {
			const title =
				viewState.error.type === "invalid_room_id"
					? "Invalid Link"
					: "Document Not Found";

			return (
				<div
					className="flex flex-col items-center justify-center gap-y-4"
					style={{ height: height - NAVBAR_HEIGHT }}
				>
					<h1 className="text-xl font-semibold">{title}</h1>
					<p className="text-muted-foreground text-center max-w-md">
						{viewState.error.message}
					</p>
					<Button onClick={() => navigate({ to: "/room" })}>
						Start New Document
					</Button>
				</div>
			);
		}

		case "empty":
			return (
				<RoomImportForm
					onFileImport={viewState.onImport}
					height={height - NAVBAR_HEIGHT}
				/>
			);

		case "ready":
			return (
				<div
					className="overflow-hidden flex flex-col"
					style={{ height: height - NAVBAR_HEIGHT }}
				>
					{viewState.isReconnecting && <ReconnectingBanner />}
					<div className="w-full h-full px-2 sm:px-5">
						<VirtualizedTable
							table={viewState.table}
							metadata={viewState.metadata}
						/>
					</div>
				</div>
			);
	}
}
