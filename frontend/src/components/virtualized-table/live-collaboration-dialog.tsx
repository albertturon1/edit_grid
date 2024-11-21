import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "@tanstack/react-router";
import type { TableHeaders } from "../file-picker-import-dialog/mapHeadersToRows";

export type LiveCollaborationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  headers: TableHeaders;
  filename: string;
};

export function LiveCollaborationDialog({
  open,
  onCancel,
  onOpenChange,
  headers,
  filename,
}: LiveCollaborationDialogProps) {
  const navigate = useNavigate({ from: "/" });

  const { toast } = useToast();

  function handleOpenChange(isOpen: boolean) {
    onOpenChange(isOpen);
  }

  async function startCollaboration() {
    try {
      const res = await fetch("http://localhost:8080/create-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rows: [["row1", "row2"]],
          headers: headers.values,
          filename,
        }),
      })
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error));

      navigate({
        to: "/room/$roomId",
        params: {
          roomId: res.id,
        },
      });
    } catch (error) {
      toast({ title: "Error fetching room url", variant: "destructive" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-11/12 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{"Live Collaboration"}</DialogTitle>
          <DialogDescription>{"Start Live Collaboration"}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex flex-col-reverse sm:flex-row gap-y-2">
          <Button onClick={startCollaboration} onKeyDown={startCollaboration}>
            {"Start collaboration"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {"Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
