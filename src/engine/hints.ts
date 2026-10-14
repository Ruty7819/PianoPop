import type { Skill } from '../content/types';
import { staffStep, type Clef, type Midi } from './notes';

export type HintType = 'short-hint' | 'explanation' | 'replay-demo';

/** Ear exercises get the replay only inside the menu; elsewhere it is a free button (D-23). */
export function hintMenuTypes(skill: Skill): HintType[] {
  return skill === 'ear'
    ? ['short-hint', 'explanation', 'replay-demo']
    : ['short-hint', 'explanation'];
}

/** Every menu pick counts, reopening included (approved 14.10.2026); free replay doesn't (D-23). */
export function countsAsHint(type: HintType, skill: Skill): boolean {
  return type !== 'replay-demo' || skill === 'ear';
}

export type StaffPlace = { kind: 'line' | 'space'; n: number } | { kind: 'below' | 'above' };

/** Where a note sits on the staff, lines/spaces counted from the bottom. */
export function staffPlace(midi: Midi, clef: Clef = 'treble'): StaffPlace {
  const step = staffStep(midi, clef);
  if (step < 0) return { kind: 'below' };
  if (step > 8) return { kind: 'above' };
  return step % 2 === 0 ? { kind: 'line', n: step / 2 + 1 } : { kind: 'space', n: (step + 1) / 2 };
}
