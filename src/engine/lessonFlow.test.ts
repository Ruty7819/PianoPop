import { describe, expect, it } from 'vitest';
import type { Step } from '../content/types';
import { pressKey } from '../test/courseFixture';
import { canLeaveStep, skipToExercise } from './lessonFlow';

const steps: Step[] = [
  { kind: 'explanation', text: 'א' },
  { kind: 'demo', text: 'ב', notes: [60] },
  { kind: 'exercise', exercise: pressKey('e1') },
  { kind: 'explanation', text: 'ג' },
  { kind: 'summary-exercise', exercise: pressKey('e2') },
];

describe('canLeaveStep', () => {
  it('lets explanation and demo steps go freely (D-21)', () => {
    expect(canLeaveStep(steps[0]!, false)).toBe(true);
    expect(canLeaveStep(steps[1]!, false)).toBe(true);
  });
  it('needs a pass on exercise steps (approved 15.10.2026)', () => {
    expect(canLeaveStep(steps[2]!, false)).toBe(false);
    expect(canLeaveStep(steps[2]!, true)).toBe(true);
    expect(canLeaveStep(steps[4]!, false)).toBe(false);
  });
});

describe('skipToExercise', () => {
  it('jumps to the next exercise step, never past it (D-21)', () => {
    expect(skipToExercise(steps, 0)).toBe(2);
    expect(skipToExercise(steps, 3)).toBe(4);
  });
  it('returns the step count when no exercise follows', () => {
    expect(skipToExercise([{ kind: 'explanation', text: 'א' }], 0)).toBe(1);
  });
});
