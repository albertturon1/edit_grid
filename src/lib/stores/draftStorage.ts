import { del, get, set } from "idb-keyval";
import type { Result } from "@/types/result";
import type { TableData } from "@/lib/imports/types/table";
import type { ImportedSourceMetadata } from "@/lib/imports/types/import";

const DRAFT_KEY = "pending-import-draft";
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface DraftData {
  table: TableData;
  metadata: ImportedSourceMetadata;
}

interface StoredDraft {
  data: DraftData;
  timestamp: number;
}

export type SaveDraftError =
  | { reason: "size_exceeded"; limit: number }
  | { reason: "storage_error" };

export async function saveDraft(data: DraftData): Promise<Result<void, SaveDraftError>> {
  try {
    const draft: StoredDraft = {
      data,
      timestamp: Date.now(),
    };

    await set(DRAFT_KEY, draft);

    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: { reason: "storage_error" },
    };
  }
}

export async function getDraft(): Promise<DraftData | null> {
  try {
    const stored = await get<StoredDraft>(DRAFT_KEY);

    if (!stored) {
      return null;
    }

    const age = Date.now() - stored.timestamp;
    if (age > DRAFT_TTL_MS) {
      await del(DRAFT_KEY);
      return null;
    }

    return stored.data;
  } catch {
    return null;
  }
}

export async function clearDraft(): Promise<void> {
  try {
    await del(DRAFT_KEY);
  } catch {
    // Ignore errors on cleanup
  }
}
