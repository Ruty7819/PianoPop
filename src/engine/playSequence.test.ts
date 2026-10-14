import { describe, expect, it } from 'vitest';
import {
  playSequenceAnswer,
  playSequenceScore,
  playSequenceStart,
  type PlaySequenceState,
} from './playSequence';

const N = [60, 62, 64, 65, 67];

function play(presses: number[], show: 'names' | 'staff' = 'staff') {
  let s: PlaySequenceState = playSequenceStart();
  for (const m of presses) s = playSequenceAnswer(s, N, m, show).state;
  return s;
}

describe('playSequenceAnswer — staff (exact pitch)', () => {
  it('advances on the exact note only', () => {
    expect(playSequenceAnswer(playSequenceStart(), N, 72, 'staff').correct).toBe(false);
    const r = playSequenceAnswer(playSequenceStart(), N, 60, 'staff');
    expect(r.correct).toBe(true);
    expect(r.state.index).toBe(1);
  });

  it('waits on a wrong note and scores only the first try', () => {
    const s = play([61, 60, 62, 64, 65, 67]);
    expect(s.results).toEqual([false, true, true, true, true]);
  });
});

describe('playSequenceAnswer — names (octave shift fixed by the first note)', () => {
  it('accepts any octave for the first note, then keeps that shift', () => {
    let r = playSequenceAnswer(playSequenceStart(), N, 72, 'names');
    expect(r.correct).toBe(true);
    expect(r.state.shift).toBe(12);
    r = playSequenceAnswer(r.state, N, 62, 'names');
    expect(r.correct).toBe(false);
    r = playSequenceAnswer(r.state, N, 74, 'names');
    expect(r.correct).toBe(true);
  });

  it('fixes the shift only on a correct first note', () => {
    const r = playSequenceAnswer(playSequenceStart(), N, 61, 'names');
    expect(r.state.shift).toBeNull();
  });
});

describe('playSequenceScore (≥ 80% of notes)', () => {
  it('passes with 4 of 5 first tries', () => {
    expect(playSequenceScore(play([61, 60, 62, 64, 65, 67]), 0)).toEqual({
      rawScore: 80,
      score: 80,
      passed: true,
    });
  });

  it('fails with 3 of 5', () => {
    expect(playSequenceScore(play([61, 60, 63, 62, 64, 65, 67]), 0).passed).toBe(false);
  });
});

it('ignores presses after the sequence is done', () => {
  const done = play(N);
  expect(playSequenceAnswer(done, N, 60, 'staff').state).toBe(done);
});
