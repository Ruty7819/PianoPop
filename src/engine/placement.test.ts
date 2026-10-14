import { describe, expect, it } from 'vitest';
import { fixtureCourse } from '../test/courseFixture';
import {
  placementAnswer,
  placementCurrent,
  placementExit,
  placementItems,
  placementStart,
} from './placement';

const items = placementItems(fixtureCourse);

describe('placement (D-82)', () => {
  it('collects placement items of all units in order', () => {
    expect(items.map((i) => i.exercise.id)).toEqual(['u1-p1', 'u1-p2', 'u1-p3']);
  });
  it('completes lessons for each pass and stops at the first fail', () => {
    let s = placementStart(items);
    s = placementAnswer(s, true);
    expect(placementCurrent(s)?.exercise.id).toBe('u1-p2');
    s = placementAnswer(s, false);
    expect(s).toMatchObject({ finished: true, completed: ['u1-l1'] });
    expect(placementCurrent(s)).toBeUndefined();
    expect(placementAnswer(s, true)).toBe(s);
  });
  it('finishes after the last pass', () => {
    const s = [true, true, true].reduce(placementAnswer, placementStart(items));
    expect(s).toMatchObject({ finished: true, completed: ['u1-l1', 'u1-l2', 'u1-l3'] });
  });
  it('can be exited anytime, keeping passes so far', () => {
    const s = placementExit(placementAnswer(placementStart(items), true));
    expect(s).toMatchObject({ finished: true, completed: ['u1-l1'] });
  });
  it('is finished at once when there are no items', () => {
    expect(placementStart([]).finished).toBe(true);
  });
});
