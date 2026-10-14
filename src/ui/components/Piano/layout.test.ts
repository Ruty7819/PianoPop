import { describe, expect, it } from 'vitest';
import { clampStart, defaultStart, layoutKeys } from './layout';

describe('layoutKeys', () => {
  it('spans N octaves plus the closing C', () => {
    const keys = layoutKeys(48, 2);
    expect(keys).toHaveLength(25);
    expect(keys[0]?.midi).toBe(48);
    expect(keys.at(-1)?.midi).toBe(72);
    expect(keys.filter((k) => !k.black)).toHaveLength(15);
  });

  it('places white keys edge to edge and black keys on the boundary', () => {
    const keys = layoutKeys(60, 1);
    const whites = keys.filter((k) => !k.black);
    expect(whites[0]?.left).toBe(0);
    expect((whites.at(-1)?.left ?? 0) + (whites.at(-1)?.width ?? 0)).toBeCloseTo(100);
    const cSharp = keys.find((k) => k.midi === 61);
    const d = keys.find((k) => k.midi === 62);
    expect((cSharp?.left ?? 0) + (cSharp?.width ?? 0) / 2).toBeCloseTo(d?.left ?? -1);
  });
});

describe('clampStart', () => {
  it('snaps to C and stays on the piano', () => {
    expect(clampStart(62, 2)).toBe(60);
    expect(clampStart(0, 2)).toBe(24);
    expect(clampStart(100, 4)).toBe(60);
  });
});

describe('defaultStart', () => {
  it('keeps middle C visible', () => {
    for (const oct of [2, 3, 4]) {
      const start = defaultStart(oct);
      expect(start).toBeLessThanOrEqual(60);
      expect(start + 12 * oct).toBeGreaterThan(60);
    }
  });
});
