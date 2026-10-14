// Public API of src/engine — see docs/architecture.md §2.
export type {
  Midi,
  Letter,
  Accidental,
  AccidentalPreference,
  NoteNaming,
  Clef,
  Spelling,
  LabelOptions,
} from './notes';
export { isBlackKey, spell, toMidi, noteLabel, staffStep, ledgerLines } from './notes';
export type { ScoreResult, AttemptResult } from './scoring';
export {
  PASS_THRESHOLD,
  HINT_PENALTY,
  MAX_PENALIZED_HINTS,
  rawPercent,
  applyHintPenalty,
  isPassed,
  scoreAttempt,
} from './scoring';
export type { PressKeyState } from './pressKey';
export {
  isPressKeyMatch,
  pressKeyStart,
  pressKeyDone,
  pressKeyAnswer,
  pressKeyScore,
} from './pressKey';
export type { QuestionSetState } from './questionSet';
export { questionSetStart, questionSetDone } from './questionSet';
export type { ReadNoteState } from './readNote';
export {
  isReadNoteMatch,
  readNoteStart,
  readNoteDone,
  readNoteAnswer,
  readNoteScore,
  readNotePianoStart,
} from './readNote';
