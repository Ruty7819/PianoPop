import { describe, expect, it } from 'vitest';
import { course } from '.';
import { fixtureCourse, fixtureU1, pressKey } from '../test/courseFixture';
import type { Course } from './types';
import { validateCourse } from './validate';

function withUnit(patch: Partial<Course[number]>): Course {
  return [{ ...fixtureU1, ...patch }];
}

describe('validateCourse (requirements §8)', () => {
  it('accepts the real course', () => {
    expect(validateCourse(course)).toEqual([]);
  });
  it('accepts a well-formed course', () => {
    expect(validateCourse(fixtureCourse)).toEqual([]);
  });
  it('reports duplicate ids', () => {
    const c = withUnit({ summaryTest: [pressKey('u1-s1'), pressKey('u1-s1')] });
    expect(validateCourse(c)).toContain('u1-s1: duplicate id');
  });
  it('requires ids nested under their parent', () => {
    const c = withUnit({ summaryTest: [pressKey('u2-s1')] });
    expect(validateCourse(c)[0]).toMatch(/^u2-s1: bad id/);
  });
  it('rejects unknown skills and notes off the piano', () => {
    const bad = { ...pressKey('u1-s1'), skill: 'singing', questions: [10] } as never;
    const errors = validateCourse(withUnit({ summaryTest: [bad] }));
    expect(errors).toContain('u1-s1: unknown skill singing');
    expect(errors).toContain('u1-s1: note 10 is off the piano');
  });
  it('requires every lesson to have an exercise', () => {
    const lessons = [{ id: 'u1-l1', title: 'x', steps: [] }];
    expect(validateCourse(withUnit({ lessons, placement: [] }))).toContain('u1-l1: no exercises');
  });
  it('requires placement to reference existing lessons', () => {
    const c = withUnit({ placement: [{ exercise: pressKey('u1-p1'), completes: ['u1-l9'] }] });
    expect(validateCourse(c)).toContain('u1-p1: unknown lesson u1-l9');
  });
});
