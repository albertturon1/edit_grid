export function LiveIndicator() {
	return (
		<span className="relative flex h-2.5 w-2.5">
			<span className="absolute inset-0 rounded-full bg-green-400 blur-[3px] animate-pulse [animation-duration:3s]" />
			<span className="relative rounded-full h-2.5 w-2.5 bg-green-500" />
		</span>
	);
}
