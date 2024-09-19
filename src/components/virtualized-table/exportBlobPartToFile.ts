export function exportBlobPartToFile({
	content,
	filename,
}: { content: string; filename: string }) {
	const blob = new Blob([content], { type: "text/csv" });

	const a = document.createElement("a");
	a.href = window.URL.createObjectURL(blob);
	a.download = filename;

	// Trigger the download
	a.click();

	// Clean up
	window.URL.revokeObjectURL(a.href);
}
