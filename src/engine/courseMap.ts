import type { Course, Lesson, Unit } from '../content/types';
import { allLessons } from '../content/lookup';
import { isLessonUnlocked, nextLesson } from './progress';

export type LessonStatus = 'done' | 'current' | 'locked';
export type UnitDisplay = 'current' | 'next' | 'collapsed';

export interface MapUnit {
  unit: Unit;
  display: UnitDisplay;
  lessons: { lesson: Lesson; status: LessonStatus }[];
  summaryOpen: boolean;
}

/** Summary test opens once every lesson of the unit is done (approved 15.10.2026). */
export function isSummaryOpen(unit: Unit, completed: ReadonlySet<string>): boolean {
  return unit.summaryTest.length > 0 && unit.lessons.every((l) => completed.has(l.id));
}

/** Completed lessons stay open for replay (approved 15.10.2026); others need the unlock (D-9). */
export function canOpenLesson(
  course: Course,
  lessonId: string,
  completed: ReadonlySet<string>,
): boolean {
  return completed.has(lessonId) || isLessonUnlocked(course, lessonId, completed);
}

/** Course map: current + next unit shown, the rest collapsed (D-79). */
export function courseMap(course: Course, completed: ReadonlySet<string>): MapUnit[] {
  const next = nextLesson(course, completed);
  const found = next ? course.findIndex((u) => u.lessons.includes(next)) : -1;
  const current = found >= 0 ? found : course.length - 1;
  return course.map((unit, i) => ({
    unit,
    display: i === current ? 'current' : i === current + 1 ? 'next' : 'collapsed',
    lessons: unit.lessons.map((lesson) => ({
      lesson,
      status: completed.has(lesson.id)
        ? 'done'
        : isLessonUnlocked(course, lesson.id, completed)
          ? 'current'
          : 'locked',
    })),
    summaryOpen: isSummaryOpen(unit, completed),
  }));
}

export type DoneNext =
  { kind: 'lesson'; id: string } | { kind: 'summary'; id: string } | { kind: 'course' };

/** Primary action after finishing a lesson (approved 15.10.2026). */
export function lessonDoneNext(course: Course, lessonId: string): DoneNext {
  const unit = course.find((u) => u.lessons.some((l) => l.id === lessonId));
  if (unit && unit.lessons.at(-1)?.id === lessonId && unit.summaryTest.length > 0) {
    return { kind: 'summary', id: unit.id };
  }
  const lessons = allLessons(course);
  const after = lessons[lessons.findIndex((l) => l.id === lessonId) + 1];
  return after ? { kind: 'lesson', id: after.id } : { kind: 'course' };
}
