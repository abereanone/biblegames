import type { PuzzleDifficulty } from "./difficulty";

const ALL_DIRECTIONS = [
  { row: 1, col: 0 },
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 0, col: -1 },
  { row: 1, col: 1 },
  { row: -1, col: -1 },
  { row: 1, col: -1 },
  { row: -1, col: 1 },
];

const STOP_WORDS = new Set([
  "THE",
  "AND",
  "THAT",
  "WITH",
  "FROM",
  "WERE",
  "THEIR",
  "THEY",
  "THIS",
  "YOUR",
  "WILL",
  "HAVE",
  "HAD",
  "FOR",
  "NOT",
  "YOU",
  "HIS",
  "HER",
  "HIM",
  "HAS",
  "WAS",
  "ARE",
  "BEEN",
  "INTO",
  "THEN",
  "WHEN",
  "WHAT",
  "WHERE",
  "THERE",
  "OVER",
  "UNDER",
  "UPON",
  "THEM",
  "THESE",
  "THOSE",
  "LORD",
  "GOD",
  "SAID",
]);

export type WordSearchPuzzle = {
  size: number;
  grid: string[][];
  words: string[];
};

function normalizeWord(rawWord: string): string {
  return rawWord.replace(/[^A-Za-z]/g, "").toUpperCase();
}

function collectChapterWords(verseTexts: string[], difficulty: PuzzleDifficulty): string[] {
  const config = {
    easy: { minLength: 4, maxLength: 9, maxWords: 10 },
    medium: { minLength: 4, maxLength: 12, maxWords: 14 },
    hard: { minLength: 5, maxLength: 13, maxWords: 18 },
  }[difficulty];

  const counts = new Map<string, number>();

  for (const text of verseTexts) {
    const words = text.match(/[A-Za-z']+/g) ?? [];
    for (const rawWord of words) {
      const word = normalizeWord(rawWord);
      if (word.length < config.minLength || word.length > config.maxLength || STOP_WORDS.has(word)) {
        continue;
      }
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length || a[0].localeCompare(b[0]))
    .slice(0, config.maxWords)
    .map(([word]) => word);
}

function canPlaceWord(grid: string[][], word: string, startRow: number, startCol: number, deltaRow: number, deltaCol: number): boolean {
  for (let index = 0; index < word.length; index += 1) {
    const row = startRow + deltaRow * index;
    const col = startCol + deltaCol * index;
    const inBounds = row >= 0 && row < grid.length && col >= 0 && col < grid.length;
    if (!inBounds) {
      return false;
    }
    const existing = grid[row][col];
    if (existing !== "." && existing !== word[index]) {
      return false;
    }
  }
  return true;
}

function placeWord(grid: string[][], word: string, directions: Array<{ row: number; col: number }>): boolean {
  const placements: Array<{ row: number; col: number; deltaRow: number; deltaCol: number }> = [];

  for (let row = 0; row < grid.length; row += 1) {
    for (let col = 0; col < grid.length; col += 1) {
      for (const direction of directions) {
        if (canPlaceWord(grid, word, row, col, direction.row, direction.col)) {
          placements.push({
            row,
            col,
            deltaRow: direction.row,
            deltaCol: direction.col,
          });
        }
      }
    }
  }

  if (!placements.length) {
    return false;
  }

  const pick = placements[Math.floor(Math.random() * placements.length)];
  for (let index = 0; index < word.length; index += 1) {
    const row = pick.row + pick.deltaRow * index;
    const col = pick.col + pick.deltaCol * index;
    grid[row][col] = word[index];
  }

  return true;
}

function fillEmptyCells(grid: string[][]): void {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let row = 0; row < grid.length; row += 1) {
    for (let col = 0; col < grid.length; col += 1) {
      if (grid[row][col] !== ".") {
        continue;
      }
      grid[row][col] = alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  }
}

export function buildWordSearch(verseTexts: string[], difficulty: PuzzleDifficulty): WordSearchPuzzle {
  const candidateWords = collectChapterWords(verseTexts, difficulty);
  const words = candidateWords.length ? candidateWords : ["BIBLE", "CHAPTER", "VERSE", "TRUTH"];
  const directions =
    difficulty === "easy"
      ? ALL_DIRECTIONS.filter((entry) => (entry.row === 1 && entry.col === 0) || (entry.row === 0 && entry.col === 1))
      : difficulty === "medium"
        ? ALL_DIRECTIONS.filter((entry) =>
            (entry.row === 1 && entry.col === 0) ||
            (entry.row === 0 && entry.col === 1) ||
            (entry.row === 1 && entry.col === 1) ||
            (entry.row === 1 && entry.col === -1)
          )
        : ALL_DIRECTIONS;

  const totalLetters = words.reduce((sum, word) => sum + word.length, 0);
  const densityMultiplier = difficulty === "easy" ? 1.6 : difficulty === "medium" ? 1.9 : 2.15;
  const minSize = difficulty === "easy" ? 11 : difficulty === "medium" ? 12 : 13;
  const size = Math.max(minSize, words[0]?.length ?? 10, Math.ceil(Math.sqrt(totalLetters * densityMultiplier)));
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => "."));

  const placed: string[] = [];
  for (const word of words) {
    if (placeWord(grid, word, directions)) {
      placed.push(word);
    }
  }

  fillEmptyCells(grid);

  return {
    size,
    grid,
    words: placed.length ? placed : words,
  };
}
