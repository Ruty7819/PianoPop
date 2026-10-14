import { describe, expect, it } from 'vitest';
import { attempt, fixtureCourse } from '../test/courseFixture';
import { recommend } from './recommend';

const allDone = new Set(['u1-l1', 'u1-l2', 'u1-l3', 'u2-l1']);

describe('recommend (D-75)', () => {
  it('suggests the next incomplete lesson', () => {
    expect(recommend(fixtureCourse, new Set(['u1-l1']), [])).toEqual({
      kind: 'lesson',
      lessonId: 'u1-l2',
    });
  });
  it('when all is done, suggests the lowest-scored exercise of the weakest skill', () => {
    const attempts = [
      attempt('u1-l1-e1', 95),
      attempt('u1-l1-e2', 90),
      attempt('u1-l2-e1', 70), // reading 70, weakest
      attempt('u1-l2-e2', 100),
      attempt('u1-l3-e1', 80),
      attempt('u2-l1-e1', 85),
    ];
    expect(recommend(fixtureCourse, allDone, attempts)).toEqual({
      kind: 'exercise',
      exerciseId: 'u1-l2-e1',
      skill: 'reading',
    });
  });
  it('treats a never-attempted skill as weakest', () => {
    const attempts = [attempt('u1-l1-e1', 95), attempt('u1-l2-e1', 90)];
    expect(recommend(fixtureCourse, allDone, attempts)).toEqual({
      kind: 'exercise',
      exerciseId: 'u1-l2-e2',
      skill: 'ear',
    });
  });
  it('returns null for an empty course', () => {
    expect(recommend([], new Set(), [])).toBeNull();
  });
});
