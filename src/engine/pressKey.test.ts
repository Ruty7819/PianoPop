import { describe, expect, it } from 'vitest';
import { isPressKeyMatch, pressKeyStart, pressKeyAnswer, pressKeyScore } from './pressKey';

const Q = [60, 62, 64, 65, 67, 69, 71, 72, 61, 66];

function play(presses: number[]) {
  let s = pressKeyStart();
  for (const m of presses) s = pressKeyAnswer(s, Q, m).state;
  return s;
}

describe('isPressKeyMatch', () => {
  it('accepts the named note in any octave', () => {
    expect(isPressKeyMatch(60, 48)).toBe(true);
    expect(isPressKeyMatch(60, 84)).toBe(true);
    expect(isPressKeyMatch(60, 61)).toBe(false);
  });
});

describe('pressKeyAnswer', () => {
  it('advances on a correct press', () => {
    const r = pressKeyAnswer(pressKeyStart(), Q, 72);
    expect(r.correct).toBe(true);
    expect(r.state).toEqual({ index: 1, results: [true], missed: false });
  });

  it('stays on the question after a wrong press and scores it as wrong', () => {
    let r = pressKeyAnswer(pressKeyStart(), Q, 62);
    expect(r.correct).toBe(false);
    expect(r.state.index).toBe(0);
    r = pressKeyAnswer(r.state, Q, 62);
    expect(r.state.index).toBe(0);
    r = pressKeyAnswer(r.state, Q, 60);
    expect(r.correct).toBe(true);
    expect(r.state).toEqual({ index: 1, results: [false], missed: false });
  });

  it('ignores presses after the set is done', () => {
    const done = play(Q);
    expect(pressKeyAnswer(done, Q, 60).state).toBe(done);
  });
});

describe('pressKeyScore (set of 10, ≥ 80%)', () => {
  it('passes with 8 of 10 first tries', () => {
    const s = play([61, 60, 63, 62, ...Q.slice(2)]);
    expect(s.index).toBe(10);
    expect(pressKeyScore(s, 0)).toEqual({ rawScore: 80, score: 80, passed: true });
  });

  it('fails with 7 of 10', () => {
    const s = play([61, 60, 63, 62, 63, 64, ...Q.slice(3)]);
    expect(pressKeyScore(s, 0)).toEqual({ rawScore: 70, score: 70, passed: false });
  });

  it('applies the hint penalty', () => {
    expect(pressKeyScore(play(Q), 2)).toEqual({ rawScore: 100, score: 80, passed: true });
  });
});
