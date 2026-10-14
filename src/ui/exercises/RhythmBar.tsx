import { BEATS_PER_BAR, type BeatResult } from '../../engine';
import { he } from '../../i18n/he';

interface Props {
  pattern: readonly number[];
  bars: number;
  /** Colours each beat once judged. */
  results?: readonly BeatResult[];
}

/** Pattern beats as dots on a time line, left to right. */
export function RhythmBar({ pattern, bars, results }: Props) {
  const len = bars * BEATS_PER_BAR;
  return (
    <div
      dir="ltr"
      aria-label={he.tapRhythm.pattern}
      className="relative h-10 rounded-full bg-line/40"
    >
      {Array.from({ length: len }, (_, i) => (
        <span
          key={`tick-${i}`}
          className={`absolute top-2 bottom-2 w-px bg-line ${i % BEATS_PER_BAR === 0 ? 'bg-ink/40' : ''}`}
          style={{ left: `${((i + 0.5) / (len + 0.5)) * 100}%` }}
        />
      ))}
      {pattern.map((p, i) => {
        const r = results?.[i];
        const tone = !r ? 'bg-ink' : r.hit ? 'bg-correct' : 'bg-wrong';
        return (
          <span
            key={i}
            data-beat={r ? (r.hit ? 'hit' : 'miss') : 'pending'}
            className={`absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full ${tone}`}
            style={{ left: `${((p + 0.5) / (len + 0.5)) * 100}%` }}
          />
        );
      })}
    </div>
  );
}
