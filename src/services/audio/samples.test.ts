import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isSampled, sampleUrls, volumeToDb } from './samples';

describe('sampleUrls', () => {
  const urls = sampleUrls();

  it('maps 30 notes from A0 to C8 using Tone names and Salamander file names', () => {
    expect(Object.keys(urls)).toHaveLength(30);
    expect(urls['A0']).toBe('A0.mp3');
    expect(urls['C4']).toBe('C4.mp3');
    expect(urls['D#4']).toBe('Ds4.mp3');
    expect(urls['F#4']).toBe('Fs4.mp3');
    expect(urls['C8']).toBe('C8.mp3');
  });

  it('every mapped file exists in public/samples', () => {
    const dir = resolve(__dirname, '../../../public/samples/salamander');
    for (const file of Object.values(urls)) expect(existsSync(resolve(dir, file)), file).toBe(true);
  });

  it('isSampled', () => {
    expect(isSampled(60)).toBe(true);
    expect(isSampled(61)).toBe(false);
    expect(isSampled(18)).toBe(false);
  });
});

describe('volumeToDb', () => {
  it('maps 1 → 0 dB, 0 → -Infinity, clamps', () => {
    expect(volumeToDb(1)).toBe(0);
    expect(volumeToDb(0)).toBe(-Infinity);
    expect(volumeToDb(2)).toBe(0);
    expect(volumeToDb(0.5)).toBeCloseTo(-6.02, 1);
  });
});
