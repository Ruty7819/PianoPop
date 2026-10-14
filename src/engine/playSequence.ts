import type { SequenceDisplay } from '../content/types';
import type { Midi } from './notes';
import { questionSetStart, type QuestionSetState } from './questionSet';
import { scoreAttempt, type ScoreResult } from './scoring';

export interface PlaySequenceState extends QuestionSetState {
  /** Octave shift (semitones) fixed by the first note when names are shown. */
  shift: number | null;
}

export function playSequenceStart(): PlaySequenceState {
  return { ...questionSetStart(), shift: null };
}

export function playSequenceDone(state: PlaySequenceState, notes: readonly Midi[]): boolean {
  return state.index >= notes.length;
}

/**
 * Staff → exact pitch; names → any octave, but the first note fixes the
 * octave shift for the rest. Only the first press of each note is scored and
 * a wrong press waits on that note (approved 14.10.2026).
 */
export function playSequenceAnswer(
  state: PlaySequenceState,
  notes: readonly Midi[],
  pressed: Midi,
  show: SequenceDisplay,
): { state: PlaySequenceState; correct: boolean } {
  const target = notes[state.index];
  if (target === undefined) return { state, correct: false };
  const diff = pressed - target;
  const correct =
    show === 'staff' ? diff === 0 : state.shift === null ? diff % 12 === 0 : diff === state.shift;
  if (!correct) return { state: { ...state, missed: true }, correct };
  return {
    state: {
      index: state.index + 1,
      results: [...state.results, !state.missed],
      missed: false,
      shift: state.shift ?? diff,
    },
    correct,
  };
}

/** ≥ 80% of notes right on the first try (D-81). */
export function playSequenceScore(state: PlaySequenceState, hintsUsed: number): ScoreResult {
  const correct = state.results.filter(Boolean).length;
  return scoreAttempt('play-sequence', correct, state.results.length, hintsUsed);
}
