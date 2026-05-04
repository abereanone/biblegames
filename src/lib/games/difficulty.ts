export const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type PuzzleDifficulty = (typeof DIFFICULTIES)[number];

export const DIFFICULTY_LABELS = {
  easy: "Easy (4-6)",
  medium: "Medium (7-10)",
  hard: "Hard (11 and up)",
} satisfies Record<PuzzleDifficulty, string>;

export function parseDifficulty(value: string): PuzzleDifficulty {
  const normalized = String(value ?? "").trim().toLowerCase();
  return DIFFICULTIES.includes(normalized as PuzzleDifficulty) ? (normalized as PuzzleDifficulty) : "medium";
}
