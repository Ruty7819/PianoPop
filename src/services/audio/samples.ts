import type { Midi } from '../../engine';

export const SAMPLE_BASE_URL = `${import.meta.env.BASE_URL}samples/salamander/`;

/** Salamander keys we ship: C, D#, F#, A of each octave (every 3rd semitone), A0..C8. */
export const SAMPLE_LOW: Midi = 21; // A0
export const SAMPLE_HIGH: Midi = 108; // C8

const FILE_NAMES: Record<number, string> = { 0: 'C', 3: 'Ds', 6: 'Fs', 9: 'A' };
const TONE_NAMES: Record<number, string> = { 0: 'C', 3: 'D#', 6: 'F#', 9: 'A' };

export function isSampled(midi: Midi): boolean {
  return midi >= SAMPLE_LOW && midi <= SAMPLE_HIGH && midi % 3 === 0;
}

/** Tone.Sampler `urls` map: scientific note name → file name. */
export function sampleUrls(): Record<string, string> {
  const urls: Record<string, string> = {};
  for (let midi = SAMPLE_LOW; midi <= SAMPLE_HIGH; midi++) {
    if (!isSampled(midi)) continue;
    const pc = midi % 12;
    const octave = Math.floor(midi / 12) - 1;
    urls[`${TONE_NAMES[pc]}${octave}`] = `${FILE_NAMES[pc]}${octave}.mp3`;
  }
  return urls;
}

/** Linear 0..1 → decibels for Tone's destination volume. */
export function volumeToDb(volume: number): number {
  const v = Math.min(1, Math.max(0, volume));
  return v === 0 ? -Infinity : 20 * Math.log10(v);
}
