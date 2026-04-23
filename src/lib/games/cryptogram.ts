import type { BibleVerse } from "@/lib/bible/data";
import type { PuzzleDifficulty } from "./difficulty";

export function pickDefaultVerse(verses: BibleVerse[], difficulty: PuzzleDifficulty): BibleVerse | null {
  if (!verses.length) {
    return null;
  }

  const config = {
    easy: { min: 20, max: 70 },
    medium: { min: 35, max: 120 },
    hard: { min: 65, max: 180 },
  }[difficulty];

  const preferred = verses.find((verse) => {
    const length = verse.text.replace(/[^A-Za-z]/g, "").length;
    return length >= config.min && length <= config.max;
  });

  return preferred ?? verses[Math.floor(verses.length / 2)] ?? verses[0];
}
