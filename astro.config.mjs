import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import path from "node:path";

// The build emits 10,700+ pages, but 10,701 of those are one generated puzzle per
// difficulty/book/chapter combination — the same template with different words in it.
// Listing every permutation would submit thousands of near-duplicate pages and say
// nothing about which pages matter.
//
// So the sitemap is an allowlist of the pages a person would actually land on: the
// static pages, the two self-contained games, and the entry point of each generated
// game — exactly the links the home page offers. Everything past that is reachable by
// crawling from those pages if Google wants it.
//
// Trailing slashes are required: every canonical tag ends in one and Cloudflare Pages
// 308-redirects the bare form to it, so a slashless entry here would list a redirect.
const SITEMAP_URLS = new Set([
  "https://biblegames.church/",
  "https://biblegames.church/about/",
  "https://biblegames.church/copyright/",
  "https://biblegames.church/printing-advice/",
  "https://biblegames.church/games/bible-wordle/",
  "https://biblegames.church/games/coloring-pages/",
  // One entry point per generated game — the same three the home page links to.
  "https://biblegames.church/games/cryptogram/medium/gen/1/",
  "https://biblegames.church/games/verse-unscramble/medium/gen/1/",
  "https://biblegames.church/games/word-search/medium/gen/1/",
]);

export default defineConfig({
  site: "https://biblegames.church",
  // Astro 7 defaults to "jsx", which drops the line break between text and an inline
  // tag ("enjoy<a>x</a>and" renders as "enjoyxand"). true keeps the Astro 6 behaviour.
  compressHTML: true,
  integrations: [sitemap({ filter: (page) => SITEMAP_URLS.has(page) })],
  vite: {
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  },
});
