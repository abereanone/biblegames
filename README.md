# Bible Games

Kids can pick a Bible chapter and print game sheets:

- Word Search (chapter vocabulary)
- Cryptogram (number-coded verse)
- Difficulty modes: `easy`, `medium`, `hard`

## Setup

1. Install dependencies:
   `npm install`
2. Copy a BSB dataset file to:
   `data/bsb.json`
3. Start local dev:
   `npm run dev`

BSB data is expected at `data/bsb.json`.

Example game URLs after data import:

- `/games/word-search/easy/gen/1`
- `/games/cryptogram/hard/jhn/3`
