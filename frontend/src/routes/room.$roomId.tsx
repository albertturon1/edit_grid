import { createFileRoute } from "@tanstack/react-router";
import { RoomPage } from "@/features/room/room";
import { v4 as uuid } from "uuid";

function setUserId() {
  const newId = uuid(); // Generate a new ID
  localStorage.setItem("userId", newId); // Save it in localStorage

  return localStorage.getItem("userId");
}

export const Route = createFileRoute("/room/$roomId")({
  component: RoomPage,
  beforeLoad: () => {
    const userId = setUserId(); // Get or generate userId

    console.log("beforeLoad: ", userId);
  },
});
