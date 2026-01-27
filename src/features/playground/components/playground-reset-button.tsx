import { useCallback, useState } from "react";
import type * as Y from "yjs";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseFile } from "@/lib/imports";
import { normalizeRawTableData } from "@/lib/imports/transformers/normalizeRawTableData";
import type { TableRow } from "@/lib/imports/types/table";

const PLAYGROUND_CSV_PATH = "/customers-1000.csv";

interface PlaygroundResetButtonProps {
  yjsDoc: Y.Doc;
}

/**
 * Button that resets the playground to default CSV data.
 * Overwrites all current data with fresh CSV content.
 */
export function PlaygroundResetButton({ yjsDoc }: PlaygroundResetButtonProps) {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = useCallback(async () => {
    setIsResetting(true);

    try {
      const response = await fetch(PLAYGROUND_CSV_PATH);
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status}`);
      }

      const blob = await response.blob();
      const file = new File([blob], "customers-1000.csv", { type: "text/csv" });

      const parsed = await parseFile(file);
      if (!parsed.success) {
        throw new Error("Failed to parse CSV");
      }

      const normalized = normalizeRawTableData(parsed.data, {
        firstRowAsHeaders: true,
      });

      if (!normalized) {
        throw new Error("Failed to normalize CSV data");
      }

      const yArray = yjsDoc.getArray<TableRow>("rows");
      const yMetadataMap = yjsDoc.getMap("metadata");

      yjsDoc.transact(() => {
        yArray.delete(0, yArray.length);
        yArray.push(normalized.table.rows);
        yMetadataMap.set("headers", normalized.table.headers);
        yMetadataMap.set("filename", "customers-1000.csv");
        yMetadataMap.set("firstRowValues", normalized.firstRowValues);
      });
    } finally {
      setIsResetting(false);
    }
  }, [yjsDoc]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReset}
      disabled={isResetting}
      className="gap-1.5"
    >
      <RotateCcw className={`h-4 w-4 ${isResetting ? "animate-spin" : ""}`} />
      Reset
    </Button>
  );
}
