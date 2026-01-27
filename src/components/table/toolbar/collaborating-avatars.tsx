import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HiddenAvatars } from "@/components/user-avatar/hidden-avatars";
import { LiveIndicator } from "@/components/user-avatar/live-indicator";
import { UserAvatar } from "@/components/user-avatar/user-avatar";
import type { RemoteUser } from "@/lib/collaboration/types";

interface CollaborativeAvatarsProps {
  users: RemoteUser[] | undefined;
  maxAvatars: number;
}

export function CollaborativeAvatars({ users, maxAvatars }: CollaborativeAvatarsProps) {
  if (!users?.length) {
    return null;
  }

  const visibleUsers = users.slice(0, maxAvatars);
  const hiddenUsers = users.slice(maxAvatars);

  return (
    <div className="flex items-center gap-2">
      <LiveIndicator />
      <div className="flex -space-x-2">
        {visibleUsers.map((user) => (
          <Popover key={user.clientId}>
            <PopoverTrigger className="rounded-full">
              <div className="cursor-pointer">
                <UserAvatar user={user} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="center">
              <span className="text-sm font-medium">{user.name}</span>
            </PopoverContent>
          </Popover>
        ))}

        {hiddenUsers.length > 0 && (
          <Popover>
            <PopoverTrigger>
              <div className="cursor-pointer z-10">
                <HiddenAvatars count={hiddenUsers.length} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-3" align="end">
              <div className="text-sm font-medium">Also viewing</div>
              <div className="space-y-2">
                {hiddenUsers.map((user) => (
                  <div key={user.clientId} className="flex items-center gap-2">
                    <UserAvatar user={user} className="w-6 h-6 text-[10px]" />
                    <span className="text-sm">{user.name}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
