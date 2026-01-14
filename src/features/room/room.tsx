import { useSearch } from "@tanstack/react-router";
import { CollaborationSessionProvider } from "@/features/room/components/collaborative-provider";
import { RoomPageContent } from "./components/content";
import { TableWrapper } from "@/components/table-wrapper";

export function RoomPage() {
	const { id: roomId } = useSearch({ from: "/room" });

	return (
		<CollaborationSessionProvider roomId={roomId}>
			<TableWrapper>
				<RoomPageContent roomId={roomId} />
			</TableWrapper>
		</CollaborationSessionProvider>
	);
}
