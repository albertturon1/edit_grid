import { useNavigate } from "@tanstack/react-router";
import {
	createContext,
	type ReactElement,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { toast } from "@/components/hooks/use-toast";
import {
	type ConnectionStatus,
	type RoomError,
	useCollaboration,
} from "@/hooks/useCollaboration";
import type {
	RemoteUser,
	SelectedCell,
	UserState,
} from "@/lib/collaboration/types";
import { documentStore } from "@/lib/stores/documentStore";

interface CollaborativeContextValue {
	setSelectedCell?: (cell: SelectedCell | null) => void;
	onShare: () => void;
	connectionStatus: ConnectionStatus;
	isSharing: boolean;
	roomId: string | undefined;
	roomError: RoomError | null;
	users: {
		local?: UserState;
		remote: RemoteUser[];
	};
}

const CollaborativeSessionContext =
	createContext<CollaborativeContextValue | null>(null);

interface CollaborativeSessionContextProps {
	roomId: string | undefined;
	children: ReactElement;
}

/**
 * Provider that orchestrates both data management and collaborative features
 * Handles migration between local and collaborative modes
 */
export const CollaborationSessionProvider = ({
	roomId,
	children,
}: CollaborativeSessionContextProps) => {
	const [isSharing, setIsSharing] = useState(false);

	const navigate = useNavigate();

	// Get active document from global store
	const activeDoc = documentStore.getActiveDoc(roomId);

	// const data = useTableData(activeDoc);
	const collaboration = useCollaboration(roomId, activeDoc);

	// Migration function from local to collaborative
	const onShare = useCallback(() => {
		if (isSharing || roomId) {
			return;
		}
		setIsSharing(true);

		try {
			// Generate new room ID
			const newRoomId = crypto.randomUUID();

			// Migrate local data to collaborative document using document store
			// transact() is synchronous - data is guaranteed to be present after this call
			documentStore.migrateLocalToCollaborative(newRoomId);

			navigate({
				to: "/room",
				search: { id: newRoomId },
			});
		} catch (_error) {
			toast({
				title: "Something went wrong",
				description: "Please try again",
				variant: "destructive",
			});
		} finally {
			setIsSharing(false);
		}
	}, [isSharing, navigate, roomId]);

	const contextValue = useMemo<CollaborativeContextValue>(
		() => ({
			// ...data,
			users: {
				local: collaboration?.local,
				remote: collaboration?.remote || [],
			},
			onShare,
			isSharing,
			roomId,
			// tabledata: data.table,
			connectionStatus: collaboration?.connectionStatus || "idle",
			setSelectedCell: collaboration?.setSelectedCell,
			roomError: collaboration?.roomError ?? null,
		}),
		[collaboration, onShare, isSharing, roomId],
	);

	return (
		<CollaborativeSessionContext.Provider value={contextValue}>
			{children}
		</CollaborativeSessionContext.Provider>
	);
};

export const useCollaborationSession = () => {
	const context = useContext(CollaborativeSessionContext);
	if (!context) {
		throw new Error(
			"useCollaborationSession must be used inside CollaborationSessionProvider",
		);
	}
	return context;
};
