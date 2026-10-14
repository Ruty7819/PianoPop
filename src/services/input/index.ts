import { audio } from '../audio';
import { createPianoInput } from './pianoInput';

export type { NoteEvent, NoteListener, PianoInput } from './types';
export { createPianoInput } from './pianoInput';
export { KEY_OFFSETS, DEFAULT_KEYBOARD_BASE, codeToMidi, keyLabelFor } from './keymap';

/** App-wide singleton stamped with the audio clock (architecture §5). */
export const pianoInput = createPianoInput(() => audio.now());
