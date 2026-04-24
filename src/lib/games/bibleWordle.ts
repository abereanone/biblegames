import type { BibleData } from "@/lib/bible/data";

export type BibleWordleBook = {
  code: string;
  name: string;
  order: number;
  chapters: Array<{
    chapter: number;
    verseNumbers: number[];
  }>;
};

export type BibleWordleVerse = {
  key: string;
  reference: string;
  order: number;
  bookCode: string;
  bookName: string;
  bookOrder: number;
  chapter: number;
  verse: number;
  text: string;
};

export type BibleWordleData = {
  books: BibleWordleBook[];
  verses: BibleWordleVerse[];
};

export function buildBibleWordleData(bible: BibleData): BibleWordleData {
  const verses: BibleWordleVerse[] = [];
  let verseOrder = 0;
  const books: BibleWordleBook[] = bible.books.map((book, bookOrder) => {
    const chapters = Array.from({ length: book.chapterCount }, (_, index) => {
      const chapterNumber = index + 1;
      const chapterData = bible.chapterMap.get(`${book.code}:${chapterNumber}`);
      const verseNumbers = chapterData?.verses.map((verse) => verse.verse) ?? [];

      for (const verse of chapterData?.verses ?? []) {
        verses.push({
          key: verse.key,
          reference: verse.reference,
          order: verseOrder,
          bookCode: verse.bookCode,
          bookName: verse.bookName,
          bookOrder,
          chapter: verse.chapter,
          verse: verse.verse,
          text: verse.text,
        });
        verseOrder += 1;
      }

      return {
        chapter: chapterNumber,
        verseNumbers,
      };
    });

    return {
      code: book.code,
      name: book.name,
      order: bookOrder,
      chapters,
    };
  });

  return {
    books,
    verses,
  };
}
