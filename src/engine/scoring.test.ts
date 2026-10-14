import { describe, expect, it } from 'vitest';
import { applyHintPenalty, isPassed, PASS_THRESHOLD, rawPercent, scoreAttempt } from './scoring';

describe('rawPercent', () => {
  it('is correct/total as a percentage', () => {
    expect(rawPercent(8, 10)).toBe(80);
    expect(rawPercent(0, 10)).toBe(0);
    expect(rawPercent(10, 10)).toBe(100);
  });
  it('is 0 for an empty set', () => {
    expect(rawPercent(0, 0)).toBe(0);
  });
});

describe('applyHintPenalty (D-60, D-81)', () => {
  it('subtracts 10 per hint', () => {
    expect(applyHintPenalty(100, 0)).toBe(100);
    expect(applyHintPenalty(100, 1)).toBe(90);
    expect(applyHintPenalty(100, 3)).toBe(70);
  });
  it('caps the penalty at 3 hints', () => {
    expect(applyHintPenalty(100, 5)).toBe(70);
  });
  it('never goes below 0', () => {
    expect(applyHintPenalty(20, 3)).toBe(0);
  });
});

describe('isPassed', () => {
  it('uses the per-type thresholds', () => {
    expect(PASS_THRESHOLD).toEqual({
      'press-key': 80,
      'play-sequence': 80,
      'read-note': 80,
      'higher-lower': 90,
      'tap-rhythm': 75,
    });
  });
  it('passes at the threshold, fails just below', () => {
    expect(isPassed('press-key', 80)).toBe(true);
    expect(isPassed('press-key', 79.9)).toBe(false);
    expect(isPassed('higher-lower', 90)).toBe(true);
    expect(isPassed('higher-lower', 80)).toBe(false);
    expect(isPassed('tap-rhythm', 75)).toBe(true);
  });
});

describe('scoreAttempt', () => {
  it('compares the penalized score, not the raw one', () => {
    expect(scoreAttempt('press-key', 9, 10, 1)).toEqual({ rawScore: 90, score: 80, passed: true });
    expect(scoreAttempt('press-key', 8, 10, 1)).toEqual({ rawScore: 80, score: 70, passed: false });
  });
  it('scores a full press-key set of 10', () => {
    expect(scoreAttempt('press-key', 10, 10, 0)).toEqual({
      rawScore: 100,
      score: 100,
      passed: true,
    });
    expect(scoreAttempt('press-key', 7, 10, 0)).toEqual({ rawScore: 70, score: 70, passed: false });
  });
});
