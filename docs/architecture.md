# PianoPop – Architecture

Companion to `requirements.md` (what) — this file is the how. Read the section you need.
Choices marked **[ARCH]** are engineering decisions proposed here; changing one = update this file first.

## 1. Layers
Dependencies point downward only. Lower layers never import from higher ones.

```
ui/        React screens + components (thin; no business rules)
  ↓
state/     Zustand stores: session, progress, settings, audio-ready
  ↓
engine/    Pure TS: scoring, mastery, unlocking, placement, recommendation, rhythm judging
services/  Side effects behind interfaces: audio, input, storage, auth, clock
content/   Typed course data (units/lessons/steps/exercises)
i18n/      he.ts — every UI string
```
- `engine/` has zero React/DOM/Tone imports → fully unit-testable.
- `services/` expose interfaces; UI and stores get implementations via a tiny provider (`services/index.ts`) so tests can inject fakes.

## 2. Folder structure
```
src/
  main.tsx, App.tsx, routes.tsx
  i18n/he.ts
  content/
    types.ts            Unit, Lesson, Step, ExerciseDef, Skill, NoteName
    units/u1/index.ts   unit 1 meta + lesson list
    units/u1/l1.ts      one file per lesson (cheap to read/edit)
    index.ts            course = [u1, ...]; lookup helpers (getLesson, getExercise)
    validate.test.ts    content integrity test
  engine/
    notes.ts            MIDI number <-> note name (solfège/letters), staff position
    scoring.ts          per-type raw score, hint penalty, pass
    mastery.ts          skill % from last-3 attempts, level
    progress.ts         lesson unlock/complete, unit summary
    placement.ts        placement test sequence + result → completed lessons
    recommend.ts        next recommended lesson/exercise
    rhythm.ts           tap judging with latency offset
    time.ts             active-time accumulator, Asia/Jerusalem day key, streak
    *.test.ts
  services/
    audio/   AudioService (Tone.js impl): start(), playNote(), playSequence(), click(), now()
    input/   PianoInput: unifies pointer, touch, keyboard(KeyboardEvent.code) → NoteEvent
    storage/ ProgressRepository interface; LocalRepository (localStorage), SupabaseRepository
    auth/    AuthService (Supabase Google OAuth)
    supabase.ts  client (env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
  state/
    settingsStore.ts, progressStore.ts, lessonSessionStore.ts, audioStore.ts
  ui/
    components/  Piano/, Staff/, FeedbackBanner/, HintMenu/, Button/, Dialog/, RotatePrompt/
    exercises/   PressKey.tsx, PlaySequence.tsx, ReadNote.tsx, HigherLower.tsx, TapRhythm.tsx
    screens/     Home, Start, Placement, Course, LessonPlayer, LessonDone, Practice, Me, Settings, Login, Account, static/
    hooks/       useActiveTime, useDeviceOctaves, useOrientation
supabase/
  migrations/    SQL: tables + RLS
  functions/delete-account/
tests/e2e/       Playwright
public/samples/  piano samples (compressed)
```

## 3. Key types (contract between layers)
```ts
type Skill = 'keyboard' | 'reading' | 'ear' | 'rhythm' | 'playing';
type Midi = number;                         // 60 = middle C (דו)
interface NoteEvent { midi: Midi; on: boolean; t: number }   // t = audio clock seconds
type ExerciseDef =
  | { id; type: 'press-key'; skill; questions: Midi[] }
  | { id; type: 'play-sequence'; skill; notes: Midi[] }
  | { id; type: 'read-note'; skill; questions: Midi[]; clef: 'treble' }
  | { id; type: 'higher-lower'; skill; pairs: [Midi, Midi][] }
  | { id; type: 'tap-rhythm'; skill; bpm: number; pattern: number[] /* beat offsets */ };
interface AttemptResult { exerciseId; rawScore: number; hintsUsed: number; score: number; passed: boolean; details: unknown; startedAt; finishedAt }
interface ProgressRepository {
  load(): Promise<ProgressSnapshot>;           // completed lessons, attempts, activity, settings
  saveAttempt(a: AttemptResult): Promise<void>;
  completeLesson(id: string, source: 'normal'|'placement'): Promise<void>;
  addActiveSeconds(day: string, s: number): Promise<void>;
  saveSettings(s: Settings): Promise<void>;
  exportAll(): Promise<ExportBundle>;
  reset(): Promise<void>;
}
```
Thresholds and penalties live in one place: `engine/scoring.ts` constants (from requirements §6).

## 4. Exercise flow
```
LessonPlayer → picks step → renders <ExerciseX def onDone>
ExerciseX: subscribes to PianoInput → collects answers → engine.scoring.score(def, answers, hints)
        → shows feedback (Piano highlight + FeedbackBanner + AudioService sound)
        → onDone(AttemptResult)
progressStore.recordAttempt(result) → repository.saveAttempt → engine.progress decides lesson completion
```
Exercise components hold only transient UI state; nothing in them decides pass/fail.

## 5. Audio & timing **[ARCH]**
- One `AudioService` singleton wrapping Tone.js; `start()` is called from the "התחילו" click.
- Samples: subset of Salamander (every 3rd note, Tone.Sampler pitch-shifts the rest), mp3 + ogg, lazy-loaded after start; show a loading state.
- Single clock: `AudioService.now()` (Tone context time). `PianoInput` stamps events with it at the moment of the DOM event.
- Rhythm judge compares `tap.t − latencyOffset` to scheduled beat times; pure function in `engine/rhythm.ts`.

## 6. Persistence **[ARCH]**
- `progressStore` talks only to `ProgressRepository`. Guest → `LocalRepository`; logged in → `SupabaseRepository`.
- Login migration: `engine`-free helper `services/storage/migrate.ts` compares snapshots and triggers the keep/replace dialog (requirements §10).
- Writes are optimistic; Supabase failures queue in localStorage and retry on reconnect.
- Supabase schema in `supabase/migrations/` (requirements §10); RLS on every table; delete-account via Edge Function using the service role.

## 7. State **[ARCH]**
Zustand (small, no boilerplate). Stores are thin: they call engine functions and repositories. Server data is loaded once per session into `progressStore`; no React Query needed at this size.

## 8. Routing & layout
React Router, routes per requirements §12, lazy-loaded screens. `AppShell` = header (logo, personal-area link) + main. Exercise screens use a focused layout (no header nav) to keep the UI calm.

## 9. Styling
Tailwind v4: design tokens in `src/index.css` `@theme` (filled in plan task D.2). RTL by default; `dir="ltr"` wrapper inside `Piano` and `Staff`. Respect `prefers-reduced-motion`.

## 10. Testing
- Unit (Vitest): all of `engine/`, content validation, repositories with fakes.
- Component (RTL): exercises with a fake `PianoInput` and fake `AudioService`.
- E2E (Playwright): first visit → placement → lesson 1 complete; guest → login migration (mocked auth); export/delete.

## 11. Environments & deploy
- `.env.example` lists `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Real values only in `.env.local` (git-ignored) and Vercel env settings.
- Vercel builds from `main`. Supabase: one project (free tier) until launch.
- GitHub Actions **[ARCH]**: on push/PR run `npm ci`, lint, typecheck, test, build.
