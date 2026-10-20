import { describe, expect, it } from 'vitest';
import { fixtureCourse } from '../test/courseFixture';
import { lessonNumber, needsStart, practiceLessons } from './onboarding';

describe('needsStart', () => {
  it('only for a visitor who never saw /start and has no progress', () => {
    expect(needsStart(false, 0, 0)).toBe(true);
    expect(needsStart(true, 0, 0)).toBe(false);
    expect(needsStart(false, 1, 0)).toBe(false);
    expect(needsStart(false, 0, 2)).toBe(false);
  });
});

describe('practiceLessons (D-48)', () => {
  it('lists completed lessons only, in course order', () => {
    const done = new Set(['u2-l1', 'u1-l2']);
    expect(practiceLessons(fixtureCourse, done).map((l) => l.id)).toEqual(['u1-l2', 'u2-l1']);
    expect(practiceLessons(fixtureCourse, new Set())).toEqual([]);
  });
});

describe('lessonNumber', () => {
  it('counts within the unit', () => {
    expect(lessonNumber(fixtureCourse, 'u1-l3')).toBe(3);
    expect(lessonNumber(fixtureCourse, 'u2-l1')).toBe(1);
    expect(lessonNumber(fixtureCourse, 'nope')).toBe(0);
  });
});
