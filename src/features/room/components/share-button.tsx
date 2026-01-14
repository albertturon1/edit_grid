import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollaborationSession } from "@/features/room/components/collaborative-provider";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  className?: string;
}

export function ShareButton({ className }: ShareButtonProps) {
  const collaborative = useCollaborationSession();

  if (!collaborative || collaborative.connectionStatus !== "idle") {
    return null; // Don't show if not in local mode
  }

  const { onShare, isSharing } = collaborative;

  return (
    <Button onClick={onShare} disabled={isSharing} className={cn("gap-2", className)} size="sm">
      <Share2 className="h-[14px] w-[14px]" />
      Share
    </Button>
  );
}
