# PianoPop

Free Hebrew (RTL) web app for learning piano. Full dev requirements: `docs/requirements.md` — read only the section you need. Product spec (human-facing, Word): `docs/spec/` — do not open the .docx unless asked; requirements.md already reflects it.

## Working rules
- Reply to the user in Hebrew.
- Never decide product questions alone. If something isn't covered by requirements.md, ask; mark any suggestion as a recommendation until approved. Record approved decisions in requirements.md (and note them for the next spec version).
- Work milestone by milestone (requirements.md §14). Finish = tests green + `npm run build` passes, then commit and push.
- Commit small, descriptive messages in English. Push to `origin main` after each completed milestone or meaningful step.

## Stack
Vite + React + TypeScript (strict) · Tailwind · Supabase (Postgres, Google auth, RLS) · Tone.js · VexFlow · Vitest · Playwright · Vercel.

## Code conventions
- Code, identifiers and comments in English. All UI text in Hebrew, only in `src/i18n/he.ts`; plural addressing ("לחצו").
- `<html dir="rtl">`; use logical Tailwind classes (`ms-`, `pe-`, `start-`). Piano and staff are always wrapped in `dir="ltr"`.
- Keyboard input by `KeyboardEvent.code`, never `.key`.
- Scoring/progress logic is pure TS in `src/engine/` with unit tests; components stay thin.
- Content lives in `src/content/` as typed TS data; ids are stable and never renamed.
- Audio only after a user gesture; one time source (audio clock) for rhythm.

## Commands
(fill in after M0 setup)
