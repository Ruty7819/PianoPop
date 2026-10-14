# PianoPop – Development Requirements (v1)

Source of truth for product decisions: `docs/spec/אפיון_PianoPop_גרסה_5.1.docx` (decision IDs `D-xx` below = `ד-xx` there).
This file translates the spec into buildable requirements. Items marked **[REC]** are engineering recommendations not yet approved by the product owner; items marked **[OPEN]** need a decision before implementation.

## 1. Product in one paragraph
Free, Hebrew-only (RTL) web app that teaches piano and music basics to kids and adults on one shared track. Users learn in lessons, play an on-screen piano, get instant feedback, and track progress. v1 ships one complete unit; the content system must make adding units trivial. UI is calm and uncluttered: lots of material exists but is revealed progressively (D-79).

## 2. Stack (approved D-65, D-63, D-64)
- Vite + React + TypeScript (strict), Tailwind CSS (RTL via `dir="rtl"` on `<html>`; use logical classes `ms-/me-/ps-/pe-`).
- Supabase (free tier): PostgreSQL, Google OAuth, Row Level Security.
- Hosting: Vercel Hobby (free). Default subdomain until a domain is decided ([OPEN] spec פ-17).
- Audio: Tone.js + Salamander Grand Piano samples (self-hosted, compressed, credit on About page).
- Notation: VexFlow. Hebrew labels rendered as HTML overlay, never inside the SVG.
- Tests: Vitest (+ React Testing Library) for logic/components; Playwright for main flows. **[REC]**
- Routing: React Router. **[REC]**
- Browsers: last 2 versions of Chrome, Safari, Edge, Firefox (D-78). Desktop, tablet, phone (D-15).

## 3. v1 scope (D-53)
In: 1 unit (D-54); on-screen piano; 5 exercise types incl. rhythm (D-57, D-80); latency calibration; hints; placement test (D-49, D-82); unit summary test (D-30, D-61); Google login only (D-36); guest mode + migration (D-37, D-62); personal area; settings; data export + account deletion (D-38); responsive incl. landscape prompt on phones (D-71).
Out: external MIDI piano, narration, sustain pedal, goals/achievements/points, parent management, song choice, admin/CMS, other languages.

## 4. Global UX rules
- All UI text in Hebrew, plural addressing ("לחצו", "נגנו") (D-67). Warm, encouraging tone (D-77).
- All UI strings live in `src/i18n/he.ts` (single file), never inline in components.
- Piano keyboard and staff are always LTR (low notes on the left), wrapped in `dir="ltr"`.
- Note names: solfège by default (דו רה מי פה סול לה סי), setting to switch to C D E (D-51). Spelling: פה, סול, סי; דיאז ♯, במול ♭, בקר ♮.
- Audio starts only after a user gesture ("התחילו" button creates/resumes the AudioContext).
- One primary action per screen; course map shows current + next unit, rest collapsed (D-79).
- Explanations are skippable by everyone (D-21); skipping never skips exercises.
- Hints only on request (D-25); user chooses hint type (D-22); full explanation available directly (D-24).
- No gamification: no points, badges, streak pressure, notifications (D-43, D-47).
- Accessibility target WCAG 2.2 AA **[REC]** (D-42 open): full keyboard operation, visible focus, every sound-based feedback also shown visually, `prefers-reduced-motion` respected, touch targets ≥ 44px, contrast AA.

## 5. On-screen piano
- Visible octaves: phone 2, tablet 3, desktop 4 (D-70); horizontal scroll/arrows to move range.
- Input: mouse, touch (multi-touch), computer keyboard. Map by `KeyboardEvent.code` (physical key) so it works with a Hebrew layout; show the mapped key letter on each piano key (toggle).
- Polyphony: several keys at once (chords); no pedal (D-72).
- Volume slider + mute on the piano bar (D-14).
- Key highlight states: `target`, `correct`, `wrong`, `demo` (animated during demonstrations).
- Phone in portrait on an exercise screen → overlay asking to rotate (D-71), with a "continue anyway" link.

## 6. Exercise engine
Each exercise belongs to a lesson and to one **skill**: `keyboard`, `reading`, `ear`, `rhythm`, `playing`.

| Type id | Task | Checked | Pass threshold (D-81) |
|---|---|---|---|
| `press-key` | Press the named key | correct key | set of 10, ≥ 80% |
| `play-sequence` | Play shown sequence | right notes in right order, timing ignored | ≥ 80% of notes |
| `read-note` | Read note on staff, play it | key matches staff note | set of 10, ≥ 80% |
| `higher-lower` | Which of 2 sounds is higher | choice | set of 10, ≥ 90% |
| `tap-rhythm` | Tap along with a pattern | each tap vs beat after latency offset | ≥ 75% of taps within "good" window |

- Rhythm windows **[REC]**: perfect ≤ ±90 ms, good ≤ ±180 ms; feedback "מוקדם / מדויק / מאוחר". Use the audio clock (`Tone.now()`) as the single time source; convert input timestamps to it.
- Scoring: `score = max(0, raw% − 10 × min(hintsUsed, 3))` (D-60, D-81). Pass = `score ≥ threshold`. **[OPEN]** confirm the penalized score is the one compared to the threshold (assumed).
- Hint types: `short-hint`, `explanation`, `replay-demo` (D-23). In `ear` exercises the demo replay is available only inside the hint menu and counts as a hint; elsewhere a replay button is always visible and free.
- Unlimited retries (D-20). Every attempt is stored.
- Feedback = key colour + short text + sound (D-19).
- Exercise components are pure: they receive the exercise definition + input events and emit an `AttemptResult`. Scoring logic lives in `src/engine/` with unit tests for every type.

## 7. Latency calibration (D-80)
Wizard: metronome clicks, user taps 12 times; offset = median(tap − click); store per device in localStorage (and in settings when logged in). Offered before the first rhythm exercise, re-runnable from Settings. Show a tip when results are very late (> 150 ms): wired headphones/speaker recommended.

## 8. Content
- Content is TypeScript data files in `src/content/` (D-56), typed by `src/content/types.ts`, validated by a Vitest test (unique ids, every exercise has a valid type/skill, referenced notes exist).
- Hierarchy: `Unit → Lesson → Step`. Step kinds: `explanation` (skippable), `demo`, `exercise`, `summary-exercise`.
- Ids are stable strings (`u1`, `u1-l3`, `u1-l3-e2`) — progress data references them, never rename.
- Unit 1 draft per spec rec R-03 (~6 lessons: keyboard layout; finding דו; דו-רה-מי; פה–סי; high vs low; pulse & first melody). Claude drafts, product owner approves (D-55). Melodies: public-domain / folk only.

## 9. Progress rules
- Lesson unlocks only when the previous lesson is completed (D-9). Lesson completed = every exercise in it passed (D-58).
- Skill mastery % = mean of the last 3 attempt scores across that skill's exercises (D-59). Levels: 0–59 "בתחילת הדרך", 60–84 "מתקדמים", 85–100 "שליטה טובה" (D-81).
- Unit summary test: assessment only, does not gate (D-61).
- Placement test (D-82): optional on first visit; one short exercise per lesson of unit 1 in increasing difficulty; each pass marks that lesson completed (source `placement`); stops at first fail; can exit anytime. Built generically so it will unlock whole units later.
- Free practice only for already-learned lessons (D-48). Review only when the user chooses (D-28).
- "Recommended next" (D-75): next incomplete lesson; if all done, an exercise from the weakest skill. Shown as a suggestion, user may ignore (D-31).
- Reset progress with confirmation dialog **[REC]**.

## 10. Accounts & data
- Google login only via Supabase Auth, scopes `openid email profile` (D-36). One learner per account (D-52); kids under 13 use a parent's account (D-39).
- Guest: same data shape stored in localStorage. On login: if account empty → upload guest data after a short notice; if account has progress → dialog: keep account / replace with guest / cancel (D-62).
- Sync: logged-in progress is server-side; works across devices.
- Data export: JSON (all user data) + CSV (attempt history) (D-38, R-55).
- Delete account: confirmation, deletes all user rows + auth user (Supabase Edge Function).
- History kept until account deletion (D-76).
- Collect minimum data: name + email from Google, nothing else. No ads, no third-party trackers.

### Tables (all with RLS: `user_id = auth.uid()`)
- `profiles(id uuid pk → auth.users, display_name text, settings jsonb, created_at)` – settings: `{ noteNames: 'solfege'|'letters', latencyOffsetMs: number|null, showKeyLabels: boolean, explanationLength: 'short'|'full' }`
- `lesson_progress(user_id, lesson_id text, completed_at timestamptz, source text check in ('normal','placement'), pk(user_id, lesson_id))`
- `exercise_attempts(id uuid pk, user_id, lesson_id text, exercise_id text, skill text, started_at, finished_at, raw_score numeric, hints_used int, score numeric, passed bool, details jsonb)`
- `daily_activity(user_id, day date, active_seconds int, pk(user_id, day))` – day in Asia/Jerusalem (D-74).

## 11. Personal area
- Overview: lessons completed, course %, next step (one primary button).
- Skills: level + % per skill.
- Practice time = active time only (D-73): seconds on lesson/exercise screens with an input event in the last 60 s **[REC]**.
- Streak of consecutive active days, shown as plain info (D-47).
- Weekly bar chart of active minutes, monthly toggle; activity journal (date, duration, lessons/exercises, results); attempt history list (D-32, D-33, D-35).

## 12. Screens & routes (D-68)
`/` home · `/start` first visit (start audio → short intro → offer placement) · `/placement` · `/course` map · `/lesson/:lessonId` lesson player (steps incl. exercises) · `/lesson/:lessonId/done` · `/practice` free practice · `/me` personal area · `/settings` (note names, calibration, learning preferences, D-69) · `/login` · `/account` (export, delete, reset) · `/about` (+ credits) · `/terms` · `/privacy` · `/accessibility`.

## 13. Error states
No audio / audio blocked → visible "הפעילו צליל" prompt. Offline → banner; guest data keeps working locally; logged-in writes queued and retried. Login failed (incl. Family Link denial) → friendly Hebrew message + continue as guest. Supabase paused/unavailable → app usable in guest mode.

## 14. Milestones & acceptance criteria
Each milestone ends with: tests green, `npm run build` passes, commit + push.

**M0 – Setup**: Vite+React+TS+Tailwind, RTL root, ESLint+Prettier, Vitest, folder structure, `he.ts`.
✔ App renders Hebrew RTL page; `npm test` and `npm run build` pass.

**M1 – Piano prototype**: piano component (mouse/touch/keyboard, responsive octaves), Tone.js audio, start-audio gate, `press-key` exercise with feedback.
✔ Play notes by all 3 input methods, chords work, Hebrew keyboard layout works, exercise scores a 10-question set correctly (unit tests).

**M2 – Exercise engine**: remaining 4 types, VexFlow staff, hints + penalty, calibration wizard, rhythm judging.
✔ Engine unit tests cover pass/fail edges for every type and hint penalty; calibration stores an offset; rhythm feedback shows early/on-time/late.

**M3 – Course**: content schema + validation test, unit 1 draft content, lesson player, unlocking, summary test, placement, free practice, recommendation (guest/localStorage only).
✔ A new user can finish unit 1 end-to-end; locked lessons are not reachable; placement marks lessons completed and stops at first fail.

**M4 – Accounts**: Supabase project + schema + RLS, Google login, guest migration dialog, sync, export, delete, reset.
✔ RLS prevents reading another user's rows (test); guest progress migrates; export files contain all user data; delete removes everything.

**M5 – Personal area**: overview, skills, active-time tracking, streak, chart, journal, history.
✔ Numbers match stored attempts in tests; day boundary uses Asia/Jerusalem.

**M6 – Design & polish**: 2–3 design directions → owner picks (D-66); apply; landscape prompt; error states; legal/about pages (text drafts marked for legal review).
✔ Lighthouse accessibility ≥ 95 on main screens; keyboard-only run of a full lesson; tested on phone, tablet, desktop.

**M7 – Launch**: Playwright flows, browser matrix check, Vercel + Supabase production, credits.
✔ Main flows pass in Playwright on Chromium/WebKit/Firefox; production URL works with Google login.

## 15. Open items
- Penalized score vs threshold (see §6).
- Learning preferences beyond explanation length / key labels (spec פ-01).
- Domain vs free subdomain (פ-17). Name availability check for "PianoPop" (פ-16א).
- Legal review: accessibility law applicability, privacy (Amendment 13), minors, music copyright (פ-12).
- Design direction choice (פ-18).
