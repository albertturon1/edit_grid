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
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { ExportDialogRadioGroup } from "@/components/virtualized-table/export-dialog-radio-group";
import { splitOnLastOccurrence } from "@/lib/utils";
import type { TableHeaders } from "@/components/file-picker-import-dialog/mapHeadersToRows";
import { Checkbox } from "@/components/ui/checkbox";

export const EXPORT_TYPE = {
	all: "all",
	selected: "selected",
} as const;

const exportTypeSchema = z.enum([EXPORT_TYPE.all, EXPORT_TYPE.selected], {
	required_error: "The export type must be selected..",
});

const formSchema = z.object({
	filename: z
		.string({
			required_error: "File name cannot be empty.",
		})
		.min(1),
	includeHeaders: z.boolean(),
	exportType: exportTypeSchema,
});

export type ExportDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	rowSelectionMode: boolean;
	onSubmit: (data: ExportDialogFormSchema) => void;
	onCancel: () => void;
	originalFilename: string;
	headers: TableHeaders;
};

export type ExportDialogFormSchema = z.infer<typeof formSchema>;

export function ExportDialog({
	open,
	rowSelectionMode,
	onCancel,
	originalFilename,
	headers,
	onOpenChange,
	onSubmit,
}: ExportDialogProps) {
	const [originalFilenameExtensionless] = splitOnLastOccurrence(
		originalFilename,
		".",
	);

	const form = useForm<ExportDialogFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			filename: originalFilenameExtensionless,
			includeHeaders: headers.isOriginal, // based on user's selection of `firstRowAsHeaders`
			exportType: EXPORT_TYPE.selected,
		},
	});

	function handleSubmit(data: ExportDialogFormSchema) {
		onSubmit(data);
	}

	function handleOpenChange(isOpen: boolean) {
		onOpenChange(isOpen);

		if (!isOpen) {
			//clear errors on closing - fields will by validate onSubmit anyway
			form.clearErrors();
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="w-11/12 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{"Export File"}</DialogTitle>
					<DialogDescription>
						{"Configure file export settings."}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="filename"
							render={({ field }) => (
								<FormItem>
									<div>
										<FormLabel>{"File name"}</FormLabel>
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
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>{"Include headers in the output"}</FormLabel>
								</FormItem>
							)}
						/>
						{rowSelectionMode ? (
							<ExportDialogRadioGroup control={form.control} />
						) : null}
						<DialogFooter className="w-full flex flex-col-reverse sm:flex-row gap-y-2">
							<Button variant="outline" onClick={onCancel}>
								{"Cancel"}
							</Button>
							<Button type="submit">{"Export"}</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
