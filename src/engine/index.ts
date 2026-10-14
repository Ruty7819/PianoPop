// Public API of src/engine — see docs/architecture.md §2.
export type {
  Midi,
  Letter,
  Accidental,
  AccidentalPreference,
  NoteNaming,
  Clef,
  Spelling,
  LabelOptions,
} from './notes';
export { isBlackKey, spell, toMidi, noteLabel, staffStep, ledgerLines } from './notes';
