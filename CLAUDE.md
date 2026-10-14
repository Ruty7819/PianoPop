# PianoPop
Free Hebrew RTL piano-learning web app. Reply to the user in Hebrew.

## Start every session
Read `docs/plan.md` → "Current task" + its Refs only. Other docs on demand, by section:
- `docs/requirements.md` – what to build (decision ids D-xx)
- `docs/architecture.md` – layers, folders, contracts
Never open: `docs/spec/*.docx`, `package-lock.json`, `dist/`, `public/samples/`, `node_modules/`.

## Rules
- Product questions not answered in requirements.md → ask the owner, don't guess. Suggestions are labelled as such until approved; approved answers go into requirements.md.
- One plan task per session. End: `npm run check` → commit → push → tick task in plan.md, set next "Current task".
- Find before reading: Grep/Glob, then Read only the needed range. Don't reread a file after editing it.
- Read a folder's `index.ts`/`types.ts` before any implementation file.
- Files < 150 lines (max 250); split instead of growing.
- Run single test files while working (`npx vitest run <file>`); full `npm run check` once at the end.
- Keep replies short: what changed, what's next, any question.

## Code conventions
- English code/comments; all UI text in `src/i18n/he.ts` only, plural addressing ("לחצו").
- `dir="rtl"` app; Piano and Staff wrapped in `dir="ltr"`. Tailwind logical classes (`ms-`, `pe-`, `start-`).
- Keyboard input by `KeyboardEvent.code`.
- Business rules only in `src/engine/` (pure TS, tested); components stay thin. Cite decision ids in comments where a rule comes from (`// D-58`).
- Content ids are stable; never rename.
- Audio starts only after a user gesture; audio clock is the single time source.

## Commands
- `npm run dev` – dev server · `npm run check` – lint + typecheck + tests + build (CI runs the same)
- `npx vitest run <file>` – one test file · `npm run format` – Prettier
