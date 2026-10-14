import type { Clef, Midi } from '../engine/notes';

export type Skill = 'keyboard' | 'reading' | 'ear' | 'rhythm' | 'playing';

interface ExerciseBase {
  /** Stable content id; never rename. */
  id: string;
  skill: Skill;
}

export interface PressKeyDef extends ExerciseBase {
  type: 'press-key';
  questions: Midi[];
}
/** How a sequence is shown; sets the octave rule too (approved 14.10.2026). */
export type SequenceDisplay = 'names' | 'staff';

export interface PlaySequenceDef extends ExerciseBase {
  type: 'play-sequence';
  notes: Midi[];
  show: SequenceDisplay;
}
export interface ReadNoteDef extends ExerciseBase {
  type: 'read-note';
  questions: Midi[];
  clef: Clef;
}
export interface HigherLowerDef extends ExerciseBase {
  type: 'higher-lower';
  pairs: [Midi, Midi][];
}
export interface TapRhythmDef extends ExerciseBase {
  type: 'tap-rhythm';
  bpm: number;
  /** Beat offsets. */
  pattern: number[];
}

export type ExerciseDef =
  PressKeyDef | PlaySequenceDef | ReadNoteDef | HigherLowerDef | TapRhythmDef;

export type ExerciseType = ExerciseDef['type'];

/** Skippable text step (requirements §8). Content text is Hebrew data, not UI text. */
export interface ExplanationStep {
  kind: 'explanation';
  text: string;
}
/** Plays and animates notes on the piano. */
export interface DemoStep {
  kind: 'demo';
  text: string;
  notes: Midi[];
}
/** Both kinds must be passed to complete the lesson (D-58). */
export interface ExerciseStep {
  kind: 'exercise' | 'summary-exercise';
  exercise: ExerciseDef;
}
export type Step = ExplanationStep | DemoStep | ExerciseStep;

export interface Lesson {
  /** `u1-l3`; never rename. */
  id: string;
  title: string;
  steps: Step[];
}

/** One placement exercise; passing it completes `completes` (D-82). */
export interface PlacementItem {
  exercise: ExerciseDef;
  completes: string[];
}

export interface Unit {
  /** `u1`; never rename. */
  id: string;
  title: string;
  lessons: Lesson[];
  /** Assessment only, does not gate (D-61). */
  summaryTest: ExerciseDef[];
  /** Increasing difficulty, one item per lesson (D-82). */
  placement: PlacementItem[];
}

export type Course = Unit[];
