import { describe, expect, it } from 'vitest';
import { isBlackKey, ledgerLines, noteLabel, spell, staffStep, toMidi } from './notes';

describe('spell', () => {
  it('spells naturals with scientific octave (60 = C4)', () => {
    expect(spell(60)).toEqual({ letter: 'C', accidental: 0, octave: 4 });
    expect(spell(69)).toEqual({ letter: 'A', accidental: 0, octave: 4 });
    expect(spell(21)).toEqual({ letter: 'A', accidental: 0, octave: 0 });
    expect(spell(108)).toEqual({ letter: 'C', accidental: 0, octave: 8 });
  });

  it('spells black keys as sharps by default, flats on request', () => {
    expect(spell(61)).toEqual({ letter: 'C', accidental: 1, octave: 4 });
    expect(spell(61, 'flat')).toEqual({ letter: 'D', accidental: -1, octave: 4 });
    expect(spell(70, 'flat')).toEqual({ letter: 'B', accidental: -1, octave: 4 });
  });
});

describe('toMidi', () => {
  it('parses note strings', () => {
    expect(toMidi('C4')).toBe(60);
    expect(toMidi('A0')).toBe(21);
    expect(toMidi('F#3')).toBe(54);
    expect(toMidi('Bb2')).toBe(46);
    expect(toMidi('Cb4')).toBe(59);
    expect(toMidi('B#3')).toBe(60);
    expect(toMidi('C-1')).toBe(0);
  });

  it('round-trips with spell', () => {
    for (let m = 21; m <= 108; m++) {
      expect(toMidi(spell(m))).toBe(m);
      expect(toMidi(spell(m, 'flat'))).toBe(m);
    }
  });

  it('rejects invalid strings', () => {
    expect(() => toMidi('H4')).toThrow();
    expect(() => toMidi('C')).toThrow();
  });
});

describe('isBlackKey', () => {
  it('detects black keys in every octave', () => {
    expect([60, 61, 62, 63, 64, 65, 66].map(isBlackKey)).toEqual([
      false,
      true,
      false,
      true,
      false,
      false,
      true,
    ]);
    expect(isBlackKey(22)).toBe(true);
    expect(isBlackKey(71)).toBe(false);
  });
});

describe('noteLabel', () => {
  it('uses solfège by default (D-51)', () => {
    expect(noteLabel(60)).toBe('דו');
    expect(noteLabel(65)).toBe('פה');
    expect(noteLabel(67)).toBe('סול');
    expect(noteLabel(71)).toBe('סי');
    expect(noteLabel(61)).toBe('דו♯');
    expect(noteLabel(61, { prefer: 'flat' })).toBe('רה♭');
  });

  it('supports letter names and octave numbers', () => {
    expect(noteLabel(60, { naming: 'letters' })).toBe('C');
    expect(noteLabel(66, { naming: 'letters', octave: true })).toBe('F♯4');
    expect(noteLabel(48, { octave: true })).toBe('דו3');
  });
});

describe('staffStep (treble)', () => {
  it('counts diatonic steps from the bottom line E4', () => {
    expect(staffStep(64)).toBe(0); // E4 bottom line
    expect(staffStep(65)).toBe(1); // F4 first space
    expect(staffStep(77)).toBe(8); // F5 top line
    expect(staffStep(60)).toBe(-2); // middle C, one ledger line below
    expect(staffStep(81)).toBe(10); // A5, one ledger line above
  });

  it('places accidentals on the step of their letter', () => {
    expect(staffStep(61)).toBe(-2); // C#4
    expect(staffStep(61, 'treble', 'flat')).toBe(-1); // Db4
  });
});

describe('ledgerLines', () => {
  it('returns ledger line steps needed outside the staff', () => {
    expect(ledgerLines(0)).toEqual([]);
    expect(ledgerLines(8)).toEqual([]);
    expect(ledgerLines(-1)).toEqual([]);
    expect(ledgerLines(-2)).toEqual([-2]);
    expect(ledgerLines(-5)).toEqual([-2, -4]);
    expect(ledgerLines(10)).toEqual([10]);
    expect(ledgerLines(13)).toEqual([10, 12]);
  });
});
