import type { UserState } from "@/lib/collaboration/types";
import { getInitials } from "@/lib/collaboration/utils";
import { cn } from "@/lib/utils";

export interface UserAvatarProps {
  user: UserState;
  isLocal?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function UserAvatar({ user, isLocal = false, size = "md", className }: UserAvatarProps) {
  const initials = getInitials(user.name);

  const sizeClasses = {
    sm: "w-5 h-5 text-[7px]",
    md: "w-7 h-7 text-[10px]",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full text-white ring-1 ring-background shadow-sm font-medium",
        sizeClasses[size],
        isLocal && "ring-2 ring-white ring-offset-1 ring-offset-background",
        className,
      )}
      style={{ backgroundColor: user.color }}
      title={isLocal ? `${user.name} (You)` : user.name}
    >
      {initials}
    </div>
  );
}
