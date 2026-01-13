import type { RemoteUser, UserState } from "@/lib/collaboration/types";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";

export type UserListProps = {
	local: UserState;
	remote: RemoteUser[];
	className?: string;
};

const VISIBLE_AVATAR_COUNT = 5;

export function UserList({ local, remote, className }: UserListProps) {
	const remoteUsersCount = remote.length;
	const totalUsers = remoteUsersCount + 1; // +1 for local user

	const hasMoreRemoteUsers = remoteUsersCount > VISIBLE_AVATAR_COUNT;
	const hiddenRemoteUsersCount = remoteUsersCount - VISIBLE_AVATAR_COUNT;
	const userLabel = totalUsers === 1 ? "user" : "users";

	return (
		<div className={cn("flex items-center gap-1", className)}>
			<span className="text-xs text-muted-foreground mr-1">
				{totalUsers} {userLabel}
			</span>

			<div className="flex -space-x-2">
				<UserAvatar user={local} isLocal />

				{remote.slice(0, VISIBLE_AVATAR_COUNT).map((remote) => (
					<UserAvatar key={remote.clientId} user={remote} />
				))}

				{hasMoreRemoteUsers && (
					<div
						className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-xs font-semibold"
						title={`+${hiddenRemoteUsersCount} more users`}
					>
						+{hiddenRemoteUsersCount}
					</div>
				)}
			</div>
		</div>
	);
}
