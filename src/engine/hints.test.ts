import { describe, expect, it } from 'vitest';
import { countsAsHint, hintMenuTypes, staffPlace } from './hints';
import { questionSetReveal, questionSetStart } from './questionSet';
import { pressKeyAnswer, pressKeyScore } from './pressKey';

describe('hint menu (D-23)', () => {
  it('offers replay-demo in the menu only for ear exercises', () => {
    expect(hintMenuTypes('ear')).toEqual(['short-hint', 'explanation', 'replay-demo']);
    expect(hintMenuTypes('keyboard')).toEqual(['short-hint', 'explanation']);
  });
  it('counts text hints always and replay only in ear exercises', () => {
    expect(countsAsHint('short-hint', 'keyboard')).toBe(true);
    expect(countsAsHint('explanation', 'reading')).toBe(true);
    expect(countsAsHint('replay-demo', 'ear')).toBe(true);
    expect(countsAsHint('replay-demo', 'keyboard')).toBe(false);
  });
});

describe('questionSetReveal', () => {
  it('marks an unanswered question as missed', () => {
    const s = questionSetReveal(questionSetStart());
    expect(s.missed).toBe(true);
    const r = pressKeyAnswer(s, [60], 60);
    expect(r.state.results).toEqual([false]);
  });
  it('keeps the same state when already missed', () => {
    const s = { index: 0, results: [], missed: true };
    expect(questionSetReveal(s)).toBe(s);
  });
});

describe('hint penalty on a question set (D-60, D-81)', () => {
  it('subtracts 10 per hint from the raw score', () => {
    const state = { index: 10, results: Array<boolean>(10).fill(true), missed: false };
    expect(pressKeyScore(state, 1)).toMatchObject({ rawScore: 100, score: 90, passed: true });
    expect(pressKeyScore(state, 3)).toMatchObject({ score: 70, passed: false });
  });
  it('fails at the edge once the penalty drops it below the threshold', () => {
    const state = { index: 10, results: [...Array<boolean>(9).fill(true), false], missed: false };
    expect(pressKeyScore(state, 1)).toMatchObject({ score: 80, passed: true });
    expect(pressKeyScore(state, 2)).toMatchObject({ score: 70, passed: false });
  });
});

describe('staffPlace', () => {
  it('names lines and spaces from the bottom of the treble staff', () => {
    expect(staffPlace(64)).toEqual({ kind: 'line', n: 1 }); // E4
    expect(staffPlace(65)).toEqual({ kind: 'space', n: 1 }); // F4
    expect(staffPlace(77)).toEqual({ kind: 'line', n: 5 }); // F5
  });
  it('places notes outside the staff below or above', () => {
    expect(staffPlace(60)).toEqual({ kind: 'below' });
    expect(staffPlace(62)).toEqual({ kind: 'below' });
    expect(staffPlace(79)).toEqual({ kind: 'above' });
  });
});
