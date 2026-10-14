// Public API of src/services — see docs/architecture.md §2.
export { audio, createToneAudioService } from './audio';
export type { AudioService, AudioState, SequenceNote } from './audio';
export {
  pianoInput,
  createPianoInput,
  KEY_OFFSETS,
  DEFAULT_KEYBOARD_BASE,
  codeToMidi,
  keyLabelFor,
} from './input';
export type { NoteEvent, NoteListener, PianoInput } from './input';
