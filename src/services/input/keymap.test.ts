import { describe, expect, it } from 'vitest';
import { codeToMidi, keyLabelFor } from './keymap';

describe('keymap', () => {
  it('maps codes relative to the base', () => {
    expect(codeToMidi('KeyA', 60)).toBe(60);
    expect(codeToMidi('KeyK', 60)).toBe(72);
    expect(codeToMidi('KeyJ', 48)).toBe(59);
    expect(codeToMidi('KeyZ', 60)).toBeUndefined();
  });

  it('gives the key label for a midi', () => {
    expect(keyLabelFor(60, 60)).toBe('A');
    expect(keyLabelFor(61, 60)).toBe('W');
    expect(keyLabelFor(76, 60)).toBe(';');
    expect(keyLabelFor(59, 60)).toBeUndefined();
  });
});
