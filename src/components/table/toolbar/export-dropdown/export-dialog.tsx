import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { splitOnLastOccurrence } from "@/lib/utils";
import {
  EXPORT_TYPE,
  exportDialogFormSchema as formSchema,
  type ExportDialogFormSchema,
} from "./export-types";

export interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ExportDialogFormSchema) => void;
  onCancel: () => void;
  originalFilename: string;
}

export function ExportDialog({
  open,
  onCancel,
  originalFilename,
  onOpenChange,
  onSubmit,
}: ExportDialogProps) {
  const [originalFilenameExtensionless] = splitOnLastOccurrence(originalFilename, ".");

  const form = useForm<ExportDialogFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filename: originalFilenameExtensionless,
      includeHeaders: true,
      exportType: EXPORT_TYPE.selected,
    },
  });

  function handleSubmit(data: ExportDialogFormSchema) {
    onSubmit(data);
  }

  function handleOpenChange(isOpen: boolean) {
    onOpenChange(isOpen);

    if (!isOpen) {
      // Clear errors on closing - fields will be validated onSubmit anyway
      form.clearErrors();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-11/12 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export File</DialogTitle>
          <DialogDescription>Configure file export settings.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="filename"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <FormLabel>File name</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input placeholder="Enter file name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="includeHeaders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Include headers in the output</FormLabel>
                </FormItem>
              )}
            />
            <DialogFooter className="w-full flex flex-col-reverse sm:flex-row gap-y-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Export</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
