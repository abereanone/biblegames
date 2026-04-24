import type { BibleVerse } from "@/lib/bible/data";
import type { PuzzleDifficulty } from "./difficulty";

export type UnscrambleWord = {
  index: number;
  answer: string;
  scrambled: string;
  length: number;
  firstLetter: string;
  hintIndex: number;
  hintLetter: string;
};

export type VerseUnscramblePuzzle = {
  words: UnscrambleWord[];
  bankWords: string[];
  showWordBank: boolean;
  showReference: boolean;
  showFirstLetterHints: boolean;
  clueText: string;
  answerText: string;
};

const DIFFICULTY_CONFIG = {
  easy: { minLetters: 18, maxLetters: 65, maxWords: 10, showWordBank: true, showReference: true, showFirstLetterHints: true },
  medium: {
    minLetters: 32,
    maxLetters: 115,
    maxWords: 12,
    showWordBank: true,
    showReference: false,
    showFirstLetterHints: false,
  },
  hard: { minLetters: 60, maxLetters: 170, maxWords: 16, showWordBank: false, showReference: false, showFirstLetterHints: false },
} as const;

function createSeededRandom(seedText: string): () => number {
  let hash = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    hash ^= seedText.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return () => {
    hash += 0x6d2b79f5;
    let value = Math.imul(hash ^ (hash >>> 15), 1 | hash);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(values: T[], randomFn: () => number): T[] {
  const list = [...values];
  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(randomFn() * (index + 1));
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }
  return list;
}

function scrambleWord(word: string, randomFn: () => number): string {
  if (word.length < 3) {
    return word;
  }

  const letters = word.split("");
  for (let attempts = 0; attempts < 5; attempts += 1) {
    const shuffled = shuffle(letters, randomFn).join("");
    if (shuffled !== word) {
      return shuffled;
    }
  }

  return word.slice(1) + word[0];
}

function normalizeWords(text: string): string[] {
  return (text.match(/[A-Za-z]+/g) ?? []).map((entry) => entry.toUpperCase());
}

export function pickUnscrambleVerse(verses: BibleVerse[], difficulty: PuzzleDifficulty): BibleVerse | null {
  if (!verses.length) {
    return null;
  }

  const config = DIFFICULTY_CONFIG[difficulty];
  const preferred = verses.find((verse) => {
    const letterCount = verse.text.replace(/[^A-Za-z]/g, "").length;
    return letterCount >= config.minLetters && letterCount <= config.maxLetters;
  });

  return preferred ?? verses[Math.floor(verses.length / 2)] ?? verses[0];
}

export function buildVerseUnscramble(verse: BibleVerse, difficulty: PuzzleDifficulty): VerseUnscramblePuzzle {
  const config = DIFFICULTY_CONFIG[difficulty];
  const words = normalizeWords(verse.text).slice(0, config.maxWords);
  const orderedWords = words.length ? words : ["BIBLE", "VERSE", "TRUTH"];
  const puzzleWords =
    difficulty === "medium" || difficulty === "hard"
      ? shuffle([...orderedWords], createSeededRandom(`${verse.key}|${difficulty}|order`))
      : orderedWords;
  const random = createSeededRandom(`${verse.key}|${difficulty}|unscramble`);
  const hintRandom = createSeededRandom(`${verse.key}|${difficulty}|hints`);

  const items = puzzleWords.map((answer, index) => {
    const hintIndex = answer.length ? Math.floor(hintRandom() * answer.length) : 0;
    return {
      index: index + 1,
      answer,
      scrambled: scrambleWord(answer, random),
      length: answer.length,
      firstLetter: answer[0] ?? "",
      hintIndex,
      hintLetter: answer[hintIndex] ?? "",
    };
  });

  const bankWords = config.showWordBank
    ? shuffle(
        items.map((item) => item.answer),
        createSeededRandom(`${verse.key}|${difficulty}|bank`)
      )
    : [];

  const clueText =
    difficulty === "easy"
      ? "Unscramble each word and write the answer. One letter is shown in its correct spot."
      : difficulty === "medium"
        ? "Unscramble each word, then use the word bank to place words in the right verse order."
        : "Unscramble more words with no word bank clues.";

  return {
    words: items,
    bankWords,
    showWordBank: config.showWordBank,
    showReference: config.showReference,
    showFirstLetterHints: config.showFirstLetterHints,
    clueText,
    answerText: orderedWords.join(" "),
  };
}
