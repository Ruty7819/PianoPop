---
name: add-lesson
description: Turn an approved lesson outline (docs/content/uN-outline.md) into a typed lesson file under src/content/units/, wire it into the unit, and run the content validation test. Use when asked to add, write or build a lesson / unit content.
---

# add-lesson

Input: a lesson id (e.g. `u1-l3`) whose outline is **approved** in `docs/content/<unit>-outline.md`
(header says `Status: approved`). If the outline is not approved, stop and ask the owner (D-55).

## Read only
1. The lesson's section in the outline (Grep for `## u1-l3`), plus the unit's summary/placement section when building `index.ts`.
2. `src/content/index.ts` (public types). Do not open other lessons unless the outline references them.

## Files
```
src/content/units/u1/l3.ts      one lesson per file, exports `lesson`
src/content/units/u1/index.ts   exports `u1: Unit` (title, lessons in order, summaryTest, placement)
src/content/index.ts            `course = [u1, …]`
```

Lesson file template:
```ts
import type { Lesson } from '../..';
import { toMidi as n } from '../../../engine/notes';

export const lesson: Lesson = {
  id: 'u1-l3',
  title: 'דו, רה, מי',
  steps: [
    { kind: 'explanation', text: '…' },
    { kind: 'demo', text: '…', notes: ['C4', 'D4', 'E4'].map(n) },
    {
      kind: 'exercise',
      exercise: { id: 'u1-l3-e1', type: 'press-key', skill: 'keyboard', questions: ['C4', 'D4'].map(n) },
    },
  ],
};
```

## Rules
- Ids are permanent: `uN`, `uN-lM`, `uN-lM-eK`, summary `uN-sK`, placement `uN-pK`. Never rename or reuse an id; append new numbers.
- Write notes as names via `toMidi` (`'C4'` = middle C = 60), never raw numbers.
- Content text (titles, explanations, demo text) is Hebrew data in the lesson file, not in `he.ts`. Plural addressing ("לחצו", "נגנו"), warm tone (D-67, D-77), short sentences. Note names: דו רה מי פה סול לה סי.
- Every lesson has at least one exercise; completion = all exercises passed (D-58). Explanations are skippable, so never put a needed instruction only there — the exercise UI must still make sense.
- Exercise sets: `press-key` / `read-note` / `higher-lower` 10 questions; placement items 5. `read-note` uses the exact octave; keep notes inside C3–C6 so they fit the phone's 2 visible octaves.
- `tap-rhythm`: `pattern` = beat offsets (quarter = 1), `bpm` 60–100 in unit 1.
- Melodies: public-domain / folk only; name the source in a code comment.
- Keep files < 150 lines; split long lessons' data into helpers in the same folder.

## Finish
1. `npx vitest run src/content/validate.test.ts` → must be green (it validates the real `course`).
2. Fix any error it lists; don't weaken the validator.
3. Report: lesson id, steps count, exercises (id · type · skill).
