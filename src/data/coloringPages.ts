export type ColoringPage = {
  title: string;
  bibleReference: string;
  description: string;
  pdfPath: string;
  previewPath: string;
};

export const coloringPages: ColoringPage[] = [
  {
    title: "Creation",
    bibleReference: "Genesis 1",
    description: "A printable coloring page about God creating the heavens and the earth.",
    pdfPath: "/coloring-pages/pdf/creation.pdf",
    previewPath: "/coloring-pages/previews/creation.svg",
  },
  {
    title: "Noah's Ark",
    bibleReference: "Genesis 6-9",
    description: "A printable coloring page about Noah, the ark, and God's promise.",
    pdfPath: "/coloring-pages/pdf/noahs-ark.pdf",
    previewPath: "/coloring-pages/previews/noahs-ark.svg",
  },
  {
    title: "David and Goliath",
    bibleReference: "1 Samuel 17",
    description: "A printable coloring page about David trusting the Lord against Goliath.",
    pdfPath: "/coloring-pages/pdf/david-and-goliath.pdf",
    previewPath: "/coloring-pages/previews/david-and-goliath.svg",
  },
  {
    title: "Daniel in the Lions' Den",
    bibleReference: "Daniel 6",
    description: "A printable coloring page about God protecting Daniel in the lions' den.",
    pdfPath: "/coloring-pages/pdf/daniel-lions-den.pdf",
    previewPath: "/coloring-pages/previews/daniel-lions-den.svg",
  },
  {
    title: "Jesus Feeds the 5,000",
    bibleReference: "John 6",
    description: "A printable coloring page about Jesus feeding the crowd with loaves and fish.",
    pdfPath: "/coloring-pages/pdf/jesus-feeds-5000.pdf",
    previewPath: "/coloring-pages/previews/jesus-feeds-5000.svg",
  },
  {
    title: "The Empty Tomb",
    bibleReference: "Matthew 28",
    description: "A printable coloring page celebrating Jesus' resurrection.",
    pdfPath: "/coloring-pages/pdf/empty-tomb.pdf",
    previewPath: "/coloring-pages/previews/empty-tomb.svg",
  },
];
