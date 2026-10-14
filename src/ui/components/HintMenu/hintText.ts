import {
  isBlackKey,
  noteLabel,
  spell,
  staffPlace,
  type Clef,
  type Midi,
  type NoteNaming,
} from '../../../engine';
import { he } from '../../../i18n/he';

/** Where a key sits relative to the black-key groups. */
export function keyHint(midi: Midi, naming: NoteNaming = 'solfege'): string {
  const note = noteLabel(midi, { naming });
  if (isBlackKey(midi)) return he.hints.blackKeyAt(note, noteLabel(midi - 1, { naming }));
  return he.hints.whiteKeyAt(note, he.hints.whiteKey[spell(midi).letter]);
}

/** Line / space of a note on the staff. */
export function staffHint(midi: Midi, clef: Clef = 'treble'): string {
  const p = staffPlace(midi, clef);
  if (p.kind === 'line') return he.hints.staffLine(p.n);
  if (p.kind === 'space') return he.hints.staffSpace(p.n);
  return p.kind === 'below' ? he.hints.staffBelow : he.hints.staffAbove;
}
