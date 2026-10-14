import { describe, expect, it } from 'vitest';
import { pianoStartFor } from './pianoRange';

const Q = [64, 67, 71, 74, 77, 65, 69, 72, 76, 60];

describe('pianoStartFor', () => {
  it('centres the question range in the visible octaves', () => {
    // Q spans C4..C6 (2 octaves).
    expect(pianoStartFor(Q, 2)).toBe(60);
    expect(pianoStartFor(Q, 3)).toBe(48);
    expect(pianoStartFor(Q, 4)).toBe(48);
    expect(pianoStartFor([64, 67], 4)).toBe(36);
  });

  it('starts at the lowest question when the range is wider than the piano', () => {
    expect(pianoStartFor([59, 84], 2)).toBe(48);
  });
});
