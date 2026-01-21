import type { Table } from "@tanstack/react-table";
import type { TableRow } from "@/lib/imports/types/table";
import type { TableSourceMetadata } from "@/lib/table/types";
import { VirtualizedTable } from "@/components/virtualized-table/virtualized-table";
import { useVirtualizedTable } from "@/components/virtualized-table/hooks/useVirtualizedTable";
import { usePlaygroundDataProvider } from "./hooks/usePlaygroundDataProvider";
import type { TableMutations } from "@/lib/table/types";

interface PlaygroundReadyProps {
  table: Table<TableRow>;
  metadata: TableSourceMetadata;
  mutations: TableMutations;
}

function PlaygroundReady({ table, metadata, mutations }: PlaygroundReadyProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <div className="w-full h-[500px]">
        <VirtualizedTable table={table} metadata={metadata} mutations={mutations} />
      </div>
    </div>
  );
}

function PlaygroundLoading() {
  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <div className="w-full h-[500px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading playground...</p>
      </div>
    </div>
  );
}

function PlaygroundError({ message }: { message: string }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <div className="w-full h-[500px] flex items-center justify-center">
        <p className="text-destructive">Error: {message}</p>
      </div>
    </div>
  );
}

export function Playground() {
  const provider = usePlaygroundDataProvider();

  const table = useVirtualizedTable({
    tabledata: provider.data,
    mutations: provider.mutations,
  });

  switch (provider.status) {
    case "loading":
      return <PlaygroundLoading />;
    case "error":
      return <PlaygroundError message={provider.error?.message ?? "Unknown error"} />;
    case "ready":
      return (
        <PlaygroundReady
          table={table}
          metadata={provider.metadata}
          mutations={provider.mutations}
        />
      );
    case "empty":
      return (
        <div className="border rounded-lg overflow-hidden bg-background">
          <div className="w-full h-[500px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </div>
      );
  }
}
