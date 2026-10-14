import { BEATS_PER_BAR, type BeatResult } from '../../engine';
import { he } from '../../i18n/he';

interface Props {
  pattern: readonly number[];
  bars: number;
  /** Playhead in beats from the bar start; null hides it. */
  playhead?: number | null;
  /** Colours each beat once judged. */
  results?: readonly BeatResult[];
}

/** How close (in beats) the playhead must be for a dot to light up. */
const ACTIVE_RANGE = 0.15;

/** Pattern beats as dots on a time line, left to right, with a moving playhead. */
export function RhythmBar({ pattern, bars, playhead = null, results }: Props) {
  const len = bars * BEATS_PER_BAR;
  const x = (beat: number) => `${((beat + 0.5) / (len + 0.5)) * 100}%`;
  return (
    <div
      dir="ltr"
      aria-label={he.tapRhythm.pattern}
      className="relative h-12 rounded-full bg-line/40"
    >
      {Array.from({ length: len }, (_, i) => (
        <span
          key={`tick-${i}`}
          className={`absolute top-2 bottom-2 w-px ${i % BEATS_PER_BAR === 0 ? 'bg-ink/40' : 'bg-line'}`}
          style={{ left: x(i) }}
        />
      ))}
      {pattern.map((p, i) => {
        const r = results?.[i];
        const active = playhead !== null && Math.abs(playhead - p) < ACTIVE_RANGE;
        const tone = !r ? (active ? 'bg-target' : 'bg-ink') : r.hit ? 'bg-correct' : 'bg-wrong';
        return (
          <span
            key={i}
            data-beat={r ? (r.hit ? 'hit' : 'miss') : active ? 'active' : 'pending'}
            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-75 ${tone} ${active ? 'size-8' : 'size-5'}`}
            style={{ left: x(p) }}
          />
        );
      })}
      {playhead !== null && playhead >= -0.5 && playhead <= len && (
        <span
          data-playhead
          className="absolute top-0 bottom-0 w-1 -translate-x-1/2 rounded-full bg-target"
          style={{ left: x(playhead) }}
        />
      )}
    </div>
  );
}
