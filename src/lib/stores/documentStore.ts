import * as Y from "yjs";

/**
 * Global document store for managing Y.Doc instances across the application.
 * Ensures document persistence between local and collaborative modes.
 */
class DocumentStore {
	private localDoc: Y.Doc;
	private collaborativeDocs: Map<string, Y.Doc>;

	constructor() {
		this.localDoc = new Y.Doc();
		this.collaborativeDocs = new Map();
	}

	/**
	 * Get the local document instance (used in local mode)
	 */
	getLocalDoc(): Y.Doc {
		return this.localDoc;
	}

	/**
	 * Get or create a collaborative document for a specific room
	 * @param roomId - Unique room identifier
	 */
	getOrCreateCollaborativeDoc(roomId: string): Y.Doc {
		const existingDoc = this.collaborativeDocs.get(roomId);
		if (existingDoc) {
			return existingDoc;
		}

		const doc = new Y.Doc();
		this.collaborativeDocs.set(roomId, doc);
		return doc;
	}

	/**
	 * Migrate data from local document to collaborative document.
	 * Uses Y.js transact() to ensure all operations complete atomically
	 * before the function returns - no setTimeout needed.
	 * @param roomId - Target room ID
	 */
	migrateLocalToCollaborative(roomId: string): Y.Doc {
		const collaborativeDoc = this.getOrCreateCollaborativeDoc(roomId);

		// Copy data from local to collaborative document
		const localRows = this.localDoc.getArray("rows").toArray();
		const localMetadata = this.localDoc.getMap("metadata").toJSON();

		// Use transact to ensure atomic operation - data is guaranteed
		// to be present when transact() returns
		collaborativeDoc.transact(() => {
			const collaborativeRows = collaborativeDoc.getArray("rows");
			const collaborativeMetadata = collaborativeDoc.getMap("metadata");

			// Clear existing data in collaborative doc
			collaborativeRows.delete(0, collaborativeRows.length);

			// Insert local data
			collaborativeRows.insert(0, localRows);
			Object.entries(localMetadata).forEach(([key, value]) => {
				collaborativeMetadata.set(key, value);
			});
		}, "migration");

		return collaborativeDoc;
	}

	/**
	 * Get current active document based on room ID
	 * @param roomId - Room ID (undefined for local mode)
	 */
	getActiveDoc(roomId?: string): Y.Doc {
		if (roomId) {
			return this.getOrCreateCollaborativeDoc(roomId);
		}
		return this.getLocalDoc();
	}

	/**
	 * Clear collaborative documents (useful for cleanup)
	 * @param roomId - Specific room ID to clear, or undefined to clear all
	 */
	clearCollaborativeDocs(roomId?: string): void {
		if (roomId) {
			this.collaborativeDocs.delete(roomId);
		} else {
			this.collaborativeDocs.clear();
		}
	}
}

// Export singleton instance
export const documentStore = new DocumentStore();
