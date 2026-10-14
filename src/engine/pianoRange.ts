import type { Midi } from './notes';

/**
 * Lowest visible C: the notes' range sits in the middle of the visible octaves,
 * extra room going below first (approved 14.10.2026).
 */
export function pianoStartFor(notes: readonly Midi[], octaves: number): Midi {
  const low = Math.floor(Math.min(...notes) / 12) * 12;
  const high = Math.floor(Math.max(...notes) / 12) * 12 + 12;
  const spare = Math.max(0, octaves - (high - low) / 12);
  return low - 12 * Math.ceil(spare / 2);
}
