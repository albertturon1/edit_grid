import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import type { RoomError as TRoomError } from "@/hooks/useCollaboration";

type RoomErrorProps = {
	error: TRoomError;
};

export function RoomError({ error }: RoomErrorProps) {
	const navigate = useNavigate();

	const title =
		error.type === "invalid_room_id" ? "Invalid Link" : "Document Not Found";

	return (
		<div className="flex flex-col items-center justify-center gap-y-4">
			<h1 className="text-xl font-semibold">{title}</h1>
			<p className="text-muted-foreground text-center max-w-md">
				{error.message}
			</p>
			<Button
				onClick={() => {
					navigate({ to: "/room" });
				}}
			>
				Start New Document
			</Button>
		</div>
	);
}
