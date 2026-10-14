import { describe, expect, it } from 'vitest';
import { attempt, fixtureCourse } from '../test/courseFixture';
import { allMastery, masteryLevel, skillMastery } from './mastery';

describe('skillMastery (D-59)', () => {
  it('is null before any attempt in the skill', () => {
    expect(skillMastery(fixtureCourse, [attempt('u1-l2-e1', 90)], 'keyboard')).toBeNull();
  });
  it('averages the last 3 attempts across the skill exercises', () => {
    const attempts = [
      attempt('u1-l1-e1', 0),
      attempt('u1-l1-e2', 60),
      attempt('u1-l2-e1', 100), // reading, ignored
      attempt('u1-l1-e1', 90),
      attempt('u1-p1', 90),
    ];
    expect(skillMastery(fixtureCourse, attempts, 'keyboard')).toBe(80);
  });
  it('covers every skill', () => {
    const m = allMastery(fixtureCourse, [attempt('u1-l3-e1', 50)]);
    expect(m).toEqual({ keyboard: null, reading: null, ear: null, rhythm: 50, playing: null });
  });
});

describe('masteryLevel (D-81)', () => {
  it('maps percent bands to levels', () => {
    expect(masteryLevel(0)).toBe('beginner');
    expect(masteryLevel(59.9)).toBe('beginner');
    expect(masteryLevel(60)).toBe('advancing');
    expect(masteryLevel(84)).toBe('advancing');
    expect(masteryLevel(85)).toBe('good');
    expect(masteryLevel(100)).toBe('good');
  });
});
