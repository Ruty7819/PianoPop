import { describe, expect, it } from 'vitest';
import {
  higherLowerAnswer,
  higherLowerCorrect,
  higherLowerScore,
  higherLowerStart,
} from './higherLower';

const P: [number, number][] = Array.from({ length: 10 }, (_, i) => (i % 2 ? [60, 67] : [72, 64]));

describe('higherLower', () => {
  it('knows which sound is higher', () => {
    expect(higherLowerCorrect([60, 67])).toBe(1);
    expect(higherLowerCorrect([72, 64])).toBe(0);
  });

  it('moves on after every answer', () => {
    const r = higherLowerAnswer(higherLowerStart(), P, 1);
    expect(r.correct).toBe(false);
    expect(r.state).toEqual({ index: 1, results: [false] });
  });

  it('needs ≥ 90%', () => {
    let s = higherLowerStart();
    for (const p of P) s = higherLowerAnswer(s, P, higherLowerCorrect(p)).state;
    expect(higherLowerScore(s, 0).passed).toBe(true);
    s = higherLowerStart();
    P.forEach((p, i) => {
      s = higherLowerAnswer(
        s,
        P,
        i < 2 ? ((1 - higherLowerCorrect(p)) as 0 | 1) : higherLowerCorrect(p),
      ).state;
    });
    expect(higherLowerScore(s, 0)).toEqual({ rawScore: 80, score: 80, passed: false });
  });

  it('ignores answers after the set is done', () => {
    let s = higherLowerStart();
    for (const p of P) s = higherLowerAnswer(s, P, higherLowerCorrect(p)).state;
    expect(higherLowerAnswer(s, P, 0).state).toBe(s);
  });
});
