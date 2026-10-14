import { useEffect, useRef, useState } from 'react';
import { staffStep } from '../../../engine';
import { he } from '../../../i18n/he';
import {
  BOTTOM_LINE_Y,
  STAFF_HEIGHT,
  staffWidth,
  STEP_PX,
  type StaffProps,
  type StaffTone,
} from './types';

const TONE_TEXT = {
  target: 'text-target',
  correct: 'text-correct-text',
  wrong: 'text-wrong-text',
} as const;

/** Treble staff (VexFlow, loaded lazily); always LTR; Hebrew labels as HTML overlay. */
export function Staff({ notes, clef = 'treble' }: StaffProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [xs, setXs] = useState<number[]>([]);
  const width = staffWidth(notes.length);
  // Redraw only when what VexFlow draws changes, not on new array identity.
  const drawKey = notes.map((n) => `${n.midi}:${n.tone ?? ''}`).join(',');

  useEffect(() => {
    let live = true;
    const drawn = drawKey
      ? drawKey.split(',').map((k) => {
          const [midi, tone] = k.split(':');
          return { midi: Number(midi), tone: (tone || undefined) as StaffTone | undefined };
        })
      : [];
    void (async () => {
      const [{ drawStaff }] = await Promise.all([
        import('./drawStaff'),
        document.fonts?.load('30px Bravura'),
      ]);
      if (live && ref.current) setXs(drawStaff(ref.current, drawn, clef));
    })();
    return () => {
      live = false;
    };
  }, [drawKey, clef]);

  return (
    <div
      dir="ltr"
      role="img"
      aria-label={he.staff.label}
      className="relative mx-auto w-full text-ink"
      style={{ maxWidth: `${width * 1.7}px` }}
    >
      <div
        ref={ref}
        className="[&_[data-tone=correct]]:text-correct [&_[data-tone=target]]:text-target [&_[data-tone=wrong]]:text-wrong"
        style={{ aspectRatio: `${width} / ${STAFF_HEIGHT}` }}
      />
      {notes.map((n, i) => {
        const x = xs[i];
        if (!n.label || x === undefined) return null;
        const y = BOTTOM_LINE_Y - staffStep(n.midi, clef) * STEP_PX;
        return (
          <span
            key={i}
            data-label-for={n.midi}
            className={`absolute -translate-y-1/2 text-xl font-bold ${n.tone ? TONE_TEXT[n.tone] : ''}`}
            style={{
              left: `${((x + 24) / width) * 100}%`,
              top: `${(y / STAFF_HEIGHT) * 100}%`,
            }}
          >
            {n.label}
          </span>
        );
      })}
    </div>
  );
}
