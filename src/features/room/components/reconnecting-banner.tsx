import { WifiOff } from "lucide-react";

export function ReconnectingBanner() {
	return (
		<div className="fixed top-14 left-0 right-0 z-50 flex items-center justify-center gap-x-2 bg-yellow-500/90 text-yellow-950 py-1.5 px-4 text-sm">
			<WifiOff className="h-4 w-4" />
			<span>Reconnecting... Your changes are saved locally.</span>
		</div>
	);
}
