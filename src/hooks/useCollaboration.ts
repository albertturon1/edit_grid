import { useCallback, useEffect, useRef, useState } from "react";
import YPartyKitProvider from "y-partykit/provider";
import type * as Y from "yjs";
import { z } from "zod";
import type { RemoteUser, SelectedCell, UserState } from "@/lib/collaboration/types";
import { userStateSchema } from "@/lib/collaboration/types";
import { generateUserColor, generateUserName } from "@/lib/collaboration/utils";
import { env } from "@/lib/env";

export type ConnectionStatus = "idle" | "loading" | "connected" | "reconnecting";

export interface RoomError {
  type: "room_not_found" | "invalid_room_id";
  message: string;
}

interface StatusEvent {
  status: "connected" | "disconnected" | "connecting";
}

const uuidSchema = z.string().uuid();

/**
 * Special room IDs that bypass UUID validation.
 * Used for shared spaces like playground that have fixed IDs.
 */
const SPECIAL_ROOM_IDS = ["PLAYGROUND"] as const;
type SpecialRoomId = (typeof SPECIAL_ROOM_IDS)[number];

function isValidRoomId(id: string): boolean {
  return uuidSchema.safeParse(id).success || SPECIAL_ROOM_IDS.includes(id as SpecialRoomId);
}

/**
 * Collaborative features hook that works only when roomId exists.
 * Handles PartyKit connection, awareness, and remote users.
 *
 * Connection flow:
 * 1. idle → loading (WebSocket connecting + Y.js syncing)
 * 2. loading → connected (Y.js synced, document ready)
 *
 * On temporary disconnect:
 * - connected → reconnecting (auto-reconnect in progress)
 * - User can continue editing locally (Y.js handles offline)
 * - reconnecting → connected (when reconnected and synced)
 *
 */
export function useCollaboration(roomId?: string, yjsDoc?: Y.Doc) {
  const [provider, setProvider] = useState<YPartyKitProvider | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [remote, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [roomError, setRoomError] = useState<RoomError | null>(null);

  const localUserRef = useRef<UserState | null>(null);
  const hasCompletedInitialSync = useRef(false);
  const wasEverSynced = useRef(false);

  if (!localUserRef.current) {
    localUserRef.current = {
      name: generateUserName(),
      color: generateUserColor(),
      selectedCell: null,
    };
  }

  const local = localUserRef.current;

  const setSelectedCell = useCallback(
    (cell: SelectedCell | null) => {
      if (provider?.awareness) {
        provider.awareness.setLocalStateField("user", {
          ...local,
          selectedCell: cell,
        });
      }
    },
    [provider, local],
  );

  useEffect(() => {
    if (!roomId || !yjsDoc) {
      setConnectionStatus("idle");
      setRemoteUsers([]);
      setProvider(null);
      setRoomError(null);
      hasCompletedInitialSync.current = false;
      wasEverSynced.current = false;
      return;
    }

    // Validate roomId is a valid UUID or special room ID before connecting
    if (!isValidRoomId(roomId)) {
      setRoomError({
        type: "invalid_room_id",
        message: "Invalid room link.",
      });
      setConnectionStatus("idle");
      return;
    }

    const partykitHost = env.VITE_PARTYKIT_HOST;
    const yProvider = new YPartyKitProvider(partykitHost, roomId, yjsDoc);

    setProvider(yProvider);
    setRoomError(null);
    setConnectionStatus("loading");

    yProvider.awareness.setLocalStateField("user", local);

    const updateRemoteUsers = () => {
      const awareness = yProvider.awareness;
      const states = awareness.getStates();
      const users: RemoteUser[] = [];

      states.forEach((state, clientId) => {
        if (clientId !== awareness.clientID && state.user) {
          const userData = userStateSchema.safeParse(state.user);
          if (userData.success) {
            users.push({
              ...userData.data,
              clientId,
            });
          }
        }
      });

      setRemoteUsers(users);
    };

    const handleStatus = (event: StatusEvent) => {
      switch (event.status) {
        case "connected": {
          if (yProvider.synced) {
            setConnectionStatus("connected");
            setRoomError(null);
          } else {
            setConnectionStatus("loading");
          }
          break;
        }
        case "disconnected": {
          if (wasEverSynced.current) {
            setConnectionStatus("reconnecting");
          }
          break;
        }
        case "connecting": {
          if (wasEverSynced.current) {
            setConnectionStatus("reconnecting");
          } else {
            setConnectionStatus("loading");
          }
          break;
        }
      }
    };

    const handleSync = (isSynced: boolean) => {
      if (isSynced) {
        wasEverSynced.current = true;
        setConnectionStatus("connected");
        setRoomError(null);

        if (!hasCompletedInitialSync.current) {
          hasCompletedInitialSync.current = true;

          // Skip room_not_found check for special room IDs (e.g., playground)
          // These rooms are initialized dynamically and may be empty initially
          const isSpecialRoom = SPECIAL_ROOM_IDS.includes(roomId as SpecialRoomId);
          if (!isSpecialRoom) {
            const rowsCount = yjsDoc.getArray("rows").length;
            const hasHeaders = !!yjsDoc.getMap("metadata").get("headers");

            if (!rowsCount && !hasHeaders) {
              setRoomError({
                type: "room_not_found",
                message: "This shared document doesn't exist or has expired.",
              });
            }
          }
        }
      }
    };

    yProvider.awareness.on("change", updateRemoteUsers);
    yProvider.on("status", handleStatus);
    yProvider.on("sync", handleSync);

    if (yProvider.synced) {
      handleSync(true);
    }

    return () => {
      yProvider.awareness.off("change", updateRemoteUsers);
      yProvider.off("status", handleStatus);
      yProvider.off("sync", handleSync);
      yProvider.destroy();
    };
  }, [roomId, yjsDoc, local]);

  if (!roomId || !yjsDoc) {
    return null;
  }

  return {
    connectionStatus,
    local,
    remote,
    setSelectedCell,
    roomError,
  };
}
