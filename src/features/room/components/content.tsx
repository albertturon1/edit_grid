import { useRoomData } from "../hooks/useRoomData";
import { RoomEmpty } from "./room-empty";
import { RoomError } from "./room-error";
import { RoomLoading } from "./room-loading";
import { RoomTable } from "./room-table";

interface RoomPageContentProps {
  roomId: string | undefined;
}

export function RoomPageContent({ roomId }: RoomPageContentProps) {
  const roomData = useRoomData(roomId);

  switch (roomData.status) {
    case "loading":
      return <RoomLoading />;
    case "error":
      return <RoomError error={roomData.error} />;
    case "empty":
      return <RoomEmpty onImport={roomData.onImport} />;
    case "ready":
      return <RoomTable roomData={roomData} />;
  }
}
