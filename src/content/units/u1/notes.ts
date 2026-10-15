import type { Midi } from '../../../engine/notes';
import { toMidi } from '../../../engine/notes';

/** `'C4 D4 E4'` → MIDI list. */
export const seq = (text: string): Midi[] => text.trim().split(/\s+/).map(toMidi);

/** `'C3/C5 G5/G3'` → [first, second] pairs. */
export const pairs = (text: string): [Midi, Midi][] =>
  text
    .trim()
    .split(/\s+/)
    .map((p) => {
      const [a = '', b = ''] = p.split('/');
      return [toMidi(a), toMidi(b)];
    });

// Shared sets, reused by lessons, the summary test and placement.
export const WIDE_PAIRS = 'C3/C5 G5/G3 E3/E5 A5/D4 C4/C6 F5/F3 D3/A4 B5/C4 G3/G5 C6/C4';
export const CLOSE_PAIRS = 'E4/F4 D4/C4 G4/A4 B4/C5 F4/E4 A4/G4 C4/D4 C5/B4 D5/E5 G4/F4';
export const ALL_SEVEN = 'G4 C4 E4 A4 D4 B4 F4 C5 A3 E4';

/** "Mary Had a Little Lamb" — traditional, public domain. */
export const MARY_SHORT = 'E4 D4 C4 D4 E4 E4 E4';
export const MARY_PHRASE =
  'E4 D4 C4 D4 E4 E4 E4 D4 D4 D4 E4 G4 G4 E4 D4 C4 D4 E4 E4 E4 E4 D4 D4 E4 D4 C4';
