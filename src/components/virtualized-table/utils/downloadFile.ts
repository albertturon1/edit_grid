export function downloadBlob(content: string, filename: string) {
	const blob = new Blob([content], { type: "text/csv" });

	const a = document.createElement("a");
	a.href = window.URL.createObjectURL(blob);
	a.download = filename;

	a.click();

	window.URL.revokeObjectURL(a.href);
}
