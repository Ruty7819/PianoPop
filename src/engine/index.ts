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
} from './readNote';
export type { PlaySequenceState } from './playSequence';
export {
  playSequenceStart,
  playSequenceDone,
  playSequenceAnswer,
  playSequenceScore,
} from './playSequence';
export type { HigherLowerState, PairChoice } from './higherLower';
export {
  higherLowerStart,
  higherLowerDone,
  higherLowerCorrect,
  higherLowerAnswer,
  higherLowerScore,
} from './higherLower';
export { pianoStartFor } from './pianoRange';
export type { TapTiming, RhythmTimeline, BeatResult, RhythmJudgement } from './rhythm';
export {
  RHYTHM_WINDOW,
  BEATS_PER_BAR,
  CALIBRATION_TAPS,
  LATE_TIP_MS,
  tapTiming,
  rhythmTimeline,
  judgeTaps,
  judgeTap,
  rhythmScore,
  calibrationOffsetMs,
} from './rhythm';
export { questionSetReveal } from './questionSet';
export type { HintType, StaffPlace } from './hints';
export { hintMenuTypes, countsAsHint, staffPlace } from './hints';
export type { CompletionSource, CompletedLesson, UnitSummaryResult } from './progress';
export {
  isLessonComplete,
  isLessonUnlocked,
  nextLesson,
  practiceExercises,
  latestAttempts,
  unitSummary,
} from './progress';
export type { MasteryLevel } from './mastery';
export { SKILLS, MASTERY_WINDOW, skillMastery, allMastery, masteryLevel } from './mastery';
export type { Recommendation } from './recommend';
export { recommend } from './recommend';
export type { PlacementState } from './placement';
export {
  placementItems,
  placementStart,
  placementCurrent,
  placementAnswer,
  placementExit,
} from './placement';
export type { LessonStatus, UnitDisplay, MapUnit, DoneNext } from './courseMap';
export { isSummaryOpen, canOpenLesson, courseMap, lessonDoneNext } from './courseMap';
export { canLeaveStep, skipToExercise } from './lessonFlow';
