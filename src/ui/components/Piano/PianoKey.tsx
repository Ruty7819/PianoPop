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
  none: 'bg-white',
  target: 'bg-sky-200 ring-4 ring-inset ring-sky-500',
  correct: 'bg-green-300',
  wrong: 'bg-red-300',
  demo: 'bg-amber-200 motion-safe:animate-pulse',
};

const BLACK: Record<KeyHighlight | 'none', string> = {
  none: 'bg-gray-900',
  target: 'bg-sky-700 ring-4 ring-inset ring-sky-300',
  correct: 'bg-green-700',
  wrong: 'bg-red-700',
  demo: 'bg-amber-600 motion-safe:animate-pulse',
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
    ? 'z-10 h-[60%] rounded-b-md text-white'
    : 'h-full rounded-b-lg border border-gray-400 text-gray-700';

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
      {noteText && <span className="font-semibold">{noteText}</span>}
      {keyText && <span className="opacity-60">{keyText}</span>}
    </div>
  );
}
