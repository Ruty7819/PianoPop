import type { ExerciseType } from '../content/types';
import type { Midi } from './notes';
import { scoreAttempt, type ScoreResult } from './scoring';

/** A set of single-key questions answered on the piano (press-key, read-note). */
export interface QuestionSetState {
  /** Current question; equals the question count when done. */
  index: number;
  /** First-try result per finished question. */
  results: boolean[];
  /** A wrong press happened on the current question. */
  missed: boolean;
}

export type KeyMatch = (target: Midi, pressed: Midi) => boolean;

export function questionSetStart(): QuestionSetState {
  return { index: 0, results: [], missed: false };
}

export function questionSetDone(state: QuestionSetState, questions: readonly Midi[]): boolean {
  return state.index >= questions.length;
}

/**
 * Only the first press of a question is scored; after a wrong press the
 * question stays until the right key is pressed (approved 14.10.2026).
 */
export function questionSetAnswer(
  state: QuestionSetState,
  questions: readonly Midi[],
  pressed: Midi,
  match: KeyMatch,
): { state: QuestionSetState; correct: boolean } {
  const target = questions[state.index];
  if (target === undefined) return { state, correct: false };
  if (!match(target, pressed)) {
    return { state: { ...state, missed: true }, correct: false };
  }
  return {
    state: { index: state.index + 1, results: [...state.results, !state.missed], missed: false },
    correct: true,
  };
}

/** A demo shown before answering scores the current question as wrong (approved 14.10.2026). */
export function questionSetReveal<S extends QuestionSetState>(state: S): S {
  return state.missed ? state : { ...state, missed: true };
}

export function questionSetScore(
  type: ExerciseType,
  state: QuestionSetState,
  hintsUsed: number,
): ScoreResult {
  const correct = state.results.filter(Boolean).length;
  return scoreAttempt(type, correct, state.results.length, hintsUsed);
}
