export const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type PuzzleDifficulty = (typeof DIFFICULTIES)[number];

export function parseDifficulty(value: string): PuzzleDifficulty {
  const normalized = String(value ?? "").trim().toLowerCase();
  return DIFFICULTIES.includes(normalized as PuzzleDifficulty) ? (normalized as PuzzleDifficulty) : "medium";
}
