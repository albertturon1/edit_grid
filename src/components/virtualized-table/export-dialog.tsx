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
import type { TableDataStatus } from "./useDataProperties";
import { ExportDialogRadioGroup } from "./export-dialog-radio-group";

export const EXPORT_TYPE = {
	all: "all",
	selected: "selected",
} as const;

const exportTypeSchema = z.enum(
	Object.values(EXPORT_TYPE) as [string, ...string[]],
	{
		required_error: "The export type must be selected..",
	},
);

const filenameSchema = z
	.string({
		required_error: "Filename cannot be empty.",
	})
	.min(1);

function createFormSchema(isPartialData: boolean) {
	if (isPartialData) {
		return z.object({
			filename: filenameSchema,
			exportType: exportTypeSchema,
		});
	}

	return z.object({
		filename: filenameSchema,
		exportType: z.undefined(),
	});
}

export type ExportDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	dataStatus: TableDataStatus;
	onSubmit: (data: ExportDialogFormSchema) => void;
	onCancel: () => void;
};

export type ExportDialogFormSchema = z.infer<
	ReturnType<typeof createFormSchema>
>;

export function ExportDialog({
	open,
	dataStatus,
	onCancel,
	...props
}: ExportDialogProps) {
	const formSchema = createFormSchema(dataStatus === "partial");
	const form = useForm<ExportDialogFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			filename: "",
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
						{"Enter a name for your file. Click export when you're done."}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="filename"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{"Filename"}</FormLabel>
									<FormControl>
										<Input placeholder="Enter filename" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{dataStatus === "full" ? null : (
							<ExportDialogRadioGroup control={form.control} />
						)}
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
