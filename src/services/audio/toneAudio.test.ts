import { describe, expect, it, vi } from 'vitest';
import { createToneAudioService } from './toneAudio';

function fakeTone(contextState = 'running') {
  const sampler = {
    triggerAttackRelease: vi.fn(),
    triggerAttack: vi.fn(),
    triggerRelease: vi.fn(),
  };
  const destination = { mute: false, volume: { value: 0 } };
  const ctx = { state: contextState, lookAhead: 0.1, rawContext: { currentTime: 12.5 } };
  const tone = {
    start: vi.fn(() => Promise.resolve()),
    loaded: vi.fn(() => Promise.resolve()),
    getContext: () => ctx,
    getDestination: () => destination,
    Frequency: (m: number) => ({ toFrequency: () => 440 * 2 ** ((m - 69) / 12) }),
    Sampler: vi.fn(function () {
      return { ...sampler, toDestination: () => sampler };
    }),
    MembraneSynth: vi.fn(function () {
      return { toDestination: () => ({ triggerAttackRelease: vi.fn() }) };
    }),
  };
  return { tone, sampler, destination, ctx };
}

const make = (contextState?: string) => {
  const f = fakeTone(contextState);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const audio = createToneAudioService(() => Promise.resolve(f.tone as any));
  return { audio, ...f };
};

describe('ToneAudioService', () => {
  it('goes idle → starting → loading → ready and uses the audio clock', async () => {
    const { audio, ctx } = make();
    const states: string[] = [];
    audio.subscribe((s) => states.push(s));
    expect(audio.state).toBe('idle');
    expect(audio.now()).toBe(0);
    await audio.start();
    expect(states).toEqual(['starting', 'loading', 'ready']);
    expect(ctx.lookAhead).toBe(0);
    expect(audio.now()).toBe(12.5);
  });

  it('start() is idempotent', async () => {
    const { audio, tone } = make();
    await Promise.all([audio.start(), audio.start()]);
    expect(tone.start).toHaveBeenCalledTimes(1);
  });

  it('becomes blocked when the context does not run, and can retry', async () => {
    const { audio, ctx } = make('suspended');
    await expect(audio.start()).rejects.toThrow();
    expect(audio.state).toBe('blocked');
    ctx.state = 'running';
    await audio.start();
    expect(audio.state).toBe('ready');
  });

  it('ignores notes before ready, plays after', async () => {
    const { audio, sampler } = make();
    audio.playNote(60);
    expect(sampler.triggerAttackRelease).not.toHaveBeenCalled();
    await audio.start();
    audio.playNote(69, 0.5, 3);
    expect(sampler.triggerAttackRelease).toHaveBeenCalledWith(440, 0.5, 3);
  });

  it('playSequence schedules relative to startAt and returns end time', async () => {
    const { audio, sampler } = make();
    await audio.start();
    const end = audio.playSequence(
      [
        { midi: 60, at: 0, dur: 0.5 },
        { midi: 62, at: 0.5, dur: 1 },
      ],
      10,
    );
    expect(sampler.triggerAttackRelease).toHaveBeenCalledTimes(2);
    expect(sampler.triggerAttackRelease.mock.calls[1]?.[2]).toBe(10.5);
    expect(end).toBe(11.5);
  });

  it('applies volume and mute to the destination', async () => {
    const { audio, destination } = make();
    await audio.start();
    audio.setVolume(1);
    audio.setMuted(true);
    expect(destination.volume.value).toBe(0);
    expect(destination.mute).toBe(true);
  });
});
