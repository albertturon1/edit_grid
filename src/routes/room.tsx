import { createFileRoute } from "@tanstack/react-router";
import { RoomPage } from "@/features/room/room";
import z from "zod";

export const Route = createFileRoute("/room")({
  component: RoomPage,
  validateSearch: z.object({
    id: z.string().optional(),
  }),
});
