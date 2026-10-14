import { scoreAttempt, type ScoreResult } from './scoring';

/** Rhythm windows in seconds — requirements §6 [REC]. */
export const RHYTHM_WINDOW = { perfect: 0.09, good: 0.18 };
export const BEATS_PER_BAR = 4;
/** Calibration: taps collected and the "very late" tip threshold (D-80). */
export const CALIBRATION_TAPS = 12;
export const LATE_TIP_MS = 150;

export type TapTiming = 'early' | 'on-time' | 'late';

/** delta = tap − beat, in seconds. */
export function tapTiming(delta: number): TapTiming {
  if (Math.abs(delta) <= RHYTHM_WINDOW.perfect + 1e-9) return 'on-time';
  return delta < 0 ? 'early' : 'late';
}

export interface RhythmTimeline {
  bars: number;
  demoClicks: number[];
  demoBeats: number[];
  countIn: number[];
  tapStart: number;
  tapClicks: number[];
  /** Beat times the learner is judged against. */
  beats: number[];
  end: number;
}

/** Demo bar(s) → one count-in bar → tapping bar(s), all on the audio clock (approved 14.10.2026). */
export function rhythmTimeline(
  bpm: number,
  pattern: readonly number[],
  t0: number,
): RhythmTimeline {
  const spb = 60 / bpm;
  const bars = Math.max(1, Math.floor(Math.max(0, ...pattern) / BEATS_PER_BAR) + 1);
  const len = bars * BEATS_PER_BAR;
  const clicks = (start: number, n: number) => Array.from({ length: n }, (_, i) => start + i * spb);
  const countStart = t0 + len * spb;
  const tapStart = countStart + BEATS_PER_BAR * spb;
  return {
    bars,
    demoClicks: clicks(t0, len),
    demoBeats: pattern.map((p) => t0 + p * spb),
    countIn: clicks(countStart, BEATS_PER_BAR),
    tapStart,
    tapClicks: clicks(tapStart, len),
    beats: pattern.map((p) => tapStart + p * spb),
    end: tapStart + len * spb,
  };
}

export interface BeatResult {
  hit: boolean;
  /** Present when hit. */
  timing?: TapTiming;
  delta?: number;
}

export interface RhythmJudgement {
  beats: BeatResult[];
  extraTaps: number;
}

/**
 * Each beat takes the nearest unused tap within the good window; extra taps are not
 * penalised (approved 14.10.2026). Taps are shifted by the latency offset first.
 */
export function judgeTaps(
  beats: readonly number[],
  taps: readonly number[],
  latencyOffsetMs: number,
): RhythmJudgement {
  const shifted = taps.map((t) => t - latencyOffsetMs / 1000);
  const used = new Set<number>();
  const results = beats.map((beat): BeatResult => {
    let best = -1;
    for (let i = 0; i < shifted.length; i++) {
      if (used.has(i)) continue;
      const d = Math.abs(shifted[i]! - beat);
      if (d <= RHYTHM_WINDOW.good + 1e-9 && (best < 0 || d < Math.abs(shifted[best]! - beat)))
        best = i;
    }
    if (best < 0) return { hit: false };
    used.add(best);
    const delta = shifted[best]! - beat;
    return { hit: true, timing: tapTiming(delta), delta };
  });
  return { beats: results, extraTaps: taps.length - used.size };
}

/** Live feedback for one tap against the nearest beat; null when there are no beats. */
export function judgeTap(
  beats: readonly number[],
  tap: number,
  latencyOffsetMs: number,
): TapTiming | null {
  const t = tap - latencyOffsetMs / 1000;
  let best: number | null = null;
  for (const b of beats) if (best === null || Math.abs(t - b) < Math.abs(t - best)) best = b;
  return best === null ? null : tapTiming(t - best);
}

/** ≥ 75% of beats within the good window (D-81). */
export function rhythmScore(j: RhythmJudgement, hintsUsed: number): ScoreResult {
  const hits = j.beats.filter((b) => b.hit).length;
  return scoreAttempt('tap-rhythm', hits, j.beats.length, hintsUsed);
}

/** offset = median(tap − nearest click), rounded ms; null without taps (D-80). */
export function calibrationOffsetMs(
  clicks: readonly number[],
  taps: readonly number[],
): number | null {
  if (!clicks.length || !taps.length) return null;
  const deltas = taps
    .map((t) => {
      const near = clicks.reduce((a, c) => (Math.abs(t - c) < Math.abs(t - a) ? c : a));
      return t - near;
    })
    .sort((a, b) => a - b);
  const mid = deltas.length >> 1;
  const median = deltas.length % 2 ? deltas[mid]! : (deltas[mid - 1]! + deltas[mid]!) / 2;
  return Math.round(median * 1000);
}
