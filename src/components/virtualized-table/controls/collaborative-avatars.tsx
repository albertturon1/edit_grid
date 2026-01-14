import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HiddenAvatars } from "@/components/user-avatar/hidden-avatars";
import { LiveIndicator } from "@/components/user-avatar/live-indicator";
import { UserAvatar } from "@/components/user-avatar/user-avatar";
import { useCollaborationSession } from "@/features/room/components/collaborative-provider";

interface CollaborativeAvatarsProps {
  maxAvatars: number;
}

export function CollaborativeAvatars({ maxAvatars }: CollaborativeAvatarsProps) {
  const collaborative = useCollaborationSession();

  if (!collaborative.users.remote.length) {
    return null;
  }

  const visibleUsers = collaborative.users.remote.slice(0, maxAvatars);
  const hiddenUsers = collaborative.users.remote.slice(maxAvatars);

  return (
    <div className="flex items-center gap-2">
      <LiveIndicator />

      <div className="flex -space-x-2">
        {visibleUsers.map((user) => (
          <Popover key={user.clientId}>
            <PopoverTrigger asChild>
              <button type="button" className="cursor-pointer">
                <UserAvatar user={user} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="center">
              <span className="text-sm font-medium">{user.name}</span>
            </PopoverContent>
          </Popover>
        ))}

        {!!hiddenUsers.length && (
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="cursor-pointer z-10">
                <HiddenAvatars count={hiddenUsers.length} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="end">
              <div className="text-sm font-medium mb-3">Also viewing</div>
              <div className="space-y-2">
                {hiddenUsers.map((remote) => (
                  <div key={remote.clientId} className="flex items-center gap-2">
                    <UserAvatar user={remote} className="w-6 h-6 text-[10px]" />
                    <span className="text-sm">{remote.name}</span>
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
