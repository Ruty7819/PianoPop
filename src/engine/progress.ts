import type { Course, ExerciseDef, Lesson, Unit } from '../content/types';
import { allLessons, lessonExercises } from '../content/lookup';
import type { AttemptResult } from './scoring';

export type CompletionSource = 'normal' | 'placement';
export interface CompletedLesson {
  lessonId: string;
  source: CompletionSource;
}

/** Lesson completed = every exercise in it passed at least once (D-58). */
export function isLessonComplete(lesson: Lesson, attempts: readonly AttemptResult[]): boolean {
  const passed = new Set(attempts.filter((a) => a.passed).map((a) => a.exerciseId));
  return lessonExercises(lesson).every((e) => passed.has(e.id));
}

/** A lesson unlocks only when the one before it is completed (D-9). */
export function isLessonUnlocked(
  course: Course,
  lessonId: string,
  completed: ReadonlySet<string>,
): boolean {
  const lessons = allLessons(course);
  const i = lessons.findIndex((l) => l.id === lessonId);
  if (i < 0) return false;
  return i === 0 || completed.has(lessons[i - 1]?.id ?? '');
}

/** First lesson not yet completed, in learning order. */
export function nextLesson(course: Course, completed: ReadonlySet<string>): Lesson | undefined {
  return allLessons(course).find((l) => !completed.has(l.id));
}

/** Exercises open for free practice: completed lessons only (D-48). */
export function practiceExercises(course: Course, completed: ReadonlySet<string>): ExerciseDef[] {
  return allLessons(course)
    .filter((l) => completed.has(l.id))
    .flatMap(lessonExercises);
}

/** Latest attempt per exercise id. */
export function latestAttempts(attempts: readonly AttemptResult[]): Map<string, AttemptResult> {
  const latest = new Map<string, AttemptResult>();
  for (const a of attempts) {
    const prev = latest.get(a.exerciseId);
    if (!prev || a.finishedAt >= prev.finishedAt) latest.set(a.exerciseId, a);
  }
  return latest;
}

export interface UnitSummaryResult {
  attempted: number;
  total: number;
  /** Mean of the latest score per summary exercise; null until all are attempted. */
  score: number | null;
}

/** Unit summary test result; assessment only, never gates (D-61). */
export function unitSummary(unit: Unit, attempts: readonly AttemptResult[]): UnitSummaryResult {
  const latest = latestAttempts(attempts);
  const scores = unit.summaryTest.flatMap((e) => {
    const a = latest.get(e.id);
    return a ? [a.score] : [];
  });
  const total = unit.summaryTest.length;
  const done = total > 0 && scores.length === total;
  return {
    attempted: scores.length,
    total,
    score: done ? scores.reduce((s, x) => s + x, 0) / total : null,
  };
}
