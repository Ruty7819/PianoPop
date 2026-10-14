import type { ExerciseType } from '../content/types';

/** Pass thresholds in % per exercise type (D-81). */
export const PASS_THRESHOLD: Readonly<Record<ExerciseType, number>> = {
  'press-key': 80,
  'play-sequence': 80,
  'read-note': 80,
  'higher-lower': 90,
  'tap-rhythm': 75,
};

/** Points removed per hint, and the most hints that count (D-60, D-81). */
export const HINT_PENALTY = 10;
export const MAX_PENALIZED_HINTS = 3;

export interface ScoreResult {
  rawScore: number;
  score: number;
  passed: boolean;
}

export interface AttemptResult extends ScoreResult {
  exerciseId: string;
  hintsUsed: number;
  details: unknown;
  /** ISO timestamps. */
  startedAt: string;
  finishedAt: string;
}

export function rawPercent(correct: number, total: number): number {
  return total > 0 ? (correct / total) * 100 : 0;
}

/** score = max(0, raw% − 10 × min(hints, 3)) — D-60, D-81. */
export function applyHintPenalty(raw: number, hintsUsed: number): number {
  return Math.max(0, raw - HINT_PENALTY * Math.min(hintsUsed, MAX_PENALIZED_HINTS));
}

/** The penalized score is the one compared (approved 14.10.2026). */
export function isPassed(type: ExerciseType, score: number): boolean {
  return score >= PASS_THRESHOLD[type];
}

export function scoreAttempt(
  type: ExerciseType,
  correct: number,
  total: number,
  hintsUsed: number,
): ScoreResult {
  const rawScore = rawPercent(correct, total);
  const score = applyHintPenalty(rawScore, hintsUsed);
  return { rawScore, score, passed: isPassed(type, score) };
}
