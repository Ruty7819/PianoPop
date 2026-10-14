import { he } from '../i18n/he';

/** MIDI note number; 60 = middle C (דו), scientific octave C4. */
export type Midi = number;
export type Letter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Accidental = -1 | 0 | 1;
export type AccidentalPreference = 'sharp' | 'flat';
export type NoteNaming = 'solfege' | 'letters';
export type Clef = 'treble';

export interface Spelling {
  letter: Letter;
  accidental: Accidental;
  octave: number;
}

const LETTERS: readonly Letter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const LETTER_PC: Record<Letter, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
type PcSpelling = readonly [Letter, Accidental];
// prettier-ignore
const SHARP_SPELLING: readonly PcSpelling[] = [
  ['C', 0], ['C', 1], ['D', 0], ['D', 1], ['E', 0], ['F', 0],
  ['F', 1], ['G', 0], ['G', 1], ['A', 0], ['A', 1], ['B', 0],
];
// prettier-ignore
const FLAT_SPELLING: readonly PcSpelling[] = [
  ['C', 0], ['D', -1], ['D', 0], ['E', -1], ['E', 0], ['F', 0],
  ['G', -1], ['G', 0], ['A', -1], ['A', 0], ['B', -1], ['B', 0],
];

const pitchClass = (midi: Midi) => ((midi % 12) + 12) % 12;

export function isBlackKey(midi: Midi): boolean {
  return SHARP_SPELLING[pitchClass(midi)]?.[1] !== 0;
}

/** Spells a MIDI note; black keys as sharps unless `prefer` is 'flat'. */
export function spell(midi: Midi, prefer: AccidentalPreference = 'sharp'): Spelling {
  const table = prefer === 'sharp' ? SHARP_SPELLING : FLAT_SPELLING;
  const [letter, accidental] = table[pitchClass(midi)] ?? ['C', 0];
  return { letter, accidental, octave: Math.floor(midi / 12) - 1 };
}

/** Converts a spelling or a string like 'C4', 'F#3', 'Bb2' to MIDI. */
export function toMidi(note: Spelling | string): Midi {
  const s = typeof note === 'string' ? parse(note) : note;
  return (s.octave + 1) * 12 + LETTER_PC[s.letter] + s.accidental;
}

function parse(text: string): Spelling {
  const m = /^([A-G])(#|b)?(-?\d+)$/.exec(text);
  if (!m) throw new Error(`Invalid note: ${text}`);
  const accidental: Accidental = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0;
  return { letter: m[1] as Letter, accidental, octave: Number(m[3]) };
}

export interface LabelOptions {
  naming?: NoteNaming;
  prefer?: AccidentalPreference;
  octave?: boolean;
}

/** Display name: solfège by default, letters as a setting (D-51). */
export function noteLabel(midi: Midi, opts: LabelOptions = {}): string {
  const { naming = 'solfege', prefer = 'sharp', octave = false } = opts;
  const s = spell(midi, prefer);
  const base =
    naming === 'solfege' ? (he.notes.solfege[LETTERS.indexOf(s.letter)] ?? s.letter) : s.letter;
  const acc = s.accidental === 1 ? he.notes.sharp : s.accidental === -1 ? he.notes.flat : '';
  return `${base}${acc}${octave ? s.octave : ''}`;
}

const CLEF_BOTTOM_LINE: Record<Clef, Spelling> = {
  treble: { letter: 'E', accidental: 0, octave: 4 },
};

const diatonicIndex = (s: Spelling) => s.octave * 7 + LETTERS.indexOf(s.letter);

/**
 * Vertical staff position in diatonic steps from the bottom line (0).
 * Even = line, odd = space; the staff spans 0..8.
 */
export function staffStep(
  midi: Midi,
  clef: Clef = 'treble',
  prefer: AccidentalPreference = 'sharp',
): number {
  return diatonicIndex(spell(midi, prefer)) - diatonicIndex(CLEF_BOTTOM_LINE[clef]);
}

/** Steps of the ledger lines needed to draw a note at `step`. */
export function ledgerLines(step: number): number[] {
  const lines: number[] = [];
  for (let l = -2; l >= step; l -= 2) lines.push(l);
  for (let l = 10; l <= step; l += 2) lines.push(l);
  return lines;
}
