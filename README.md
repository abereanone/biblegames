# Bible Games

Printable and playable Bible games for kids at [biblegames.church](https://biblegames.church). Built with Astro 7 as a static site; every puzzle is generated at build time from the Berean Standard Bible (BSB).

## Games

| Game | URL pattern | Notes |
|---|---|---|
| Word Search | `/games/word-search/<difficulty>/<book>/<chapter>` | Chapter vocabulary. Printable. |
| Cryptogram | `/games/cryptogram/<difficulty>/<book>/<chapter>` | Number-coded verse. Printable. |
| Verse Unscramble | `/games/verse-unscramble/<difficulty>/<book>/<chapter>` | Put the words of a verse back in order. |
| Bible Wordle | `/games/bible-wordle` | Daily Bible reference guessing game. |
| Coloring Pages | `/games/coloring-pages` | Fixed set of pages with easy, medium and hard versions in `public/coloring-pages/`; the list is `src/data/coloringPages.json`. |

`<difficulty>` is `easy`, `medium` or `hard`; `<book>` is a code such as `gen` or `jhn`. Examples: `/games/word-search/easy/gen/1`, `/games/cryptogram/hard/jhn/3`.

## Setup

```bash
npm install
npm run dev
```

Requires Node.js 22.22.0+ (see `.node-version`). The BSB text is read from `data/bsb.json`, which is committed. If that file is missing the game pages render without data, so restore it before building.

## Scripts

- `npm run dev` - start the Astro dev server at `http://localhost:4321/`.
- `npm run build` - production build to `dist/` (about 10,700 pages).
- `npm run preview` - serve the production build locally.

## Where things are

- `src/lib/bible/` - book list and the loader for `data/bsb.json`.
- `src/lib/games/` - the puzzle generators (`wordSearch.ts`, `cryptogram.ts`, `verseUnscramble.ts`, `bibleWordle.ts`, `difficulty.ts`).
- `src/pages/games/` - one page (or one dynamic route) per game.
- `public/sw.js` - service worker for the installable app. Bump `CACHE_VERSION` in it when you change the precached pages.

## Sitemap

The sitemap is an allowlist of nine URLs (`SITEMAP_URLS` in `astro.config.mjs`), not every generated puzzle. Add a URL there when you add a top-level page or game.

## Deployment

Cloudflare Pages builds from GitHub (`wrangler.jsonc` sets `pages_build_output_dir: ./dist`). Pushing to `main` is what makes a change live.
