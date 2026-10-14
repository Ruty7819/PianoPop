import { useEffect } from 'react';
import { he } from '../../../i18n/he';

interface Props {
  /** Audio-clock time of the tap (architecture §5). */
  onTap: (t: number) => void;
  now: () => number;
  disabled?: boolean;
}

/** Large tap target + Space key (approved 14.10.2026). Stamps taps at the DOM event. */
export function TapPad({ onTap, now, disabled }: Props) {
  useEffect(() => {
    if (disabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      if (e.repeat) return;
      onTap(now());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onTap, now, disabled]);

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={he.tapRhythm.tapHint}
      onPointerDown={(e) => {
        e.preventDefault();
        onTap(now());
      }}
      className="grid min-h-40 w-full touch-none place-items-center rounded-card border-2 border-line bg-surface text-2xl font-bold select-none active:bg-line/50 disabled:opacity-40"
    >
      {he.tapRhythm.tap}
    </button>
  );
}
