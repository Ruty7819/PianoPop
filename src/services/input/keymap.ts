import type { Midi } from '../../engine';

/**
 * Physical keys (KeyboardEvent.code) → semitone offset from the keyboard base.
 * Home row = white keys, row above = black keys (common virtual-piano layout);
 * by `code`, so it works the same with a Hebrew layout (requirements §5).
 */
export const KEY_OFFSETS: Readonly<Record<string, number>> = {
  KeyA: 0,
  KeyW: 1,
  KeyS: 2,
  KeyE: 3,
  KeyD: 4,
  KeyF: 5,
  KeyT: 6,
  KeyG: 7,
  KeyY: 8,
  KeyH: 9,
  KeyU: 10,
  KeyJ: 11,
  KeyK: 12,
  KeyO: 13,
  KeyL: 14,
  KeyP: 15,
  Semicolon: 16,
  Quote: 17,
};

export const DEFAULT_KEYBOARD_BASE: Midi = 60;

export function codeToMidi(code: string, base: Midi): Midi | undefined {
  const offset = KEY_OFFSETS[code];
  return offset === undefined ? undefined : base + offset;
}

/** Label shown on a piano key: the US-layout letter of its mapped physical key. */
export function keyLabelFor(midi: Midi, base: Midi): string | undefined {
  const code = Object.keys(KEY_OFFSETS).find((c) => KEY_OFFSETS[c] === midi - base);
  if (!code) return undefined;
  if (code === 'Semicolon') return ';';
  if (code === 'Quote') return "'";
  return code.slice(3);
}
