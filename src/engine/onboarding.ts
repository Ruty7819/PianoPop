import type { Course, Lesson } from '../content/types';
import { allLessons } from '../content/lookup';

/** First visit → `/start` (requirements §12): never seen it and no progress yet. */
export function needsStart(startSeen: boolean, completedCount: number, attemptCount: number) {
  return !startSeen && completedCount === 0 && attemptCount === 0;
}

/** Lessons open for free practice: completed ones only, in course order (D-48). */
export function practiceLessons(course: Course, completed: ReadonlySet<string>): Lesson[] {
  return allLessons(course).filter((l) => completed.has(l.id));
}

/** 1-based position of a lesson inside its unit, for "שיעור n" labels. */
export function lessonNumber(course: Course, lessonId: string): number {
  for (const u of course) {
    const i = u.lessons.findIndex((l) => l.id === lessonId);
    if (i >= 0) return i + 1;
  }
  return 0;
}
