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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import type { TableDataStatus } from "@/components/virtualized-table/hooks/useDataProperties";
import { ExportDialogRadioGroup } from "@/components/virtualized-table/export-dialog-radio-group";
import { splitOnLastOccurrence } from "@/lib/utils";
import type { TableHeaders } from "@/features/home/utils/mapHeadersToRows";
import { Checkbox } from "@/components/ui/checkbox";

export const EXPORT_TYPE = {
	all: "all",
	selected: "selected",
} as const;

const exportTypeSchema = z.enum([EXPORT_TYPE.all, EXPORT_TYPE.selected], {
	required_error: "The export type must be selected..",
});

const commonSchema = z.object({
	filename: z
		.string({
			required_error: "Filename cannot be empty.",
		})
		.min(1),
	includeHeaders: z.boolean(),
});

function createFormSchema(isPartialData: boolean) {
	return commonSchema.extend({
		exportType: isPartialData ? exportTypeSchema : z.undefined(),
	});
}

export type ExportDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	dataStatus: TableDataStatus;
	onSubmit: (data: ExportDialogFormSchema) => void;
	onCancel: () => void;
	originalFilename: string;
	headers: TableHeaders;
};

export type ExportDialogFormSchema = z.infer<
	ReturnType<typeof createFormSchema>
>;

export function ExportDialog({
	open,
	dataStatus,
	onCancel,
	originalFilename,
	headers,
	...props
}: ExportDialogProps) {
	const [originalFilenameExtensionless] = splitOnLastOccurrence(
		originalFilename,
		".",
	);

	const formSchema = createFormSchema(dataStatus === "partial");
	const form = useForm<ExportDialogFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			filename: originalFilenameExtensionless,
			includeHeaders: headers.isOriginal, // based on user's selection of `firstRowAsHeaders`
			exportType: EXPORT_TYPE.selected,
		},
	});

	function onSubmit(data: ExportDialogFormSchema) {
		props.onSubmit(data);
	}

	function onOpenChange(isOpen: boolean) {
		props.onOpenChange(isOpen);

		if (!isOpen) {
			//clear errors on closing - fields will by validate onSubmit anyway
			form.clearErrors();
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{"Export File"}</DialogTitle>
					<DialogDescription>
						{
							"Configure your file export settings. Enter a file name and choose your export preferences."
						}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="filename"
							render={({ field }) => (
								<FormItem>
									<div>
										<FormLabel>{"Filename"}</FormLabel>
										<FormDescription>
											{"Enter the name of the file."}
										</FormDescription>
										<FormMessage />
									</div>
									<FormControl>
										<Input placeholder="Enter filename" {...field} />
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
						{dataStatus === "partial" ? (
							<ExportDialogRadioGroup control={form.control} />
						) : null}
						<DialogFooter className="w-full">
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
