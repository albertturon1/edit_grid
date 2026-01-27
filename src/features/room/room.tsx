import { useSearch } from "@tanstack/react-router";
import { RoomPageContent } from "./components/content";

export function RoomPage() {
  const { id: roomId } = useSearch({ from: "/room" });

  return <RoomPageContent roomId={roomId} />;
}
