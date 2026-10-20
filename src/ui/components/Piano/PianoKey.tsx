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
  /** Middle C orientation dot. */
  marker?: boolean;
  onDown: (pointerId: number) => void;
  onEnter: (pointerId: number) => void;
}

const WHITE: Record<KeyHighlight | 'none', string> = {
  none: 'bg-surface text-muted border-line',
  target: 'bg-primary-soft text-primary-dark border-primary',
  correct: 'bg-correct text-white border-correct',
  wrong: 'bg-wrong text-white border-wrong',
  demo: 'bg-demo text-white border-demo motion-safe:animate-pulse',
};

const BLACK: Record<KeyHighlight | 'none', string> = {
  none: 'bg-ink text-white border-ink',
  target: 'bg-primary-soft text-primary-dark border-primary',
  correct: 'bg-correct text-white border-correct',
  wrong: 'bg-wrong text-white border-wrong',
  demo: 'bg-demo text-white border-demo motion-safe:animate-pulse',
};

export function PianoKey({
  layout,
  pressed,
  highlight,
  name,
  noteText,
  keyText,
  marker,
  onDown,
  onEnter,
}: Props) {
  const { black, left, width } = layout;
  const color = (black ? BLACK : WHITE)[highlight ?? 'none'];
  const pressedCls = pressed ? (black ? 'brightness-150' : 'brightness-90') : '';
  const shape = black
    ? 'z-10 h-[58%] rounded-b-lg border-2 border-b-4'
    : 'h-full rounded-b-key border-2 border-b-7 text-sm';

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
      {marker && <span data-middle-c className="mb-1 size-2 rounded-full bg-current opacity-60" />}
      {noteText && <span className={highlight ? 'font-bold' : ''}>{noteText}</span>}
      {keyText && <span className="opacity-60">{keyText}</span>}
    </div>
  );
}
