import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type LeaveBlockerDialogProps = {
	open: boolean;
	onCancel: () => void;
	onAction: () => void;
};

export function LeaveBlockerDialog({
	open,
	onCancel,
	onAction,
}: LeaveBlockerDialogProps) {
	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{"Do you want to leave?"}</AlertDialogTitle>
					<AlertDialogDescription>
						{"You have some unsaved changes in this page."}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel}>{"Cancel"}</AlertDialogCancel>
					<AlertDialogAction onClick={onAction}>{"Continue"}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
