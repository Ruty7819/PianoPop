import { describe, expect, it } from 'vitest';
import { isReadNoteMatch, readNoteAnswer, readNoteScore, readNoteStart } from './readNote';

const Q = [64, 67, 71, 74, 77, 65, 69, 72, 76, 60];

function play(presses: number[]) {
  let s = readNoteStart();
  for (const m of presses) s = readNoteAnswer(s, Q, m).state;
  return s;
}

describe('isReadNoteMatch', () => {
  it('accepts only the exact pitch on the staff', () => {
    expect(isReadNoteMatch(64, 64)).toBe(true);
    expect(isReadNoteMatch(64, 76)).toBe(false);
    expect(isReadNoteMatch(64, 52)).toBe(false);
  });
});

describe('readNoteAnswer', () => {
  it('keeps the question after a wrong octave and scores it as wrong', () => {
    let r = readNoteAnswer(readNoteStart(), Q, 76);
    expect(r.correct).toBe(false);
    expect(r.state).toEqual({ index: 0, results: [], missed: true });
    r = readNoteAnswer(r.state, Q, 64);
    expect(r.state).toEqual({ index: 1, results: [false], missed: false });
  });
});

describe('readNoteScore (set of 10, ≥ 80%)', () => {
  it('passes with 8 of 10 first tries', () => {
    const s = play([52, 64, 55, 67, ...Q.slice(2)]);
    expect(readNoteScore(s, 0)).toEqual({ rawScore: 80, score: 80, passed: true });
  });

  it('fails with 7 of 10', () => {
    const s = play([52, 64, 55, 67, 59, 71, ...Q.slice(3)]);
    expect(readNoteScore(s, 0)).toEqual({ rawScore: 70, score: 70, passed: false });
  });
});
