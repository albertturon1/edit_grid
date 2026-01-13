import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";

const importFormSchema = z.object({
	firstRowAsHeaders: z.boolean(),
});

export type ImportSettingsFormSchema = z.infer<typeof importFormSchema>;

export type ImportSettingsDialogProps = {
	dataLength: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCancel: () => void;
	onSubmit: (data: ImportSettingsFormSchema) => void;
};

export function ImportSettingsDialog({
	open,
	onCancel,
	dataLength,
	...props
}: ImportSettingsDialogProps) {
	const form = useForm<ImportSettingsFormSchema>({
		resolver: zodResolver(importFormSchema),
		defaultValues: {
			firstRowAsHeaders: true,
		},
		mode: "onTouched",
	});

	function onSubmit(data: ImportSettingsFormSchema) {
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
			<DialogContent className="w-11/12 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{"Import File"}</DialogTitle>
					<DialogDescription>
						{
							"Adjust settings for importing this file. Click import when you're done."
						}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="firstRowAsHeaders"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center space-x-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>{"Use first row as headers"}</FormLabel>
								</FormItem>
							)}
						/>
						<DialogFooter className="w-full flex flex-col-reverse sm:flex-row gap-y-2">
							<Button variant="outline" onClick={onCancel}>
								{"Cancel"}
							</Button>
							<Button type="submit">{"Import"}</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
