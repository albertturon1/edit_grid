import { useSearch } from "@tanstack/react-router";
import { CollaborationSessionProvider } from "@/features/room/components/collaborative-provider";
import { RoomPageContent } from "./components/content";

export function RoomPage() {
	const { id: roomId } = useSearch({ from: "/room" });

	return (
		<CollaborationSessionProvider roomId={roomId}>
			<div className="flex flex-1 justify-center">
				<RoomPageContent roomId={roomId} />
			</div>
		</CollaborationSessionProvider>
	);
}
