import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ExportDialog } from "./export-dialog";
import type { ExportDialogFormSchema } from "./export-types";
import { convertIntoCsv } from "@/lib/exports/convertIntoCsv";
import { exportBlobPartToFile } from "@/lib/exports/exportBlobPartToFile";
import type { Row, Table } from "@tanstack/react-table";
import type { TableRow } from "@/lib/imports/types/table";
import { useDataProperties } from "./useDataProperties";
import type { TableSourceMetadata } from "@/lib/table/types";

interface FileDropdownMenuProps {
  className?: string;
  table: Table<TableRow>;
  metadata: TableSourceMetadata;
}

export function FileDropdownMenu({ className, table, metadata }: FileDropdownMenuProps) {
  const { visibleColumnNames } = useDataProperties(table);
  const [isExportAsDialogOpen, setIsExportAsDialogOpen] = useState(false);

  const originalFilename = metadata.filename;

  function handleOpenDialog() {
    setIsExportAsDialogOpen(true);
  }

  function handleExportDialogCancel() {
    setIsExportAsDialogOpen(false);
  }

  function exportData(rows: Row<TableRow>[], filename: string, includeHeaders: boolean) {
    const content = getDataIntoCsv({
      rows,
      includeHeaders,
      visibleColumnNames,
    });

    exportBlobPartToFile({
      content,
      filename: filename.endsWith(".csv") ? filename : `${filename}.csv`,
    });
  }

  function handleExport(filename: string, includeHeaders: boolean) {
    exportData(table.getRowModel().flatRows, filename, includeHeaders);
  }

  function handleExportDialogSubmit(formData: ExportDialogFormSchema) {
    handleExport(formData.filename, formData.includeHeaders);
    setIsExportAsDialogOpen(false);
  }

  function handleExportAll() {
    handleExport(originalFilename, true);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn("gap-x-2 transition-colors", className)}>
            File
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col" align="start">
          <DropdownMenuItem className="gap-x-2 py-2" onClick={handleExportAll}>
            {"Export"}
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem className="gap-x-2 py-2" onClick={handleOpenDialog}>
            Export as
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ExportDialog
        originalFilename={originalFilename}
        open={isExportAsDialogOpen}
        onOpenChange={setIsExportAsDialogOpen}
        onCancel={handleExportDialogCancel}
        onSubmit={handleExportDialogSubmit}
      />
    </>
  );
}

function getDataIntoCsv({
  includeHeaders,
  rows,
  visibleColumnNames,
}: {
  includeHeaders: boolean;
  visibleColumnNames: string[];
  rows: Row<TableRow>[];
}) {
  const mappedRows = mapRowsIntoStringArrays(rows);
  const headers = includeHeaders ? visibleColumnNames : [];

  return convertIntoCsv(headers, mappedRows);
}

function mapRowsIntoStringArrays(rows: Row<TableRow>[]) {
  return rows.map((row) => {
    return row.getAllCells().reduce<string[]>((acc, cell) => {
      const value = cell.getValue();
      if (cell.column.getIsVisible() && typeof value === "string") {
        acc.push(value);
      }
      return acc;
    }, []);
  });
}
