import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  onShare?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ShareButton({ onShare, disabled, className }: ShareButtonProps) {
  if (!onShare) {
    return null;
  }

  return (
    <Button onClick={onShare} disabled={disabled} className={className}>
      <Share2 className="h-3.5 w-3.5 mr-2" />
      Share
    </Button>
  );
}
