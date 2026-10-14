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
import { TapPad } from '../components/TapPad';
import { ExerciseSummary } from './ExerciseSummary';
import { RhythmBar } from './RhythmBar';
import { TR_TIMING } from './tapRhythmTiming';
import { RhythmStage, type RhythmPhase } from './RhythmStage';
import { useAudioClock } from '../hooks/useAudioClock';
import { useHints } from '../hooks/useHints';
import { HintBar } from './HintBar';

interface Props {
  def: TapRhythmDef;
  audio: Pick<AudioService, 'click' | 'playNote' | 'now'>;
  latencyOffsetMs: number;
  onDone?: (result: AttemptResult) => void;
}

/** Demo → count-in → tap along (requirements §6, approved 14.10.2026). */
export function TapRhythm({ def, audio, latencyOffsetMs, onDone }: Props) {
  const [phase, setPhase] = useState<RhythmPhase>('ready');
  const [tl, setTl] = useState<RhythmTimeline | null>(null);
  const [last, setLast] = useState<TapTiming | null>(null);
  const [judged, setJudged] = useState<RhythmJudgement | null>(null);
  const [startedAt, setStartedAt] = useState('');
  const taps = useRef<number[]>([]);
  const hints = useHints(def.skill);

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
            hintsUsed: hints.hintsUsed,
            ...rhythmScore(judged, hints.hintsUsed),
            details: { ...judged, latencyOffsetMs },
            startedAt,
            finishedAt: new Date().toISOString(),
          }
        : null,
    [judged, def.id, latencyOffsetMs, startedAt, hints.hintsUsed],
  );

  useEffect(() => {
    if (result) onDone?.(result);
  }, [result, onDone]);

  const retry = () => {
    setJudged(null);
    setTl(null);
    setPhase('ready');
    hints.reset();
  };
  const bars = tl?.bars ?? rhythmTimeline(def.bpm, def.pattern, 0).bars;
  const tapping = phase === 'count' || phase === 'tap';
  const t = useAudioClock(now, phase === 'demo' || tapping);
  const spb = 60 / def.bpm;
  const playhead =
    tl && phase === 'demo'
      ? (t - tl.demoClicks[0]!) / spb
      : tl && phase === 'tap'
        ? (t - tl.tapStart) / spb
        : null;

  return (
    <section className="flex flex-col gap-6">
      <RhythmStage phase={phase} tl={tl} t={t} last={last} judged={judged} />
      <RhythmBar pattern={def.pattern} bars={bars} playhead={playhead} results={judged?.beats} />
      {result ? (
        <ExerciseSummary result={result} onRetry={retry} />
      ) : (
        phase === 'ready' && (
          <Button variant="primary" className="self-center" onClick={start}>
            {he.tapRhythm.start}
          </Button>
        )
      )}
      {/* Hints only before a run, so the dialog never breaks the timing; the run itself demos first. */}
      {phase === 'ready' && (
        <HintBar
          skill={def.skill}
          short={he.hints.tapRhythm}
          explanation={he.hints.explain['tap-rhythm']}
          onHint={hints.use}
        />
      )}
      {!result && <TapPad onTap={onTap} now={now} disabled={!tapping} />}
    </section>
  );
}
