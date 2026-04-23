## Root Agent Defaults (`code/AGENTS.md`)
- Keep responses concise.
- Prefer minimal diffs.
- Do not break HTML.
- Do not run a build unless I explicitly ask.
- Warn me when you think I need to stop `npm run dev` and start it again.

## Markdown Encoding Rule
- For `.md` files, always save as UTF-8 **without BOM**.
- Frontmatter files must begin with `---` at byte 1 (no hidden BOM prefix).
- After bulk/scripted edits to markdown, quickly verify no BOM was introduced.

## Subproject Override Pattern
