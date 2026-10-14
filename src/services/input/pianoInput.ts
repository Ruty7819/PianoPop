import type { Midi } from '../../engine';
import { DEFAULT_KEYBOARD_BASE, codeToMidi } from './keymap';
import type { NoteListener, PianoInput } from './types';

const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

function isTyping(e: KeyboardEvent): boolean {
  const el = e.target as HTMLElement | null;
  return !!el && (TYPING_TAGS.has(el.tagName) || el.isContentEditable === true);
}

/** `now` is the audio clock (AudioService.now) — the single time source. */
export function createPianoInput(now: () => number): PianoInput {
  const listeners = new Set<NoteListener>();
  // A note sounds while at least one source holds it (pointer or key).
  const holds = new Map<Midi, number>();
  const pointers = new Map<number, Midi>();
  const keys = new Map<string, Midi>();
  let base = DEFAULT_KEYBOARD_BASE;

  const emit = (midi: Midi, on: boolean, t: number) => {
    for (const l of listeners) l({ midi, on, t });
  };
  const press = (midi: Midi, t: number) => {
    const n = holds.get(midi) ?? 0;
    holds.set(midi, n + 1);
    if (n === 0) emit(midi, true, t);
  };
  const release = (midi: Midi, t: number) => {
    const n = holds.get(midi) ?? 0;
    if (n === 0) return;
    if (n === 1) {
      holds.delete(midi);
      emit(midi, false, t);
    } else holds.set(midi, n - 1);
  };

  const onKeyDown = (e: Event) => {
    const k = e as KeyboardEvent;
    if (k.repeat || k.ctrlKey || k.metaKey || k.altKey || isTyping(k)) return;
    if (keys.has(k.code)) return;
    const midi = codeToMidi(k.code, base);
    if (midi === undefined) return;
    const t = now();
    k.preventDefault();
    keys.set(k.code, midi);
    press(midi, t);
  };
  const onKeyUp = (e: Event) => {
    const code = (e as KeyboardEvent).code;
    const midi = keys.get(code);
    if (midi === undefined) return;
    const t = now();
    keys.delete(code);
    release(midi, t);
  };

  const input: PianoInput = {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    pointerDown(pointerId, midi) {
      const t = now();
      const prev = pointers.get(pointerId);
      if (prev !== undefined) release(prev, t);
      pointers.set(pointerId, midi);
      press(midi, t);
    },
    pointerEnter(pointerId, midi) {
      const prev = pointers.get(pointerId);
      if (prev === undefined || prev === midi) return;
      const t = now();
      release(prev, t);
      pointers.set(pointerId, midi);
      press(midi, t);
    },
    pointerUp(pointerId) {
      const midi = pointers.get(pointerId);
      if (midi === undefined) return;
      const t = now();
      pointers.delete(pointerId);
      release(midi, t);
    },
    attachKeyboard(target) {
      const onBlur = () => input.releaseAll();
      target.addEventListener('keydown', onKeyDown);
      target.addEventListener('keyup', onKeyUp);
      target.addEventListener('blur', onBlur);
      return () => {
        target.removeEventListener('keydown', onKeyDown);
        target.removeEventListener('keyup', onKeyUp);
        target.removeEventListener('blur', onBlur);
      };
    },
    setKeyboardBase(midi) {
      base = midi;
    },
    releaseAll() {
      const t = now();
      pointers.clear();
      keys.clear();
      for (const midi of [...holds.keys()]) {
        holds.delete(midi);
        emit(midi, false, t);
      }
    },
    held: () => [...holds.keys()].sort((a, b) => a - b),
  };
  return input;
}
