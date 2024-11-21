import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
	return (
		<span className={cn("text-lg font-black", className)}>
			<span className="text-purple-400">Edit</span>Grid
		</span>
	);
}
