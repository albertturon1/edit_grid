import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EXPORT_TYPE } from "@/components/virtualized-table/export-dialog";
import type { Control } from "react-hook-form";
import type { ExportDialogFormSchema } from "@/components/virtualized-table/export-dialog";

type ExportDialogRadioGroupProps = {
	control: Control<ExportDialogFormSchema>;
};

export function ExportDialogRadioGroup({
	control,
}: ExportDialogRadioGroupProps) {
	return (
		<FormField
			control={control}
			name="exportType"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="">{"How do you want to export it?"}</FormLabel>
					<FormControl>
						<RadioGroup
							onValueChange={field.onChange}
							defaultValue={field.value}
							className="flex flex-col space-y-1"
						>
							<FormItem className="flex items-center space-x-3 space-y-0">
								<FormControl>
									<RadioGroupItem value={EXPORT_TYPE.selected} />
								</FormControl>
								<FormLabel className="font-normal">
									{"Export selected"}
								</FormLabel>
							</FormItem>
							<FormItem className="flex items-center space-x-3 space-y-0">
								<FormControl>
									<RadioGroupItem value={EXPORT_TYPE.all} />
								</FormControl>
								<FormLabel className="font-normal">{"Export all"}</FormLabel>
							</FormItem>
						</RadioGroup>
					</FormControl>
				</FormItem>
			)}
		/>
	);
}
