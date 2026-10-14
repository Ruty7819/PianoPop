import type { Midi } from './notes';
import {
  questionSetAnswer,
  questionSetDone,
  questionSetScore,
  questionSetStart,
  type QuestionSetState,
} from './questionSet';
import type { ScoreResult } from './scoring';

export type ReadNoteState = QuestionSetState;

/** Only the exact pitch written on the staff counts (approved 14.10.2026). */
export function isReadNoteMatch(target: Midi, pressed: Midi): boolean {
  return target === pressed;
}

export const readNoteStart = questionSetStart;
export const readNoteDone = questionSetDone;

export function readNoteAnswer(
  state: ReadNoteState,
  questions: readonly Midi[],
  pressed: Midi,
): { state: ReadNoteState; correct: boolean } {
  return questionSetAnswer(state, questions, pressed, isReadNoteMatch);
}

export function readNoteScore(state: ReadNoteState, hintsUsed: number): ScoreResult {
  return questionSetScore('read-note', state, hintsUsed);
}

/** Lowest visible C so the staff range sits on the piano (approved 14.10.2026). */
export function readNotePianoStart(questions: readonly Midi[]): Midi {
  return Math.floor(Math.min(...questions) / 12) * 12;
}
