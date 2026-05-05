import coloringPagesData from "./coloringPages.json";

export type ColoringPage = {
  title: string;
  bibleReference: string;
  description: string;
  printablePath: string;
  previewPath: string;
  display?: boolean;
  level?: string;
};

export const coloringPages = coloringPagesData as ColoringPage[];
