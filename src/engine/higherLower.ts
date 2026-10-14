import type { Midi } from './notes';
import { scoreAttempt, type ScoreResult } from './scoring';

/** 0 = first sound, 1 = second sound. */
export type PairChoice = 0 | 1;

export interface HigherLowerState {
  index: number;
  results: boolean[];
}

export function higherLowerStart(): HigherLowerState {
  return { index: 0, results: [] };
}

export function higherLowerDone(state: HigherLowerState, pairs: readonly unknown[]): boolean {
  return state.index >= pairs.length;
}

export function higherLowerCorrect([a, b]: readonly [Midi, Midi]): PairChoice {
  return b > a ? 1 : 0;
}

/** Every answer moves on — two choices leave nothing to retry (approved 14.10.2026). */
export function higherLowerAnswer(
  state: HigherLowerState,
  pairs: readonly (readonly [Midi, Midi])[],
  choice: PairChoice,
): { state: HigherLowerState; correct: boolean } {
  const pair = pairs[state.index];
  if (!pair) return { state, correct: false };
  const correct = higherLowerCorrect(pair) === choice;
  return { state: { index: state.index + 1, results: [...state.results, correct] }, correct };
}

/** Set of 10, ≥ 90% (D-81). */
export function higherLowerScore(state: HigherLowerState, hintsUsed: number): ScoreResult {
  const correct = state.results.filter(Boolean).length;
  return scoreAttempt('higher-lower', correct, state.results.length, hintsUsed);
}
