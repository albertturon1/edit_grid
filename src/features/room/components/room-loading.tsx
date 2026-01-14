import { Loader2 } from "lucide-react";
import { useWindowSize } from "usehooks-ts";
import { NAVBAR_HEIGHT } from "@/routes/__root";

export function RoomLoading() {
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
