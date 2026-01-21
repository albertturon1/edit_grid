import * as Y from "yjs";
import { useEffect, useRef, useState } from "react";
import { documentStore } from "@/lib/stores/documentStore";
import { useCollaboration } from "@/hooks/useCollaboration";
import { useYjsTableDocument } from "@/components/virtualized-table/hooks/useYjsTableDocument";
import { useYjsMutations } from "@/components/virtualized-table/hooks/useYjsMutations";
import { parseFile } from "@/lib/imports";
import { normalizeRawTableData } from "@/lib/imports/transformers/normalizeRawTableData";
import type { TableSourceMetadata, TableMutations, CollaborationInfo } from "@/lib/table/types";
import type { TableData, TableRow } from "@/lib/imports/types/table";
import type { RoomError } from "@/hooks/useCollaboration";

const PLAYGROUND_ROOM_ID = "playground";
const DEMO_DATA_URL = "/customers-1000.csv";

interface PlaygroundProviderResult {
  status: "loading" | "error" | "empty" | "ready";
  data: TableData;
  metadata: TableSourceMetadata;
  mutations: TableMutations;
  onImport?: (data: TableData, metadata: TableSourceMetadata) => void;
  error?: RoomError;
  collaboration?: CollaborationInfo;
}

async function fetchAndParseDemoData(
  yjsDoc: Y.Doc,
): Promise<{ table: TableData; metadata: TableSourceMetadata } | null> {
  const response = await fetch(DEMO_DATA_URL);
  if (!response.ok) return null;

  const blob = await response.blob();
  const file = new File([blob], "customers-1000.csv", { type: "text/csv" });

  const parsed = await parseFile(file);
  if (!parsed.success) return null;

  const normalized = normalizeRawTableData(parsed.data, { firstRowAsHeaders: true });
  if (!normalized) return null;

  const yArray = yjsDoc.getArray<TableRow>("rows");
  const yMetadataMap = yjsDoc.getMap("metadata");

  yArray.delete(0, yArray.length);
  yArray.push(normalized.table.rows);

  yMetadataMap.set("headers", normalized.table.headers);
  yMetadataMap.set("filename", "customers-1000.csv");
  yMetadataMap.set("firstRowValues", normalized.firstRowValues);

  return {
    table: normalized.table,
    metadata: {
      filename: "customers-1000.csv",
      firstRowValues: normalized.firstRowValues,
    },
  };
}

export function usePlaygroundDataProvider(): PlaygroundProviderResult {
  const yjsDoc = documentStore.getActiveDoc(PLAYGROUND_ROOM_ID);

  const collaboration = useCollaboration(PLAYGROUND_ROOM_ID, yjsDoc);
  const { data, metadata, isLoading: isDocLoading } = useYjsTableDocument(yjsDoc);
  const mutations = useYjsMutations(yjsDoc);

  const [isAutoSeeding, setIsAutoSeeding] = useState(false);
  const hasAutoSeeded = useRef(false);

  useEffect(() => {
    if (hasAutoSeeded.current) return;

    if (data.rows.length === 0 && !isDocLoading) {
      setIsAutoSeeding(true);
      fetchAndParseDemoData(yjsDoc)
        .then(() => {
          hasAutoSeeded.current = true;
        })
        .catch(() => {
          hasAutoSeeded.current = true;
        })
        .finally(() => {
          setIsAutoSeeding(false);
        });
    } else if (data.rows.length > 0) {
      hasAutoSeeded.current = true;
    }
  }, [data.rows.length, isDocLoading, yjsDoc]);

  const hasData = data.rows.length > 0;
  const isLoading = isDocLoading || isAutoSeeding;

  if (collaboration?.roomError) {
    return {
      status: "error",
      error: collaboration.roomError,
      data,
      metadata,
      mutations,
    };
  }

  if (collaboration?.connectionStatus === "loading") {
    return {
      status: "loading",
      data,
      metadata,
      mutations,
    };
  }

  if (isLoading) {
    return {
      status: "loading",
      data,
      metadata,
      mutations,
    };
  }

  if (!hasData) {
    return {
      status: "empty",
      data,
      metadata,
      mutations,
    };
  }

  return {
    status: "ready",
    data,
    metadata,
    mutations,
    collaboration: {
      isReconnecting: collaboration?.connectionStatus === "reconnecting",
      users: collaboration?.remote ?? [],
    },
  };
}
