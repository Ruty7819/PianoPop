import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TapRhythmDef } from '../../content';
import {
  BEATS_PER_BAR,
  RHYTHM_WINDOW,
  judgeTap,
  judgeTaps,
  rhythmScore,
  rhythmTimeline,
  type AttemptResult,
  type RhythmJudgement,
  type RhythmTimeline,
  type TapTiming,
} from '../../engine';
import { he } from '../../i18n/he';
import type { AudioService } from '../../services/audio';
import { Button } from '../components/Button';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { TapPad } from '../components/TapPad';
import { ExerciseSummary } from './ExerciseSummary';
import { RhythmBar } from './RhythmBar';

/** Lead-in before the demo (s) and the note that plays the pattern. */
export const TR_TIMING = { lead: 0.4, note: 72, noteDur: 0.2 };

type Phase = 'ready' | 'demo' | 'count' | 'tap' | 'done';

const TIMING_TEXT: Record<TapTiming, string> = {
  early: he.tapRhythm.early,
  'on-time': he.tapRhythm.onTime,
  late: he.tapRhythm.late,
};

interface Props {
  def: TapRhythmDef;
  audio: Pick<AudioService, 'click' | 'playNote' | 'now'>;
  latencyOffsetMs: number;
  onDone?: (result: AttemptResult) => void;
}

/** Demo → count-in → tap along (requirements §6, approved 14.10.2026). */
export function TapRhythm({ def, audio, latencyOffsetMs, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>('ready');
  const [tl, setTl] = useState<RhythmTimeline | null>(null);
  const [last, setLast] = useState<TapTiming | null>(null);
  const [judged, setJudged] = useState<RhythmJudgement | null>(null);
  const [startedAt, setStartedAt] = useState('');
  const taps = useRef<number[]>([]);

  const start = () => {
    const t = rhythmTimeline(def.bpm, def.pattern, audio.now() + TR_TIMING.lead);
    const clicks = [...t.demoClicks, ...t.countIn, ...t.tapClicks];
    clicks.forEach((c, i) => audio.click(c, i % BEATS_PER_BAR === 0));
    t.demoBeats.forEach((b) => audio.playNote(TR_TIMING.note, TR_TIMING.noteDur, b));
    taps.current = [];
    setLast(null);
    setJudged(null);
    setStartedAt(new Date().toISOString());
    setTl(t);
    setPhase('demo');
  };

  // Phase changes follow the audio clock; StrictMode remounts just reschedule them.
  useEffect(() => {
    if (!tl) return;
    const at = (time: number, fn: () => void) =>
      setTimeout(fn, Math.max(0, (time - audio.now()) * 1000));
    const ids = [
      at(tl.countIn[0]!, () => setPhase('count')),
      at(tl.tapStart, () => setPhase('tap')),
      at(tl.end + RHYTHM_WINDOW.good, () => {
        setJudged(judgeTaps(tl.beats, taps.current, latencyOffsetMs));
        setPhase('done');
      }),
    ];
    return () => ids.forEach(clearTimeout);
  }, [tl, audio, latencyOffsetMs]);

  const onTap = useCallback(
    (t: number) => {
      if (!tl) return;
      taps.current.push(t);
      setLast(judgeTap(tl.beats, t, latencyOffsetMs));
    },
    [tl, latencyOffsetMs],
  );
  const now = useCallback(() => audio.now(), [audio]);

  const result = useMemo<AttemptResult | null>(
    () =>
      judged
        ? {
            exerciseId: def.id,
            hintsUsed: 0,
            ...rhythmScore(judged, 0),
            details: { ...judged, latencyOffsetMs },
            startedAt,
            finishedAt: new Date().toISOString(),
          }
        : null,
    [judged, def.id, latencyOffsetMs, startedAt],
  );

  useEffect(() => {
    if (result) onDone?.(result);
  }, [result, onDone]);

  const retry = () => {
    setJudged(null);
    setTl(null);
    setPhase('ready');
  };
  const bars = tl?.bars ?? rhythmTimeline(def.bpm, def.pattern, 0).bars;
  const tapping = phase === 'count' || phase === 'tap';
  const status =
    phase === 'demo'
      ? he.tapRhythm.demo
      : phase === 'count'
        ? he.tapRhythm.countIn
        : phase === 'tap'
          ? last
            ? TIMING_TEXT[last]
            : he.tapRhythm.go
          : ' ';

  return (
    <section className="flex flex-col gap-6">
      <RhythmBar pattern={def.pattern} bars={bars} results={judged?.beats} />
      {result ? (
        <ExerciseSummary result={result} onRetry={retry} />
      ) : phase === 'ready' ? (
        <Button variant="primary" className="self-center" onClick={start}>
          {he.tapRhythm.start}
        </Button>
      ) : (
        <FeedbackBanner tone={phase === 'tap' && last === 'on-time' ? 'correct' : 'neutral'}>
          {status}
        </FeedbackBanner>
      )}
      {!result && <TapPad onTap={onTap} now={now} disabled={!tapping} />}
    </section>
  );
}
