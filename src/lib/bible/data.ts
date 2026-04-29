import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { BIBLE_BOOKS, BOOKS_BY_CODE, type Testament } from "./books";

type RawVerse = {
  chapter?: number;
  verse?: number;
  text?: string;
};

type RawBibleData = Record<string, RawVerse[][]>;

export type BibleBookSummary = {
  code: string;
  name: string;
  testament: Testament;
  chapterCount: number;
};

export type BibleVerse = {
  key: string;
  reference: string;
  bookCode: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
};

export type BibleChapter = {
  key: string;
  bookCode: string;
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
};

export type BibleData = {
  hasData: boolean;
  sourcePath: string;
  books: BibleBookSummary[];
  chapterMap: Map<string, BibleChapter>;
};

const projectRoot = process.cwd();
const confessionSourceConfigPath = path.resolve(
  projectRoot,
  "..",
  "confession",
  "shared",
  "data",
  "bible-source.json"
);

let bibleCache: Promise<BibleData> | null = null;

function chapterKey(bookCode: string, chapter: number): string {
  return `${bookCode}:${chapter}`;
}

async function fileExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function normalizeBookCode(code: string): string | null {
  const normalized = String(code ?? "").trim().toLowerCase();
  return BOOKS_BY_CODE.has(normalized) ? normalized : null;
}

async function resolveBiblePath(): Promise<string | null> {
  const localCopyPath = path.resolve(projectRoot, "data", "bsb.json");

  const candidates: string[] = [localCopyPath];

  if (await fileExists(confessionSourceConfigPath)) {
    try {
      const sourceConfigRaw = await readFile(confessionSourceConfigPath, "utf-8");
      const sourceConfig = JSON.parse(sourceConfigRaw) as { datasetPath?: string };
      const datasetPath = typeof sourceConfig.datasetPath === "string" ? sourceConfig.datasetPath.trim() : "";
      if (datasetPath) {
        candidates.unshift(path.resolve(path.dirname(confessionSourceConfigPath), datasetPath));
      }
    } catch {
      // Use fallbacks below if confession source config cannot be read.
    }
  }

  candidates.push(path.resolve(projectRoot, "..", "catechize.ing", "bsb-data-pipeline", "bsb.json"));

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return candidate;
    }
  }

  return null;
}

async function loadBibleData(): Promise<BibleData> {
  const sourcePath = await resolveBiblePath();

  if (!sourcePath) {
    return {
      hasData: false,
      sourcePath: path.resolve(projectRoot, "data", "bsb.json"),
      books: [],
      chapterMap: new Map<string, BibleChapter>(),
    };
  }

  const raw = JSON.parse(await readFile(sourcePath, "utf-8")) as RawBibleData;
  const books: BibleBookSummary[] = [];
  const chapterMap = new Map<string, BibleChapter>();

  for (const [rawCode, rawChapters] of Object.entries(raw)) {
    const bookCode = normalizeBookCode(rawCode);
    if (!bookCode) {
      continue;
    }

    const bookMeta = BOOKS_BY_CODE.get(bookCode);
    if (!bookMeta) {
      continue;
    }

    const chapters = Array.isArray(rawChapters) ? rawChapters : [];
    let chapterCount = 0;

    for (const [chapterIndex, rawVerses] of chapters.entries()) {
      const verses = (Array.isArray(rawVerses) ? rawVerses : [])
        .map((entry) => {
          const chapter = Number(entry?.chapter) || chapterIndex + 1;
          const verse = Number(entry?.verse) || 0;
          const text = String(entry?.text ?? "").trim();

          if (!verse || !text) {
            return null;
          }

          return {
            key: `${bookCode}.${chapter}.${verse}`,
            reference: `${bookMeta.name} ${chapter}:${verse}`,
            bookCode,
            bookName: bookMeta.name,
            chapter,
            verse,
            text,
          } satisfies BibleVerse;
        })
        .filter((entry): entry is BibleVerse => Boolean(entry));

      if (!verses.length) {
        continue;
      }

      const chapter = chapterIndex + 1;
      chapterCount = Math.max(chapterCount, chapter);
      chapterMap.set(chapterKey(bookCode, chapter), {
        key: chapterKey(bookCode, chapter),
        bookCode,
        bookName: bookMeta.name,
        chapter,
        verses,
      });
    }

    if (chapterCount > 0) {
      books.push({
        code: bookMeta.code,
        name: bookMeta.name,
        testament: bookMeta.testament,
        chapterCount,
      });
    }
  }

  books.sort((a, b) => (BOOKS_BY_CODE.get(a.code)?.order ?? 999) - (BOOKS_BY_CODE.get(b.code)?.order ?? 999));

  return {
    hasData: true,
    sourcePath,
    books,
    chapterMap,
  };
}

export async function getBibleData(): Promise<BibleData> {
  if (!bibleCache) {
    bibleCache = loadBibleData();
  }
  return bibleCache;
}

export async function getChapter(bookCode: string, chapter: number): Promise<BibleChapter | null> {
  const bible = await getBibleData();
  return bible.chapterMap.get(chapterKey(bookCode, chapter)) ?? null;
}
