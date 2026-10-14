import type { Midi } from './notes';
import {
  questionSetAnswer,
  questionSetDone,
  questionSetScore,
  questionSetStart,
  type QuestionSetState,
} from './questionSet';
import type { ScoreResult } from './scoring';

export type PressKeyState = QuestionSetState;

/** Any octave of the named note counts (approved 14.10.2026). */
export function isPressKeyMatch(target: Midi, pressed: Midi): boolean {
  return (((pressed - target) % 12) + 12) % 12 === 0;
}

export const pressKeyStart = questionSetStart;
export const pressKeyDone = questionSetDone;

export function pressKeyAnswer(
  state: PressKeyState,
  questions: readonly Midi[],
  pressed: Midi,
): { state: PressKeyState; correct: boolean } {
  return questionSetAnswer(state, questions, pressed, isPressKeyMatch);
}

export function pressKeyScore(state: PressKeyState, hintsUsed: number): ScoreResult {
  return questionSetScore('press-key', state, hintsUsed);
}
