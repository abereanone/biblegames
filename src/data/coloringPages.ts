import coloringPagesData from "./coloringPages.json";

export type ColoringPage = {
  title: string;
  ref: string;
  description: string;
  easyPath: string;
  mediumPath: string;
  hardPath: string;
};

export const coloringPages = coloringPagesData as ColoringPage[];
