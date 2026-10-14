import type { Midi } from './notes';
import { scoreAttempt, type ScoreResult } from './scoring';

export interface PressKeyState {
  /** Current question; equals the question count when done. */
  index: number;
  /** First-try result per finished question. */
  results: boolean[];
  /** A wrong press happened on the current question. */
  missed: boolean;
}

/** Any octave of the named note counts (approved 14.10.2026). */
export function isPressKeyMatch(target: Midi, pressed: Midi): boolean {
  return (((pressed - target) % 12) + 12) % 12 === 0;
}

export function pressKeyStart(): PressKeyState {
  return { index: 0, results: [], missed: false };
}

export function pressKeyDone(state: PressKeyState, questions: readonly Midi[]): boolean {
  return state.index >= questions.length;
}

/**
 * Only the first press of a question is scored; after a wrong press the
 * question stays until the right key is pressed (approved 14.10.2026).
 */
export function pressKeyAnswer(
  state: PressKeyState,
  questions: readonly Midi[],
  pressed: Midi,
): { state: PressKeyState; correct: boolean } {
  const target = questions[state.index];
  if (target === undefined) return { state, correct: false };
  if (!isPressKeyMatch(target, pressed)) {
    return { state: { ...state, missed: true }, correct: false };
  }
  return {
    state: { index: state.index + 1, results: [...state.results, !state.missed], missed: false },
    correct: true,
  };
}

export function pressKeyScore(state: PressKeyState, hintsUsed: number): ScoreResult {
  const correct = state.results.filter(Boolean).length;
  return scoreAttempt('press-key', correct, state.results.length, hintsUsed);
}
