import { cn } from "@/lib/utils";

export interface UserAvatarProps {
	count: number;
	size?: "sm" | "md";
	className?: string;
}

export function HiddenAvatars({
	count,
	size = "md",
	className,
}: UserAvatarProps) {
	const sizeClasses = {
		sm: "w-5 h-5 text-[9px] font-medium",
		md: "w-8 h-8 text-xs font-semibold",
	};

	return (
		<button
			type="button"
			className={cn(
				"flex items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold transition-colors cursor-pointer",
				sizeClasses[size],
				className,
			)}
			title={`+${count} more users`}
		>
			+{count}
		</button>
	);
}
