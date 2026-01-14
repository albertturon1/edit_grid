import { Loader2 } from "lucide-react";

export function RoomLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-3 flex-1">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
