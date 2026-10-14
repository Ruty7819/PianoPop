import { describe, expect, it } from 'vitest';
import {
  calibrationOffsetMs,
  judgeTap,
  judgeTaps,
  rhythmScore,
  rhythmTimeline,
  tapTiming,
} from './rhythm';

describe('tapTiming', () => {
  it('is on-time within the perfect window, else early/late by sign', () => {
    expect(tapTiming(0)).toBe('on-time');
    expect(tapTiming(0.09)).toBe('on-time');
    expect(tapTiming(-0.09)).toBe('on-time');
    expect(tapTiming(0.1)).toBe('late');
    expect(tapTiming(-0.1)).toBe('early');
  });
});

describe('rhythmTimeline', () => {
  it('lays out demo, count-in and tapping bars on the audio clock', () => {
    const tl = rhythmTimeline(120, [0, 1, 2, 2.5], 10);
    expect(tl.bars).toBe(1);
    expect(tl.demoBeats).toEqual([10, 10.5, 11, 11.25]);
    expect(tl.demoClicks).toEqual([10, 10.5, 11, 11.5]);
    expect(tl.countIn).toEqual([12, 12.5, 13, 13.5]);
    expect(tl.tapStart).toBe(14);
    expect(tl.tapClicks).toEqual([14, 14.5, 15, 15.5]);
    expect(tl.beats).toEqual([14, 14.5, 15, 15.25]);
    expect(tl.end).toBe(16);
  });

  it('rounds the pattern up to whole bars', () => {
    expect(rhythmTimeline(60, [0, 4], 0).bars).toBe(2);
    expect(rhythmTimeline(60, [0, 3.5], 0).bars).toBe(1);
  });
});

describe('judgeTaps', () => {
  const beats = [1, 2, 3, 4];

  it('hits every beat with taps inside the good window', () => {
    const r = judgeTaps(beats, [1.05, 1.9, 3.17, 4], 0);
    expect(r.beats.map((b) => b.hit)).toEqual([true, true, true, true]);
    expect(r.beats[1]?.timing).toBe('early');
    expect(r.beats[2]?.timing).toBe('late');
    expect(r.beats[3]?.timing).toBe('on-time');
    expect(r.extraTaps).toBe(0);
  });

  it('misses beats with no tap within ±180 ms', () => {
    const r = judgeTaps(beats, [1.19, 2.18], 0);
    expect(r.beats.map((b) => b.hit)).toEqual([false, true, false, false]);
  });

  it('subtracts the latency offset before judging', () => {
    const r = judgeTaps(beats, [1.2, 2.2, 3.2, 4.2], 200);
    expect(r.beats.every((b) => b.hit && b.timing === 'on-time')).toBe(true);
  });

  it('uses each tap once and counts extra taps without penalty', () => {
    const r = judgeTaps([1, 1.25], [1.1, 1.12, 2.5], 0);
    expect(r.beats.map((b) => b.hit)).toEqual([true, true]);
    expect(r.extraTaps).toBe(1);
    expect(rhythmScore(r, 0).rawScore).toBe(100);
  });
});

describe('judgeTap', () => {
  it('reports timing against the nearest beat', () => {
    expect(judgeTap([1, 2], 1.85, 0)).toBe('early');
    expect(judgeTap([1, 2], 1.3, 0)).toBe('late');
    expect(judgeTap([1, 2], 2.15, 100)).toBe('on-time');
    expect(judgeTap([], 1, 0)).toBeNull();
  });
});

describe('rhythmScore', () => {
  it('passes at ≥ 75% of beats (D-81)', () => {
    const three = judgeTaps([1, 2, 3, 4], [1, 2, 3], 0);
    expect(rhythmScore(three, 0)).toEqual({ rawScore: 75, score: 75, passed: true });
    expect(rhythmScore(three, 1).passed).toBe(false);
    const two = judgeTaps([1, 2, 3, 4], [1, 2], 0);
    expect(rhythmScore(two, 0).passed).toBe(false);
  });
});

describe('calibrationOffsetMs', () => {
  it('is the median of tap − nearest click, in ms (D-80)', () => {
    const clicks = [1, 2, 3, 4, 5];
    expect(calibrationOffsetMs(clicks, [1.1, 2.12, 3.08, 4.5, 5.11])).toBe(110);
  });

  it('averages the two middle values for an even count', () => {
    expect(calibrationOffsetMs([1, 2], [1.1, 2.2])).toBe(150);
  });

  it('is null without taps', () => {
    expect(calibrationOffsetMs([1, 2], [])).toBeNull();
  });
});
