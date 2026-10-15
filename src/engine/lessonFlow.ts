import type { Step } from '../content/types';

const isExercise = (s: Step) => s.kind === 'exercise' || s.kind === 'summary-exercise';

/** Exercise steps need a pass before moving on (D-58, approved 15.10.2026). */
export function canLeaveStep(step: Step, passed: boolean): boolean {
  return !isExercise(step) || passed;
}

/** Index of the first exercise step at or after `from`; skipping never skips exercises (D-21). */
export function skipToExercise(steps: readonly Step[], from: number): number {
  const i = steps.findIndex((s, j) => j >= from && isExercise(s));
  return i < 0 ? steps.length : i;
}
