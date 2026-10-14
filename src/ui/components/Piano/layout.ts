import { isBlackKey, type Midi } from '../../../engine';
import type { KeyLayout } from './types';

/** Scroll bounds: lowest start C1, highest end C8 (88-key piano top). */
export const MIN_START: Midi = 24;
export const MAX_END: Midi = 108;
const BLACK_RATIO = 0.6;

/** Keys from startMidi up to and including the C `octaves` above it. */
export function layoutKeys(startMidi: Midi, octaves: number): KeyLayout[] {
  const end = startMidi + 12 * octaves;
  let whiteCount = 0;
  for (let m = startMidi; m <= end; m++) if (!isBlackKey(m)) whiteCount++;
  const whiteWidth = 100 / whiteCount;
  const blackWidth = whiteWidth * BLACK_RATIO;

  const keys: KeyLayout[] = [];
  let whiteIndex = 0;
  for (let m = startMidi; m <= end; m++) {
    if (isBlackKey(m)) {
      keys.push({
        midi: m,
        black: true,
        left: whiteIndex * whiteWidth - blackWidth / 2,
        width: blackWidth,
      });
    } else {
      keys.push({ midi: m, black: false, left: whiteIndex * whiteWidth, width: whiteWidth });
      whiteIndex++;
    }
  }
  return keys;
}

/** Keeps the visible range on a C inside the piano. */
export function clampStart(startMidi: Midi, octaves: number): Midi {
  const maxStart = MAX_END - 12 * octaves;
  const c = startMidi - (((startMidi % 12) + 12) % 12);
  return Math.min(Math.max(c, MIN_START), maxStart);
}

/** Range centred on middle C (60). */
export function defaultStart(octaves: number): Midi {
  return clampStart(60 - 12 * Math.floor(octaves / 2), octaves);
}
