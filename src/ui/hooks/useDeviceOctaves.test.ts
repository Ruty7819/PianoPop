import { describe, expect, it } from 'vitest';
import { octavesFor } from './useDeviceOctaves';

describe('octavesFor (D-70)', () => {
  it('phone → 2 in either orientation', () => {
    expect(octavesFor(390, 844, true)).toBe(2);
    expect(octavesFor(844, 390, true)).toBe(2);
  });
  it('tablet → 3', () => {
    expect(octavesFor(1024, 768, true)).toBe(3);
  });
  it('desktop → 4, narrow window → 3', () => {
    expect(octavesFor(1440, 900, false)).toBe(4);
    expect(octavesFor(800, 900, false)).toBe(3);
  });
});
