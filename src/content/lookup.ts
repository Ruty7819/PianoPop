import type { Course, ExerciseDef, Lesson, Unit } from './types';

/** Exercises of a lesson in step order (exercise + summary-exercise steps). */
export function lessonExercises(lesson: Lesson): ExerciseDef[] {
  return lesson.steps.flatMap((s) =>
    s.kind === 'exercise' || s.kind === 'summary-exercise' ? [s.exercise] : [],
  );
}

/** All lessons of the course in learning order. */
export function allLessons(course: Course): Lesson[] {
  return course.flatMap((u) => u.lessons);
}

export function getLesson(course: Course, id: string): Lesson | undefined {
  return allLessons(course).find((l) => l.id === id);
}

export function unitOfLesson(course: Course, lessonId: string): Unit | undefined {
  return course.find((u) => u.lessons.some((l) => l.id === lessonId));
}

/** Every exercise in the course: lessons, summary tests and placement. */
export function allExercises(course: Course): ExerciseDef[] {
  return course.flatMap((u) => [
    ...u.lessons.flatMap(lessonExercises),
    ...u.summaryTest,
    ...u.placement.map((p) => p.exercise),
  ]);
}

export function getExercise(course: Course, id: string): ExerciseDef | undefined {
  return allExercises(course).find((e) => e.id === id);
}
