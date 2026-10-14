import { describe, expect, it } from 'vitest';
import { attempt, fixtureCourse, fixtureU1 } from '../test/courseFixture';
import {
  isLessonComplete,
  isLessonUnlocked,
  latestAttempts,
  nextLesson,
  practiceExercises,
  unitSummary,
} from './progress';

const u1 = fixtureU1;
const l1 = u1.lessons[0]!;

describe('isLessonComplete (D-58)', () => {
  it('needs a pass on every exercise, including the summary exercise', () => {
    expect(isLessonComplete(l1, [attempt('u1-l1-e1', 90)])).toBe(false);
    expect(isLessonComplete(l1, [attempt('u1-l1-e1', 90), attempt('u1-l1-e2', 50)])).toBe(false);
    expect(isLessonComplete(l1, [attempt('u1-l1-e1', 90), attempt('u1-l1-e2', 85)])).toBe(true);
  });
  it('keeps an earlier pass even after a later fail', () => {
    const attempts = [attempt('u1-l1-e1', 90), attempt('u1-l1-e2', 85), attempt('u1-l1-e2', 10)];
    expect(isLessonComplete(l1, attempts)).toBe(true);
  });
});

describe('isLessonUnlocked (D-9)', () => {
  it('opens the first lesson and each one after a completed lesson, across units', () => {
    const done = new Set(['u1-l1', 'u1-l2', 'u1-l3']);
    expect(isLessonUnlocked(fixtureCourse, 'u1-l1', new Set())).toBe(true);
    expect(isLessonUnlocked(fixtureCourse, 'u1-l2', new Set())).toBe(false);
    expect(isLessonUnlocked(fixtureCourse, 'u2-l1', done)).toBe(true);
    expect(isLessonUnlocked(fixtureCourse, 'nope', done)).toBe(false);
  });
});

describe('nextLesson / practiceExercises (D-48)', () => {
  it('finds the first incomplete lesson', () => {
    expect(nextLesson(fixtureCourse, new Set(['u1-l1']))?.id).toBe('u1-l2');
    const all = new Set(['u1-l1', 'u1-l2', 'u1-l3', 'u2-l1']);
    expect(nextLesson(fixtureCourse, all)).toBeUndefined();
  });
  it('offers practice only from completed lessons', () => {
    const ids = practiceExercises(fixtureCourse, new Set(['u1-l2'])).map((e) => e.id);
    expect(ids).toEqual(['u1-l2-e1', 'u1-l2-e2']);
  });
});

describe('latestAttempts', () => {
  it('keeps the most recent attempt per exercise', () => {
    const latest = latestAttempts([attempt('a', 10), attempt('b', 20), attempt('a', 30)]);
    expect(latest.get('a')?.score).toBe(30);
    expect(latest.get('b')?.score).toBe(20);
  });
});

describe('unitSummary (D-61)', () => {
  it('has no score until every summary exercise is attempted', () => {
    expect(unitSummary(u1, [])).toEqual({ attempted: 0, total: 1, score: null });
  });
  it('averages the latest scores', () => {
    const r = unitSummary(u1, [attempt('u1-s1', 40), attempt('u1-s1', 70)]);
    expect(r).toEqual({ attempted: 1, total: 1, score: 70 });
  });
});
