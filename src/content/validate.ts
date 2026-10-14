import type { Course, ExerciseDef, ExerciseType, Skill } from './types';
import { allExercises, allLessons, lessonExercises } from './lookup';

const SKILLS: readonly Skill[] = ['keyboard', 'reading', 'ear', 'rhythm', 'playing'];
const TYPES: readonly ExerciseType[] = [
  'press-key',
  'play-sequence',
  'read-note',
  'higher-lower',
  'tap-rhythm',
];
/** Full 88-key piano, A0–C8. */
const MIN_MIDI = 21;
const MAX_MIDI = 108;

function exerciseNotes(e: ExerciseDef): number[] {
  switch (e.type) {
    case 'press-key':
    case 'read-note':
      return e.questions;
    case 'play-sequence':
      return e.notes;
    case 'higher-lower':
      return e.pairs.flat();
    case 'tap-rhythm':
      return [];
  }
}

function checkExercise(e: ExerciseDef, idPattern: RegExp): string[] {
  const errors: string[] = [];
  if (!idPattern.test(e.id)) errors.push(`${e.id}: bad id, expected ${idPattern.source}`);
  if (!TYPES.includes(e.type)) errors.push(`${e.id}: unknown type ${String(e.type)}`);
  if (!SKILLS.includes(e.skill)) errors.push(`${e.id}: unknown skill ${String(e.skill)}`);
  const notes = exerciseNotes(e);
  if (e.type !== 'tap-rhythm' && notes.length === 0) errors.push(`${e.id}: no notes`);
  if (e.type === 'tap-rhythm' && (e.pattern.length === 0 || e.bpm <= 0)) {
    errors.push(`${e.id}: empty pattern or bad bpm`);
  }
  for (const n of notes) {
    if (!Number.isInteger(n) || n < MIN_MIDI || n > MAX_MIDI) {
      errors.push(`${e.id}: note ${n} is off the piano`);
    }
  }
  return errors;
}

/** Content integrity errors (requirements §8); empty array = valid. */
export function validateCourse(course: Course): string[] {
  const errors: string[] = [];
  const ids = [
    ...course.map((u) => u.id),
    ...allLessons(course).map((l) => l.id),
    ...allExercises(course).map((e) => e.id),
  ];
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) errors.push(`${id}: duplicate id`);
    seen.add(id);
  }
  const lessonIds = new Set(allLessons(course).map((l) => l.id));

  for (const unit of course) {
    if (!/^u\d+$/.test(unit.id)) errors.push(`${unit.id}: bad unit id`);
    for (const lesson of unit.lessons) {
      if (!new RegExp(`^${unit.id}-l[0-9]+$`).test(lesson.id)) {
        errors.push(`${lesson.id}: bad lesson id`);
      }
      const exercises = lessonExercises(lesson);
      if (exercises.length === 0) errors.push(`${lesson.id}: no exercises`);
      const pattern = new RegExp(`^${lesson.id}-e[0-9]+$`);
      exercises.forEach((e) => errors.push(...checkExercise(e, pattern)));
    }
    const summaryPattern = new RegExp(`^${unit.id}-s[0-9]+$`);
    unit.summaryTest.forEach((e) => errors.push(...checkExercise(e, summaryPattern)));
    const placementPattern = new RegExp(`^${unit.id}-p[0-9]+$`);
    for (const item of unit.placement) {
      errors.push(...checkExercise(item.exercise, placementPattern));
      if (item.completes.length === 0) errors.push(`${item.exercise.id}: completes nothing`);
      for (const id of item.completes) {
        if (!lessonIds.has(id)) errors.push(`${item.exercise.id}: unknown lesson ${id}`);
      }
    }
  }
  return errors;
}
