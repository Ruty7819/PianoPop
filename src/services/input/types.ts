import type { Midi } from '../../engine';

/** t = audio clock seconds at the moment of the DOM event (architecture §5). */
export interface NoteEvent {
  midi: Midi;
  on: boolean;
  t: number;
}

export type NoteListener = (event: NoteEvent) => void;

/** Unifies pointer (mouse + multi-touch) and computer keyboard into NoteEvents. */
export interface PianoInput {
  subscribe(listener: NoteListener): () => void;
  /** Pointer pressed on a key. Each pointerId holds at most one note. */
  pointerDown(pointerId: number, midi: Midi): void;
  /** Pointer slid onto another key while pressed (glissando); ignored if not pressed. */
  pointerEnter(pointerId: number, midi: Midi): void;
  pointerUp(pointerId: number): void;
  /** Listens to keydown/keyup on target (by KeyboardEvent.code); returns detach. */
  attachKeyboard(target: EventTarget): () => void;
  /** Midi played by the first mapped key (KeyA). */
  setKeyboardBase(midi: Midi): void;
  /** Releases every held note (blur, unmount). */
  releaseAll(): void;
  /** Currently held notes. */
  held(): Midi[];
}
