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
export interface PlaySequenceDef extends ExerciseBase {
  type: 'play-sequence';
  notes: Midi[];
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
