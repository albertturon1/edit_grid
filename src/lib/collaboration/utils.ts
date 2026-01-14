const USER_COLORS = [
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#FF9800",
  "#FF5722",
] as const;

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

export function generateUserColor(): string {
  const index = Math.floor(Math.random() * USER_COLORS.length);
  return USER_COLORS[index] ?? USER_COLORS[0];
}

export function generateUserName(): string {
  const adjIndex = Math.floor(Math.random() * ADJECTIVES.length);
  const nounIndex = Math.floor(Math.random() * NOUNS.length);
  const adjective = ADJECTIVES[adjIndex] ?? ADJECTIVES[0];
  const noun = NOUNS[nounIndex] ?? NOUNS[0];
  return `${adjective} ${noun}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
