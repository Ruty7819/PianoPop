# PianoPop – Work Plan

Working document. Each task = one focused session. Update status here at the end of every task.
Status: `[ ]` todo · `[~]` in progress · `[x]` done · `[?]` blocked on owner decision.

**Current task:** M2.2

## How to run a task (token protocol)
1. Read only: this file's current task + the doc sections it lists under **Refs**. Nothing else up front.
2. Locate code with Grep/Glob; Read only the needed file or line range. Never read `package-lock.json`, `dist/`, `public/samples/`, `docs/spec/*.docx`.
3. Write the test first for anything in `src/engine/`; run only that test file (`npx vitest run <path>`).
4. Finish: `npm run check` (lint + typecheck + tests + build) once, commit, push, tick the box, set **Current task** to the next one.
5. If a product question comes up: stop and ask the owner; don't guess. Record the answer in `requirements.md`.
6. Start a fresh session (/clear) between tasks — the plan + git history carry the state, not the chat.

## Why this order
- **Risk first:** audio latency and touch input on phones are the biggest unknowns → vertical slice (M1) before anything else.
- **Design tokens early (D):** pick the visual direction right after M1, before building many screens → no restyling pass later (restyling = rereading every component).
- **Engine before UI:** pure, tested logic in `src/engine/` means UI tasks are thin and rarely need debugging sessions.
- **Local before cloud:** everything works for guests via `LocalRepository` first; Supabase (M4) only swaps the repository implementation.

## Code-size rules (keep reads cheap)
- One responsibility per file; aim < 150 lines, hard limit 250. Split before growing.
- Each folder exposes its public API in `index.ts` (types + exports only) — read that instead of implementations.
- Contracts live in `types.ts` files; implementations import them, never the other way.
- Content: one file per lesson (`src/content/units/u1/l1.ts`), so editing a lesson never loads the whole unit.
- No comments restating code; short JSDoc only on exported functions whose rule isn't obvious, citing the decision id (e.g. `// D-58`).

---

## M0 – Setup
- [x] **M0.1** Vite + React + TS (strict) + Tailwind + React Router + Zustand; ESLint + Prettier; Vitest + RTL; `npm run check` script; `<html lang="he" dir="rtl">`; folder skeleton per architecture §2 with `index.ts` stubs; `src/i18n/he.ts`.
  Refs: architecture §2, §9 · Done: dev server shows Hebrew RTL placeholder; `npm run check` green.
- [x] **M0.2** GitHub Actions CI running `npm ci && npm run check`; `.env.example`; fill CLAUDE.md "Commands".
  Done: CI green on push.

## M1 – Vertical slice: piano + sound + one exercise
- [x] **M1.1** `engine/notes.ts` (midi ↔ solfège/letters, staff position) + tests. Refs: requirements §4.
- [x] **M1.2** `services/audio` (Tone.js, start gate, sampler subset, `now()`); sample files in `public/samples/` with credit note. Refs: architecture §5.
- [x] **M1.3** `services/input` PianoInput: pointer + multi-touch + keyboard by `code`; events stamped with audio clock; tests with fake clock. Refs: requirements §5.
- [x] **M1.4** `ui/components/Piano`: LTR, responsive octaves (2/3/4), scroll, highlight states, key labels, volume/mute. Refs: requirements §5.
- [x] **M1.5** `engine/scoring.ts` (all thresholds + hint penalty, D-81) + tests; `PressKey` exercise + `FeedbackBanner`; temporary demo route.
  Done (M1): on a real phone and desktop, play notes (mouse/touch/keyboard, Hebrew layout), finish a 10-question press-key set with correct score. Owner checks audio latency feel.

## D – Design direction (owner decision)
- [x] **D.1** Build 2–3 static design directions (home + exercise screen) as one HTML artifact; owner picks. Refs: requirements §4, D-40, D-66, D-79.
- [x] **D.2** Encode the chosen direction as Tailwind tokens + base components (Button, Card, Dialog, ProgressBar). Restyle Piano/PressKey.

## M2 – Exercise engine
- [x] **M2.1** `ui/components/Staff` (VexFlow, treble, highlight, Hebrew label overlay) + `ReadNote`.
- [ ] **M2.2** `PlaySequence` + `HigherLower`.
- [ ] **M2.3** `engine/rhythm.ts` + tests; calibration wizard (`settingsStore.latencyOffsetMs`); `TapRhythm`.
- [ ] **M2.4** `HintMenu` (short hint / explanation / replay demo; ear-exercise rule D-23) wired into scoring; demo playback animation.
  Done (M2): every type playable on the demo route; engine tests cover pass/fail edges and hint penalty.

## M3 – Course (guest mode)
- [ ] **M3.1** `content/types.ts` + `validate.test.ts`; `engine/progress.ts`, `mastery.ts`, `recommend.ts`, `placement.ts` + tests.
- [ ] **M3.2** `services/storage`: `ProgressRepository` + `LocalRepository`; `progressStore`, `settingsStore`.
- [ ] **M3.3** Skill `add-lesson` (`.claude/skills/add-lesson/`): turns an approved lesson outline into a typed lesson file + validation run. Draft unit 1 outline (6 lessons) → **owner approval** (D-55).
- [ ] **M3.4** Lesson files u1/l1–l6 via the skill.
- [ ] **M3.5** Screens: Course map (current + next only, D-79), LessonPlayer (steps, skip explanation), LessonDone, unit summary test.
- [ ] **M3.6** Start (first visit) + Placement + Practice (learned lessons only) + recommendation on Home.
  Done (M3): new guest finishes unit 1 end-to-end; locks enforced; placement works.

## M4 – Accounts (Supabase)
- [?] **M4.0** Owner creates Supabase project + Google OAuth client (needs owner's accounts) — I provide step-by-step instructions.
- [ ] **M4.1** `supabase/migrations`: tables + RLS (requirements §10) + RLS tests.
- [ ] **M4.2** `AuthService` + Login screen + error states (Family Link denial → guest).
- [ ] **M4.3** `SupabaseRepository` + offline write queue.
- [ ] **M4.4** Guest → account migration dialog (D-62).
- [ ] **M4.5** Account screen: export JSON/CSV, reset, delete (Edge Function).
  Done (M4): `/security-review` clean; RLS test proves isolation.

## M5 – Personal area
- [ ] **M5.1** `engine/time.ts` (active time D-73, Jerusalem day D-74, streak) + tests; `useActiveTime`.
- [ ] **M5.2** Me screen: overview, skills, weekly/monthly chart, journal, history.

## M6 – Polish
- [ ] **M6.1** RotatePrompt, offline banner, audio-blocked prompt, all error states (requirements §13).
- [ ] **M6.2** Accessibility pass (keyboard-only lesson, focus, contrast, reduced motion, screen-reader labels).
- [ ] **M6.3** Static pages: about + credits, terms, privacy, accessibility statement (drafts flagged for legal review).

## M7 – Launch
- [ ] **M7.1** Playwright flows (requirements §14 M7).
- [ ] **M7.2** Vercel deploy + production env; browser matrix check; `/code-review`.

---

## Owner decisions pending
- M3.3 unit 1 outline approval · M4.0 Supabase/Google setup · domain (spec פ-17) · name availability (פ-16א).

## Log
- 14.10.2026 — Docs, permissions, architecture, plan. Penalized score compared to threshold (approved).
- 14.10.2026 — D.1: design direction chosen (B layout + A palette, no note colors, Varela Round); recorded in requirements §4.
- 14.10.2026 — D.2: tokens in `src/index.css` (@theme), Varela Round self-hosted (@fontsource), base Button/Card/Dialog/ProgressBar; Piano, PressKey, AudioGate, FeedbackBanner restyled.
- 14.10.2026 — M2.1: Staff (VexFlow 5 bravura, lazy chunk, currentColor + data-tone, HTML label overlay), engine/readNote (exact pitch) on shared engine/questionSet, ReadNote + useQuestionSet hook, /demo/read-note. read-note rules approved → requirements §6.
