export function useDetectOS() {
	const { userAgent } = navigator;

	if (userAgent.includes("Mac")) return "mac";
	if (userAgent.includes("Linux")) return "linux";
	if (userAgent.includes("Win")) return "windows";

	return "unknown";
}
