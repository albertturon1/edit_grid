// Paleta kolorów dla użytkowników (przyjazne dla oczu, kontrastowe)
const USER_COLORS = [
	"#E91E63", // Pink
	"#9C27B0", // Purple
	"#673AB7", // Deep Purple
	"#3F51B5", // Indigo
	"#2196F3", // Blue
	"#00BCD4", // Cyan
	"#009688", // Teal
	"#4CAF50", // Green
	"#FF9800", // Orange
	"#FF5722", // Deep Orange
] as const;

// Przymiotniki i rzeczowniki do generowania nazw
const ADJECTIVES = [
	"Happy",
	"Clever",
	"Swift",
	"Brave",
	"Calm",
	"Eager",
	"Gentle",
	"Kind",
	"Lively",
	"Noble",
] as const;

const NOUNS = [
	"Panda",
	"Tiger",
	"Eagle",
	"Dolphin",
	"Fox",
	"Wolf",
	"Bear",
	"Hawk",
	"Lion",
	"Owl",
] as const;

/**
 * Generuje losowy kolor z palety
 */
export function generateUserColor(): string {
	const index = Math.floor(Math.random() * USER_COLORS.length);
	return USER_COLORS[index] ?? USER_COLORS[0];
}

/**
 * Generuje losową nazwę użytkownika (np. "Happy Panda")
 */
export function generateUserName(): string {
	const adjIndex = Math.floor(Math.random() * ADJECTIVES.length);
	const nounIndex = Math.floor(Math.random() * NOUNS.length);
	const adjective = ADJECTIVES[adjIndex] ?? ADJECTIVES[0];
	const noun = NOUNS[nounIndex] ?? NOUNS[0];
	return `${adjective} ${noun}`;
}

/**
 * Generuje inicjały z nazwy (np. "Happy Panda" -> "HP")
 */
export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((word) => word[0] ?? "")
		.join("")
		.toUpperCase()
		.slice(0, 2);
}
