import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	DialogHeader,
	DialogFooter,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

const importFormSchema = z.object({
	firstRowAsHeaders: z.boolean(),
	fromRow: z.number(),
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
			fromRow: 1,
			firstRowAsHeaders: true,
		},
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

	const [fromRow, firstRowAsHeaders] = form.watch([
		"fromRow",
		"firstRowAsHeaders",
	]);

	const maxInputNumber = firstRowAsHeaders ? dataLength - 1 : dataLength;

	// handle edge case when input "Use First Row as headers" gets toggled and value of `fromRow` is higher than maxInputNumber
	useEffect(() => {
		if (firstRowAsHeaders && fromRow > maxInputNumber) {
			form.setValue("fromRow", maxInputNumber);
		}
	}, [fromRow, maxInputNumber, firstRowAsHeaders, form.setValue]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
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
							name="fromRow"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>{"From row"}</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											min={1}
											max={maxInputNumber}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
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
						<DialogFooter className="w-full">
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
