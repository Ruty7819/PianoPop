import { describe, expect, it } from 'vitest';
import { fixtureCourse } from '../test/courseFixture';
import { canOpenLesson, courseMap, isSummaryOpen, lessonDoneNext } from './courseMap';

const done = (...ids: string[]) => new Set(ids);
const statuses = (c: ReadonlySet<string>) =>
  courseMap(fixtureCourse, c).map((u) => u.lessons.map((l) => l.status));

describe('courseMap (D-79)', () => {
  it('marks done, current and locked lessons', () => {
    expect(statuses(done('u1-l1'))).toEqual([['done', 'current', 'locked'], ['locked']]);
  });
  it('shows the current and next unit, collapses the rest', () => {
    expect(courseMap(fixtureCourse, done()).map((u) => u.display)).toEqual(['current', 'next']);
    const all = done('u1-l1', 'u1-l2', 'u1-l3');
    expect(courseMap(fixtureCourse, all).map((u) => u.display)).toEqual(['collapsed', 'current']);
  });
  it('keeps the last unit current when everything is done', () => {
    const all = done('u1-l1', 'u1-l2', 'u1-l3', 'u2-l1');
    expect(courseMap(fixtureCourse, all).map((u) => u.display)).toEqual(['collapsed', 'current']);
  });
  it('opens the summary test only when all lessons of the unit are done', () => {
    const u1 = fixtureCourse[0]!;
    expect(isSummaryOpen(u1, done('u1-l1', 'u1-l2'))).toBe(false);
    expect(isSummaryOpen(u1, done('u1-l1', 'u1-l2', 'u1-l3'))).toBe(true);
    expect(isSummaryOpen(fixtureCourse[1]!, done('u2-l1'))).toBe(false); // no test in u2
  });
});

describe('canOpenLesson', () => {
  it('allows unlocked and completed lessons, blocks locked and unknown ones', () => {
    expect(canOpenLesson(fixtureCourse, 'u1-l1', done())).toBe(true);
    expect(canOpenLesson(fixtureCourse, 'u1-l2', done())).toBe(false);
    expect(canOpenLesson(fixtureCourse, 'u1-l2', done('u1-l2'))).toBe(true);
    expect(canOpenLesson(fixtureCourse, 'nope', done())).toBe(false);
  });
});

describe('lessonDoneNext', () => {
  it('points to the next lesson inside a unit', () => {
    expect(lessonDoneNext(fixtureCourse, 'u1-l1')).toEqual({ kind: 'lesson', id: 'u1-l2' });
  });
  it('offers the summary test after the last lesson of a unit', () => {
    expect(lessonDoneNext(fixtureCourse, 'u1-l3')).toEqual({ kind: 'summary', id: 'u1' });
  });
  it('falls back to the course map at the very end', () => {
    expect(lessonDoneNext(fixtureCourse, 'u2-l1')).toEqual({ kind: 'course' });
  });
});
