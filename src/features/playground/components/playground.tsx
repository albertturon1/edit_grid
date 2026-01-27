import { Loader2 } from "lucide-react";
import { usePlaygroundData } from "@/features/playground/hooks/usePlaygroundData";
import { PLAYGROUND_ROOM_ID } from "../constants";
import { lazy, Suspense } from "react";
const PlaygroundTable = lazy(() => import("./playground-table"));

export function Playground() {
  const playgroundData = usePlaygroundData(PLAYGROUND_ROOM_ID);

  if (playgroundData.status !== "ready") {
    return <PlaygroundLoading />;
  }

  return (
    <Suspense fallback={<PlaygroundLoading />}>
      <PlaygroundTable playgroundData={playgroundData} />;
    </Suspense>
  );
}

function PlaygroundLoading() {
  return (
    <div className="flex flex-1 items-center justify-center w-full h-full">
      <div className="flex flex-1 flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading playground...</p>
      </div>
    </div>
  );
}
