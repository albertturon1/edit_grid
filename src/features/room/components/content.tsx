import { useRoomViewState } from "../hooks/useRoomViewState";
import { RoomEmpty } from "./room-empty";
import { RoomLoading } from "./room-loading";
import { RoomReady } from "./room-ready";
import { RoomError } from "./room-error";

interface RoomPageContentProps {
	roomId: string | undefined;
}

export function RoomPageContent({ roomId }: RoomPageContentProps) {
	const viewState = useRoomViewState(roomId);
	switch (viewState.status) {
		case "loading":
			return <RoomLoading />;
		case "error":
			return <RoomError error={viewState.error} />;
		case "empty":
			return <RoomEmpty onImport={viewState.onImport} />;

		case "ready":
			return (
				<RoomReady
					table={viewState.table}
					metadata={viewState.metadata}
					isReconnecting={viewState.isReconnecting}
				/>
			);
	}
}
