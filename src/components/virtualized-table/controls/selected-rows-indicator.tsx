import { Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type SelectedRowsIndicatorProps = {
  message: string;
  rowSelectionMode: boolean;
};

export function SelectedRowsIndicator(props: SelectedRowsIndicatorProps) {
  if (!props.rowSelectionMode) {
    return null;
  }

  return <div className="text-sm text-muted-foreground tabular-nums">{props.message}</div>;
}

export function SelectedRowsIndicatorMobile(props: SelectedRowsIndicatorProps) {
  return (
    <div
      className={cn(
        "transition-height-opacity ease-in-out duration-200",
        props.rowSelectionMode ? "opacity-100 h-10" : "h-0 opacity-0",
      )}
    >
      <Alert className="p-3 w-full flex items-center justify-center">
        <AlertDescription className="text-xs flex items-center gap-x-2">
          <Check className="h-4 w-4 text-primary" />
          {props.message}
        </AlertDescription>
      </Alert>
    </div>
  );
}
