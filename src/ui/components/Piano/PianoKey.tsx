import type { PointerEvent } from 'react';
import type { KeyHighlight, KeyLayout } from './types';

interface Props {
  layout: KeyLayout;
  pressed: boolean;
  highlight?: KeyHighlight;
  name: string;
  /** Note name printed on the key (optional). */
  noteText?: string;
  /** Mapped computer-key letter (optional). */
  keyText?: string;
  onDown: (pointerId: number) => void;
  onEnter: (pointerId: number) => void;
}

const WHITE: Record<KeyHighlight | 'none', string> = {
  none: 'bg-[#fbfbfc] text-muted',
  target: 'bg-target text-ink',
  correct: 'bg-correct text-surface',
  wrong: 'bg-wrong text-surface',
  demo: 'bg-demo text-ink motion-safe:animate-pulse',
};

const BLACK: Record<KeyHighlight | 'none', string> = {
  none: 'bg-ink text-surface',
  target: 'bg-target text-ink',
  correct: 'bg-correct text-surface',
  wrong: 'bg-wrong text-surface',
  demo: 'bg-demo text-ink motion-safe:animate-pulse',
};

export function PianoKey({
  layout,
  pressed,
  highlight,
  name,
  noteText,
  keyText,
  onDown,
  onEnter,
}: Props) {
  const { black, left, width } = layout;
  const color = (black ? BLACK : WHITE)[highlight ?? 'none'];
  const pressedCls = pressed ? (black ? 'brightness-150' : 'brightness-90') : '';
  const shape = black
    ? 'z-10 h-[58%] rounded-b-md ring-1 ring-ink'
    : 'h-full rounded-b-key border-x border-ink shadow-[inset_0_-3px_0_rgb(0_0_0/0.08)]';

  const down = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Touch captures the pointer implicitly; release it so sliding reaches other keys.
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    onDown(e.pointerId);
  };

  return (
    <div
      role="button"
      aria-label={name}
      aria-pressed={pressed}
      data-midi={layout.midi}
      data-highlight={highlight}
      className={`absolute top-0 flex flex-col items-center justify-end gap-0.5 pb-1 text-xs select-none ${shape} ${color} ${pressedCls}`}
      style={{ left: `${left}%`, width: `${width}%` }}
      onPointerDown={down}
      onPointerEnter={(e) => onEnter(e.pointerId)}
    >
      {noteText && <span className={highlight ? 'font-bold' : ''}>{noteText}</span>}
      {keyText && <span className="opacity-60">{keyText}</span>}
    </div>
  );
}
