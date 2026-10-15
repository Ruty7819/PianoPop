// Public API of src/content — see docs/architecture.md §2.
import type { Course } from './types';
import { u1 } from './units/u1';

export type {
  Skill,
  ExerciseDef,
  ExerciseType,
  PressKeyDef,
  PlaySequenceDef,
  SequenceDisplay,
  ReadNoteDef,
  HigherLowerDef,
  TapRhythmDef,
  Step,
  ExplanationStep,
  DemoStep,
  ExerciseStep,
  Lesson,
  PlacementItem,
  Unit,
  Course,
} from './types';
export {
  lessonExercises,
  allLessons,
  allExercises,
  getLesson,
  getExercise,
  unitOfLesson,
  lessonOfExercise,
} from './lookup';
export { validateCourse } from './validate';

/** The course in learning order. */
export const course: Course = [u1];
