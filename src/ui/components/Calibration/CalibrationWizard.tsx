import { useCallback, useEffect, useRef, useState } from 'react';
import { BEATS_PER_BAR, CALIBRATION_TAPS, LATE_TIP_MS, calibrationOffsetMs } from '../../../engine';
import { he } from '../../../i18n/he';
import type { AudioService } from '../../../services/audio';
import { Button } from '../Button';
import { Card } from '../Card';
import { FeedbackBanner } from '../FeedbackBanner';
import { TapPad } from '../TapPad';

/** Metronome speed, lead-in and the fewest taps that still give a usable median. */
export const CALIBRATION = { bpm: 90, lead: 0.3, minTaps: 6 };

type Phase =
  | { kind: 'intro' }
  | { kind: 'running'; clicks: number[]; tapStart: number; end: number }
  | { kind: 'result'; ms: number }
  | { kind: 'tooFew' };

interface Props {
  audio: Pick<AudioService, 'click' | 'now'>;
  /** Called with the measured offset, or 0 when skipped (approved 14.10.2026). */
  onDone: (latencyOffsetMs: number) => void;
}

/** Latency calibration: count-in + 12 clicks, offset = median(tap − click) (D-80). */
export function CalibrationWizard({ audio, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' });
  const [tapCount, setTapCount] = useState(0);
  const taps = useRef<number[]>([]);

  const start = () => {
    const spb = 60 / CALIBRATION.bpm;
    const t0 = audio.now() + CALIBRATION.lead;
    const all = Array.from({ length: BEATS_PER_BAR + CALIBRATION_TAPS }, (_, i) => t0 + i * spb);
    all.forEach((t, i) => audio.click(t, i % BEATS_PER_BAR === 0));
    taps.current = [];
    setTapCount(0);
    const clicks = all.slice(BEATS_PER_BAR);
    setPhase({ kind: 'running', clicks, tapStart: clicks[0]! - spb / 2, end: all.at(-1)! + spb });
  };

  const finish = useCallback((clicks: number[]) => {
    const ms =
      taps.current.length >= CALIBRATION.minTaps ? calibrationOffsetMs(clicks, taps.current) : null;
    setPhase(ms === null ? { kind: 'tooFew' } : { kind: 'result', ms });
  }, []);

  useEffect(() => {
    if (phase.kind !== 'running') return;
    const id = setTimeout(() => finish(phase.clicks), (phase.end - audio.now()) * 1000);
    return () => clearTimeout(id);
  }, [phase, audio, finish]);

  const onTap = useCallback(
    (t: number) => {
      if (phase.kind !== 'running' || t < phase.tapStart) return;
      taps.current.push(t);
      setTapCount(taps.current.length);
      if (taps.current.length >= CALIBRATION_TAPS) finish(phase.clicks);
    },
    [phase, finish],
  );

  const now = useCallback(() => audio.now(), [audio]);
  const running = phase.kind === 'running';

  return (
    <Card className="gap-4">
      <h2 className="text-2xl font-bold">{he.calibration.title}</h2>
      {phase.kind === 'intro' && <p>{he.calibration.intro}</p>}
      {running && (
        <FeedbackBanner tone="neutral">
          {tapCount === 0 ? he.calibration.listen : he.calibration.taps(tapCount, CALIBRATION_TAPS)}
        </FeedbackBanner>
      )}
      {running && <p className="text-center text-muted">{he.calibration.tapNow}</p>}
      {running && <TapPad onTap={onTap} now={now} />}
      {phase.kind === 'result' && (
        <>
          <FeedbackBanner tone="correct">{he.calibration.result(phase.ms)}</FeedbackBanner>
          {phase.ms > LATE_TIP_MS && <p className="text-wrong-text">{he.calibration.lateTip}</p>}
        </>
      )}
      {phase.kind === 'tooFew' && (
        <FeedbackBanner tone="wrong">{he.calibration.tooFew}</FeedbackBanner>
      )}
      <div className="flex flex-wrap gap-3">
        {phase.kind === 'intro' && (
          <Button variant="primary" onClick={start}>
            {he.calibration.start}
          </Button>
        )}
        {phase.kind === 'result' && (
          <Button variant="primary" onClick={() => onDone(phase.ms)}>
            {he.calibration.done}
          </Button>
        )}
        {(phase.kind === 'result' || phase.kind === 'tooFew') && (
          <Button onClick={start}>{he.calibration.retry}</Button>
        )}
        {phase.kind !== 'result' && (
          <Button onClick={() => onDone(0)}>{he.calibration.skip}</Button>
        )}
      </div>
    </Card>
  );
}
